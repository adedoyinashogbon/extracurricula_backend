const logger = (req, res, next) => {
  const timestamp = new Date().toISOString(); // ✅ Adds timestamp
  console.log(`📌 [${timestamp}] ${req.method} request to ${req.url}`);

  // ✅ Log request body (except for GET requests)
  if (req.method !== 'GET' && Object.keys(req.body).length) {
    console.log(`📦 Request Body:`, JSON.stringify(req.body, null, 2));
  }

  next();
};

module.exports = logger;
