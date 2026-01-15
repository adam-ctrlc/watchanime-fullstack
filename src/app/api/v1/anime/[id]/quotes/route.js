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
    const response = await fetchKitsu(`/anime/${id}/quotes`, {
      include: "character",
    });

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        return createResponse({ data: [] });
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    return handleError(error, "Failed to fetch quotes");
  }
}
