export const KITSU_BASE_URL = "https://kitsu.io/api/edge";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function handleRateLimit(response, limit = 10) {
  if (response.status === 429) {
    return Response.json(
      {
        error: "Rate limit exceeded",
        type: "RATE_LIMIT_EXCEEDED",
        retryAfter: 60, // Default retry after
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": "60",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }
  return null;
}

export async function fetchKitsu(endpoint, params = {}, options = {}) {
  // Determine requested limit and offset
  const requestedLimit = parseInt(params["page[limit]"] || params["limit"] || 20);
  const requestedOffset = parseInt(params["page[offset]"] || params["offset"] || 0);

  // If limit is within Kitsu's max (20), do a single fetch
  if (requestedLimit <= 20) {
    const response = await _fetchKitsuSingle(endpoint, params, options);
    if (!response.ok) return response;
    
    const data = await response.json();
    if (data.data && Array.isArray(data.data)) {
      const uniqueData = Array.from(new Map(data.data.map(item => [item.id, item])).values());
      data.data = uniqueData;
    }
    
    return {
      ...response,
      ok: true,
      status: 200,
      json: async () => data,
    };
  }

  // Otherwise, perform multiple fetches to satisfy the requested limit
  const fetchPromises = [];
  let remaining = requestedLimit;
  let currentOffset = requestedOffset;

  while (remaining > 0) {
    const currentLimit = Math.min(remaining, 20);
    const chunkParams = { ...params };
    
    // Ensure we set the correct pagination keys for this chunk
    chunkParams["page[limit]"] = currentLimit;
    chunkParams["page[offset]"] = currentOffset;
    
    // Remove the simple 'limit' if it exists to avoid confusion
    if (chunkParams["limit"]) delete chunkParams["limit"];
    if (chunkParams["offset"]) delete chunkParams["offset"];

    fetchPromises.push(_fetchKitsuSingle(endpoint, chunkParams, options));

    remaining -= currentLimit;
    currentOffset += currentLimit;
  }

  try {
    const responses = await Promise.all(fetchPromises);

    // Check for any failed requests
    const failedResponse = responses.find((r) => !r.ok);
    if (failedResponse) return failedResponse;

    // Merge and deduplicate the data from all chunks
    const jsonResults = await Promise.all(responses.map((r) => r.json()));
    
    const allData = jsonResults.flatMap((j) => j.data || []);
    const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());

    const allIncluded = jsonResults.flatMap((j) => j.included || []);
    const uniqueIncluded = Array.from(new Map(allIncluded.map(item => [`${item.type}-${item.id}`, item])).values());

    const mergedData = {
      data: uniqueData,
      included: uniqueIncluded,
      meta: jsonResults[0]?.meta || { count: 0 },
      links: jsonResults[0]?.links || {},
    };

    // Return a synthetic response object that matches the Fetch API Response interface
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mergedData,
      headers: responses[0].headers,
    };
  } catch (error) {
    console.error("Fetch chunking error:", error);
    throw error; // Will be caught by handleError in the route
  }
}

async function _fetchKitsuSingle(endpoint, params = {}, options = {}) {
  const url = new URL(`${KITSU_BASE_URL}${endpoint}`);

  // Construct Kitsu specific query params
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        url.searchParams.append(`filter[${nestedKey}]`, nestedValue);
      });
    } else if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const defaultHeaders = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    "User-Agent": "AnimeApp/1.0",
  };

  return fetch(url.toString(), {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
  });
}


export function createResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { ...corsHeaders },
  });
}

export function handleError(error, message = "Internal Server Error") {
  console.error(message, error);
  return Response.json(
    { error: message, details: error.message },
    {
      status: 500,
      headers: { ...corsHeaders },
    }
  );
}
