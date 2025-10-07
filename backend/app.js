const express = require('express');
const connectDB = require('./db');

const taskRoutes = require('./services/taskService');
const projectRoutes = require('./services/projectService');
const notificationRoutes = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/task', taskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/notification', notificationRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();