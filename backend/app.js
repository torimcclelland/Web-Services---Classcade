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
const usersApiDocsRoutes = require('./my-api-docs/routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0', // Specifies the OpenAPI version
    info: {
      title: 'My Simple API',
      version: '1.0.0',
      description: 'A basic API to demonstrate Swagger documentation',
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
app.use('/', usersApiDocsRoutes);

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