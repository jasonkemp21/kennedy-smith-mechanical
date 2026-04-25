export default {
  async fetch(request, env) {
    const expectedUser = env.SITE_USERNAME || "preview";
    const expectedPass = env.SITE_PASSWORD;

    if (!expectedPass) {
      return new Response("Site password not configured.", { status: 500 });
    }

    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Basic ")) {
      return unauthorized();
    }

    let decoded;
    try {
      decoded = atob(auth.slice(6).trim());
    } catch {
      return unauthorized();
    }

    const sep = decoded.indexOf(":");
    if (sep === -1) return unauthorized();

    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    if (user !== expectedUser || pass !== expectedPass) {
      return unauthorized();
    }

    return env.ASSETS.fetch(request);
  },
};

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="K&S Preview", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}
