import express from 'express';
import payload from 'payload';
import { initRedis } from '@aengz/payload-redis-cache'

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

initRedis({
  redisUrl: process.env.REDIS_URI
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
  },
})

app.listen(process.env.PAYLOAD_PORT);
