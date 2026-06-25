const sendSSE = (data) => {
  if (!global.sseClients || global.sseClients.length === 0) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  global.sseClients.forEach(client => {
    try { client.res.write(payload); } catch (e) {}
  });
};

module.exports = sendSSE;
