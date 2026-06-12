import { google } from "@ai-sdk/google";
import { generateImage } from "ai";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createImageRecord, StrapiError } from "@/lib/strapi";

const IMAGE_MODEL = "gemini-3.1-flash-image";

type GoogleImageAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const ASPECT_RATIOS: GoogleImageAspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9"];

const MEDIA_TYPE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parseAspectRatio(value: unknown): GoogleImageAspectRatio {
  if (typeof value === "string" && ASPECT_RATIOS.includes(value as GoogleImageAspectRatio)) {
    return value as GoogleImageAspectRatio;
  }
  return "1:1";
}

async function saveGeneratedImage(base64: string, mediaType: string) {
  const extension = MEDIA_TYPE_EXTENSIONS[mediaType] ?? "png";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const publicPath = `/generated-images/${fileName}`;

  const outputDir = join(process.cwd(), "public", "generated-images");

  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, fileName), Buffer.from(base64, "base64"));

  return publicPath;
}

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = await getCurrentUser();

  if (!jwt || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, aspectRatio } = body;

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  const parsedAspectRatio = parseAspectRatio(aspectRatio);

  try {
    const result = await generateImage({
      model: google.image(IMAGE_MODEL),
      prompt,
      n: 1,
      providerOptions: {
        google: {
          aspectRatio: parsedAspectRatio,
        },
      },
    });

    const file = result.image;
    const imageUrl = await saveGeneratedImage(file.base64, file.mediaType);

    const record = await createImageRecord(jwt, {
      prompt,
      imageUrl,
    });

    return Response.json({
      model: IMAGE_MODEL,
      documentId: record.documentId,
      prompt: record.prompt,
      imageUrl: record.imageUrl,
    });
  } catch (error) {
    console.error("Image route error:", error);

    if (error instanceof StrapiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}