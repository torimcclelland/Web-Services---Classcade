const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require('./db');

const taskRoutes = require('./services/taskService');
const projectRoutes = require('./services/projectService');
const notificationRoutes = require('./services/notificationService');
const userRoutes = require('./services/userService');
const chatRoutes = require('./services/chatService');
const storeRoutes = require('./services/storeService');
const calendarRoutes = require('./services/calendarService');
const scheduleRoutes = require('./services/scheduleService');
const zoomRoutes = require('./services/zoomService');
const storeApiDocsRoutes = require('./my-api-docs/routes/storeRoute');
const calendarApiDocsRoutes = require('./my-api-docs/routes/calendarRoute');
const chatApiDocsRoutes = require('./my-api-docs/routes/chatRoute');
const notificationApiDocsRoutes = require('./my-api-docs/routes/notificationRoute');
const projectApiDocsRoutes = require('./my-api-docs/routes/projectRoute');
const scheduleApiDocsRoutes = require('./my-api-docs/routes/scheduleRoute');
const taskApiDocsRoutes = require('./my-api-docs/routes/taskRoute');
const userApiDocsRoutes = require('./my-api-docs/routes/userRoute');
const zoomApiDocsRoutes = require('./my-api-docs/routes/zoomRoute');

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Classcade API',
      version: '1.0.0',
      description: 'This documentation shows all of the endpoints available within Classcade.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  // Paths to files containing API definitions
  apis: ['./my-api-docs/routes/*.js'],
};

// Generate the OpenAPI specification
const specs = swaggerJsdoc(options);

// Serve the Swagger UI on a specific route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/task', taskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/', calendarApiDocsRoutes);
app.use('/', chatApiDocsRoutes);
app.use('/', notificationApiDocsRoutes);
app.use('/', projectApiDocsRoutes);
app.use('/', scheduleApiDocsRoutes);
app.use('/', storeApiDocsRoutes);
app.use('/', taskApiDocsRoutes);
app.use('/', userApiDocsRoutes);
app.use('/', zoomApiDocsRoutes);

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