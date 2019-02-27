const cache = {};

async function getDirectUrl(ch, token) {
  const u1 = `https://1drv.ms/${ch}/s!${token}`;
  if (cache[u1]) {
    return cache[u1];
  }
  const res1 = await fetch(u1, { redirect: "manual" });
  const u2 = res1.headers.get("Location").replace("/redir?", "/download?");
  const res2 = await fetch(u2, { redirect: "manual" });
  const u3 = res2.headers.get("Location").replace("?download", "?");
  cache[u1] = u3;
  return u3;
}

const handler = async function(request, context) {
  try {
    const parsedUrl = new URL(request.url);
    const { pathname } = parsedUrl;
    const [_, ch, token] = pathname.match(/\/(.)\/s!(.*)$/);
    const url = await getDirectUrl(ch, token);
    return fetch(url, { method: "GET" });
  } catch (e) {
    return new Response("", {
      status: 404
    });
  }
};

addEventListener("fetch", event => {
  event.respondWith(handler(event.request));
});
