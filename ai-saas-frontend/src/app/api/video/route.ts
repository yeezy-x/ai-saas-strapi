import {
  getAuthToken,
  getCurrentUser,
} from "@/lib/auth";

import {
  listVideoRecords,
  StrapiError,
} from "@/lib/strapi";

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
    const videos =
      await listVideoRecords(jwt);

    return Response.json({
      videos,
    });
  } catch (error) {
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