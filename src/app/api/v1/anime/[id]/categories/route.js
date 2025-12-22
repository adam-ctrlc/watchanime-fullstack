import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "../../../config";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;

    const response = await fetchKitsu(`/anime/${id}/categories`);

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    return handleError(error, "Failed to fetch categories");
  }
}
