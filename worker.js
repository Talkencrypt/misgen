export default {
  async fetch(request, env) {

    const hasKey =
      typeof env.AUTOPARTS_API_KEY === "string" &&
      env.AUTOPARTS_API_KEY.length > 0;

    return new Response(
      JSON.stringify({
        secretExists: hasKey,
        secretLength: hasKey
          ? env.AUTOPARTS_API_KEY.length
          : 0,
        looksLikeAutoPartsKey: hasKey
          ? env.AUTOPARTS_API_KEY.startsWith("apk_")
          : false
      }, null, 2),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
};
