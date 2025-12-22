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
  const url = new URL(`${KITSU_BASE_URL}${endpoint}`);

  // Construct Kitsu specific query params
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Handle nested filters like filter[status]=upcoming
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

  const response = await fetch(url.toString(), {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
  });

  return response;
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
