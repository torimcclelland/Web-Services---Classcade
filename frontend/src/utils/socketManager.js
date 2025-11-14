import io from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) {
      console.log('[SocketManager] Socket already exists, reusing');
      return this.socket;
    }
    
    console.log('[SocketManager] Creating new socket connection');
    this.socket = io("http://localhost:4000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('[SocketManager] Socket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketManager] Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketManager] Socket disconnected:', reason);
    });
    
    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      this.connect();
    }
    return this.socket;
  }

  emit(event, data) {
    const socket = this.getSocket();
    if (socket && socket.connected) {
      socket.emit(event, data);
      console.log(`[SocketManager] Emitted ${event}:`, data);
    } else {
      console.error('[SocketManager] Cannot emit, socket not connected');
    }
  }

  on(event, callback) {
    const socket = this.getSocket();
    socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const socket = this.getSocket();
    socket.off(event, callback);
    
    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  joinRoom(roomId) {
    const socket = this.getSocket();
    if (socket.connected) {
      socket.emit("joinRoom", roomId);
      console.log('[SocketManager] Joined room:', roomId);
    } else {
      console.log('[SocketManager] Waiting for connection to join room...');
      socket.once('connect', () => {
        socket.emit("joinRoom", roomId);
        console.log('[SocketManager] Joined room after connection:', roomId);
      });
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Export a singleton instance
const socketManager = new SocketManager();
export default socketManager;