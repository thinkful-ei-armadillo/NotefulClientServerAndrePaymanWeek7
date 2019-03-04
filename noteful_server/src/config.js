module.exports = {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DATABASE_URL || 'postgresql://paypay@localhost/noteful',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
