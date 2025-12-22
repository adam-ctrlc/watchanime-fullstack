import {
  fetchKitsu,
  createResponse,
  handleError,
  handleRateLimit,
} from "../config";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {};

    searchParams.forEach((value, key) => {
      // Map 'q' to 'filter[text]'
      if (key === "q") {
        params["filter[text]"] = value;
      } else {
        // Forward other known filters directly
        params[key] = value;
      }
    });

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
    return handleError(error, "Failed to search anime");
  }
}
