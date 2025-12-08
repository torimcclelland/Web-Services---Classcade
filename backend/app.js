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
const uploadService = require('./services/uploadService');

const app = express();
const PORT = process.env.PORT || 4000;

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
    apis: ["./my-api-docs/routes/*.js"],
};

const specs = swaggerJsdoc(options);

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
app.use('/api', uploadService);
app.use('/uploads', express.static('uploads'));

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

            socket.on('joinRoom', roomId => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            });

            socket.on('leaveRoom', roomId => {
                socket.leave(roomId);
                console.log(`Socket ${socket.id} left room ${roomId}`);
            });

            socket.on('sendMessage', async msg => {
                try {
                    const messageData = {
                        ...msg,
                        channelId: msg.channelId,
                        conversationId: msg.conversationId
                    };

                    console.log('Saving message:', {
                        channelId: messageData.channelId,
                        conversationId: messageData.conversationId,
                        sender: messageData.sender
                    });

                    const saved = await Chat.create(messageData);

                    const populated = await Chat.findById(saved._id)
                        .populate('sender', 'firstName lastName avatar email')
                        .populate('recipients', 'firstName lastName avatar email');

                    console.log('Populated sender:', populated.sender);

                    const roomId = msg.channelId || msg.conversationId;
                    io.to(roomId).emit('receiveMessage', populated);

                    console.log(`Message sent to room ${roomId}:`, populated._id);
                } catch (err) {
                    console.error('Error saving message:', err);
                    socket.emit('messageError', { error: 'Failed to send message' });
                }
            });

            socket.on('markChannelAsRead', async ({ channelId, userId }) => {
                try {
                    console.log(`[Socket] Marking channel ${channelId} as read for user ${userId}`);

                    const unreadMessages = await Chat.find({
                        channelId: channelId,
                        'readBy.user': { $ne: userId }
                    }).select('_id content sender');

                    console.log(`[Socket] Found ${unreadMessages.length} unread messages in channel ${channelId}`);

                    if (unreadMessages.length > 0) {
                        console.log('[Socket] Sample unread message IDs:', unreadMessages.slice(0, 3).map(m => m._id));
                    }

                    const result = await Chat.updateMany(
                        {
                            channelId: channelId,
                            'readBy.user': { $ne: userId }
                        },
                        {
                            $addToSet: { readBy: { user: userId, readAt: new Date() } }
                        }
                    );

                    console.log(`[Socket] Update result: matched=${result.matchedCount}, modified=${result.modifiedCount}`);

                    io.to(channelId).emit('channelMarkedAsRead', { channelId, userId });
                    console.log(`[Socket] Broadcasted channelMarkedAsRead to channel ${channelId}`);

                } catch (err) {
                    console.error('[Socket] Error marking channel as read:', err);
                }
            });

            socket.on('messagesRead', ({ channelId, userId, count }) => {
                console.log(`${count} messages marked as read in channel ${channelId} by user ${userId}`);
                socket.to(channelId).emit('messagesReadUpdate', { channelId, userId, count });
            });

            socket.on('teamMeetingCreated', ({ projectId, teamMeeting }) => {
                console.log(`Team meeting created for project ${projectId}`);
                io.to(`project_${projectId}`).emit('teamMeetingUpdate', { projectId, teamMeeting });
            });

            socket.on('teamMeetingEnded', ({ projectId }) => {
                console.log(`Team meeting ended for project ${projectId}`);
                io.to(`project_${projectId}`).emit('teamMeetingUpdate', { projectId, teamMeeting: null });
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
