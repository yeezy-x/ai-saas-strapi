import { fal } from "@fal-ai/client";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createVideoRecord, StrapiError } from "@/lib/strapi";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = await getCurrentUser();

  if (!jwt || !user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return Response.json(
      { error: "Prompt is required" },
      { status: 400 }
    );
  }

  try {
    const result = await fal.subscribe("fal-ai/veo3", {
      input: { prompt },
    });

    const videoUrl = result.data.video.url;

    const record = await createVideoRecord(jwt, {
      prompt,
      videoUrl,
    });

    return Response.json({
      documentId: record.documentId,
      prompt: record.prompt,
      videoUrl: record.videoUrl,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof StrapiError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return Response.json(
      { error: "Video generation failed" },
      { status: 500 }
    );
  }
}