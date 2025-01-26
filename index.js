const express = require("express");
const client = require("prom-client");

const app = express();
const register = new client.Registry();

// Configurar métricas padrão para o Prometheus
client.collectDefaultMetrics({ register });

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/data", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
