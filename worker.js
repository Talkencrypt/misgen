export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // Allow your GitHub Pages site to call this Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // We only need GET
    if (request.method !== "GET") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Only GET requests are allowed."
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Example:
    // https://YOUR-WORKER.workers.dev/vin/1J4GL58K46W201071

    const match = url.pathname.match(/^\/vin\/([^/]+)$/);

    if (!match) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Use /vin/YOUR_VIN"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    const vin = match[1].toUpperCase();

    // Validate VIN
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "VIN must be 17 characters."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // AutoPartsAPI
    const apiURL =
      `https://auto-parts-catalog.apiprofile.com/api/vin/decoder-v5/${vin}`;

    try {

      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          "x-apiprofile-key": env.AUTOPARTS_API_KEY,
          "Accept": "application/json"
        }
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });

    } catch (error) {

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  }
};

