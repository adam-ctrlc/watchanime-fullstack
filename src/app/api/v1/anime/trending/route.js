import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "../../config";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const response = await fetchKitsu("/trending/anime", { limit: limit });

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      // Handle non-200 responses from Kitsu
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    // Return only the 'data' array as per previous usage
    return createResponse(data.data);
  } catch (error) {
    return handleError(error, "Failed to fetch trending anime");
  }
}
