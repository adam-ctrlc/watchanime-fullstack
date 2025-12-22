import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "../config";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      "filter[status]": "upcoming",
      sort: "-start_date",
    };

    const limit = searchParams.get("page[limit]");
    const offset = searchParams.get("page[offset]");

    if (limit) params["page[limit]"] = limit;
    if (offset) params["page[offset]"] = offset;

    const response = await fetchKitsu("/anime", params);

    const rateLimitResponse = handleRateLimit(response);
    if (rateLimitResponse) return rateLimitResponse;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.errors?.[0]?.detail || response.statusText);
    }

    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    return handleError(error, "Failed to fetch upcoming anime");
  }
}
