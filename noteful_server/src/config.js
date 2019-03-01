module.exports = {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/noteful',
  NODE_ENV: process.env.NODE_ENV || 'development',
};