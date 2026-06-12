import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { listImageRecords, StrapiError } from "@/lib/strapi";

export async function GET() {
  const jwt = await getAuthToken();
  const user = await getCurrentUser();
  if (!jwt || !user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
}

  try {
    const images = await listImageRecords(jwt);
    return Response.json({ images });
  } catch (error) {
    console.error("Image list route error:", error);
    if (error instanceof StrapiError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}