require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 4000,
  goldRatePerGram24kInr: Number(process.env.GOLD_RATE_PER_GRAM_24K_INR) || 6500,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  regulatoryMaxLtvPercent: 75,
  dedupeWindowDays: 7,
};

module.exports = config;
