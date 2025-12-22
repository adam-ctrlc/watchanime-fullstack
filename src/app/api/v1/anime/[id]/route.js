import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "../../config";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;

    // Pass include params if needed, or query params
    const { searchParams } = new URL(request.url);
    const apiParams = {};
    if (searchParams.get("include")) {
      apiParams.include = searchParams.get("include");
    }

    const response = await fetchKitsu(`/anime/${id}`, apiParams);

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      // If 404, return 404
      if (response.status === 404) {
        return Response.json({ error: "Anime not found" }, { status: 404 });
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    return handleError(error, "Failed to fetch anime details");
  }
}
