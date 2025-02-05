const express = require("express");
const { createClient } = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

async function connectRedis() {
  try {
    await client.connect();
    console.log("✅ Connected to Redis successfully");
  } catch (err) {
    console.error("❌ Redis connection error:", err);
  }
}

connectRedis();

app.get("/", async (req, res) => {
  try {
    await client.set("message", "Hello from Redis!");
    const message = await client.get("message");
    res.send(`Redis says: ${message}`);
  } catch (err) {
    console.error("Error accessing Redis:", err);
    res.status(500).send("Error connecting to Redis");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
