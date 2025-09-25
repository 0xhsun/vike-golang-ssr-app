// Universal BFF API proxy handler - forwards ALL API requests to Go backend
// Any route you create in Go will automatically be accessible through Express

const GO_BACKEND_URL = process.env.GO_BACKEND_URL || "http://localhost:8080";

export const apiProxyHandler = () => async (request, _context, _runtime) => {
    try {
      const url = new URL(request.url);
      const targetUrl = `${GO_BACKEND_URL}${url.pathname}${url.search}`;

      console.log(`🔄 API Proxy: ${request.method} ${url.pathname} → ${targetUrl}`);

      // Prepare headers (remove problematic ones)
      const headers = {};
      request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (!['host', 'connection', 'transfer-encoding'].includes(lowerKey)) {
          headers[key] = value;
        }
      });

      // Prepare request options
      const options = {
        method: request.method,
        headers,
      };

      // Add body for non-GET requests
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        options.body = await request.arrayBuffer();
      }

      // Forward to Go backend
      const response = await fetch(targetUrl, options);

      // Get response data
      const responseData = await response.arrayBuffer();

      console.log(`✅ API Proxy: ${response.status} ${response.statusText}`);

      // Forward response back to client
      return new Response(responseData, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

    } catch (error) {
      console.error(`❌ API Proxy Error:`, error);

      return new Response(JSON.stringify({
        error: "API Proxy Error",
        message: error instanceof Error ? error.message : "Unknown error"
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };