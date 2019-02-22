const fetch = require("node-fetch").default;

async function getDirectUrl(ch, token) {
  const u1 = `https://1drv.ms/${ch}/s!${token}`;
  const res1 = await fetch(u1, { redirect: "manual " });
  const u2 = res1.headers.get("Location").replace("/redir?", "/download?");
  const res2 = await fetch(u2, { redirect: "manual " });
  const u3 = res2.headers.get("Location");
  return u3.replace("?download", "?");
}

exports.handler = async function(event, context) {
  const { path } = event;
  try {
    const [_, ch, token] = path.match(/.?\/index\/(.)\/s!(.*)$/);
    const url = await getDirectUrl(ch, token);

    return {
      statusCode: 301,
      headers: {
        Location: url
      }
    };
  } catch (e) {
    return {
      statusCode: 404
    };
  }
};
