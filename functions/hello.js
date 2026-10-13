export async function onRequest() {
  return new Response(JSON.stringify({ ok: true, hello: 'flux', t: Date.now() }),
    { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
