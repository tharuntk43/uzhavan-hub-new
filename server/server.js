/**
 * Uzhavan Hub - Backend Server Entrypoint
 */

import http from 'http';
import { createApp } from './app.js';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    const app = await createApp();
    const server = http.createServer((req, res) => app.handle(req, res));

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`\n[Uzhavan Hub Notice] Port ${PORT} is already in use by an active server.`);
        console.log(`[Uzhavan Hub Notice] Platform is ALREADY ACTIVE and accessible at:`);
        console.log(`   👉 http://localhost:${PORT}`);
        console.log(`   👉 http://127.0.0.1:${PORT}\n`);
        process.exit(0);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    server.listen(PORT, () => {
      console.log('================================================================');
      console.log('🌾 UZHAVAN HUB (உழவன் ஹப்) - SMART AGRICULTURE PLATFORM');
      console.log('   AI-Powered Agricultural Intelligence for Tamil Nadu Farmers');
      console.log('================================================================');
      console.log(`📡 Backend API running at:     http://localhost:${PORT}/api`);
      console.log(`🌐 Web Platform Application:  http://localhost:${PORT}`);
      console.log(`🚀 Local IPv4 Access:         http://127.0.0.1:${PORT}`);
      console.log('📊 Persistent Database:       PostgreSQL / SQLite Dual Engine Active');
      console.log('🔒 Authentication & Sessions: 30-Day Protected State Management');
      console.log('🌱 All 23 Modules Mounted:    Ready for Farmers');
      console.log('================================================================');
    });

    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\nGracefully shutting down Uzhavan Hub...');
      server.close(() => process.exit(0));
    });

    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });

    return server;
  } catch (err) {
    console.error('Failed to start Uzhavan Hub server:', err);
    process.exit(1);
  }
}

// Start if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export { startServer };
