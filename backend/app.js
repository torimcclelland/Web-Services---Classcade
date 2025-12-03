require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const connectDB = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat");

const taskRoutes = require("./services/taskService");
const projectRoutes = require("./services/projectService");
const notificationRoutes = require("./services/notificationService");
const userRoutes = require("./services/userService");
const chatRoutes = require("./services/chatService");
const storeRoutes = require("./services/storeService");
const calendarRoutes = require("./services/calendarService");
const scheduleRoutes = require("./services/scheduleService");
const zoomRoutes = require("./services/zoomService");
const timeTrackingRoutes = require("./services/timeTracking");
const storeApiDocsRoutes = require("./my-api-docs/routes/storeRoute");
const calendarApiDocsRoutes = require("./my-api-docs/routes/calendarRoute");
const chatApiDocsRoutes = require("./my-api-docs/routes/chatRoute");
const notificationApiDocsRoutes = require("./my-api-docs/routes/notificationRoute");
const projectApiDocsRoutes = require("./my-api-docs/routes/projectRoute");
const scheduleApiDocsRoutes = require("./my-api-docs/routes/scheduleRoute");
const taskApiDocsRoutes = require("./my-api-docs/routes/taskRoute");
const userApiDocsRoutes = require("./my-api-docs/routes/userRoute");
const zoomApiDocsRoutes = require("./my-api-docs/routes/zoomRoute");
const channelRoutes = require("./services/channelService");

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger configuration options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Classcade API",
            version: "1.0.0",
            description:
                "This documentation shows all of the endpoints available within Classcade.",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Development server",
            },
        ],
    },
    // Paths to files containing API definitions
    apis: ["./my-api-docs/routes/*.js"],
};

// Generate the OpenAPI specification
const specs = swaggerJsdoc(options);

// Serve the Swagger UI on a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/zoom", zoomRoutes);
app.use("/api/time-tracking", timeTrackingRoutes);
app.use("/", calendarApiDocsRoutes);
app.use("/", chatApiDocsRoutes);
app.use("/", notificationApiDocsRoutes);
app.use("/", projectApiDocsRoutes);
app.use("/", scheduleApiDocsRoutes);
app.use("/", storeApiDocsRoutes);
app.use("/", taskApiDocsRoutes);
app.use("/", userApiDocsRoutes);
app.use("/", zoomApiDocsRoutes);
app.use("/api", channelRoutes);

const startServer = async () => {
    try {
        await connectDB();
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', socket => {
            console.log('Socket connected:', socket.id);

            // Join a room (now supports both channels and projects)
            socket.on('joinRoom', roomId => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            });

            // Leave a room
            socket.on('leaveRoom', roomId => {
                socket.leave(roomId);
                console.log(`Socket ${socket.id} left room ${roomId}`);
            });

            // Send message (updated to support channels)
            socket.on('sendMessage', async msg => {
                try {
                    // Create message with both channelId and conversationId for backwards compatibility
                    const messageData = {
                        ...msg,
                        channelId: msg.channelId, // New: channel support
                        conversationId: msg.conversationId // Keep for backwards compatibility
                    };

                    console.log('Saving message:', {
                        channelId: messageData.channelId,
                        conversationId: messageData.conversationId,
                        sender: messageData.sender
                    });

                    // Save the message to database
                    const saved = await Chat.create(messageData);

                    // Populate the sender and recipients with user details before emitting
                    const populated = await Chat.findById(saved._id)
                        .populate('sender', 'firstName lastName avatar email')
                        .populate('recipients', 'firstName lastName avatar email');

                    console.log('Populated sender:', populated.sender);

                    // Emit to the appropriate room (prioritize channelId, fallback to conversationId)
                    const roomId = msg.channelId || msg.conversationId;
                    io.to(roomId).emit('receiveMessage', populated);

                    console.log(`Message sent to room ${roomId}:`, populated._id);
                } catch (err) {
                    console.error('Error saving message:', err);
                    socket.emit('messageError', { error: 'Failed to send message' });
                }
            });

            // Handle messages read event
            socket.on('messagesRead', ({ channelId, userId, count }) => {
                console.log(`${count} messages marked as read in channel ${channelId} by user ${userId}`);
                // Optionally broadcast to other users in the channel
                socket.to(channelId).emit('messagesReadUpdate', { channelId, userId, count });
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
