export default () => ({
  port: parseInt(process.env.SERVER_PORT ?? '3001', 10),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/predictor-ball',
  useMongo: (process.env.USE_MONGO ?? 'false').toLowerCase() === 'true',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET ?? 'predictor-ball-dev-secret',
})
