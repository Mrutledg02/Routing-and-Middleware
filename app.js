const express = require('express');
const app = express();
const itemsRoutes = require('./routes/items'); // Import routes
const ExpressError = require('./expressError');

app.use(express.json()); // Parse JSON bodies

app.use('/items', itemsRoutes); // Use items routes

// 404 handler for non-existing routes
app.use((req, res, next) => {
  return next(new ExpressError("Not Found", 404));
});

// Generic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;

// Separate server start file, e.g., server.js
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}