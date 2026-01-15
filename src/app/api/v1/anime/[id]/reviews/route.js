import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "@/app/api/v1/config";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const response = await fetchKitsu(`/anime/${id}/reviews`, {
      include: "user",
      "page[limit]": limit,
      sort: "-likes_count",
    });

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    return handleError(error, "Failed to fetch reviews");
  }
}
