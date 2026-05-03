import express from 'express';
import dns from 'node:dns';

// Force DNS resolution to use public servers (fixes querySrv ECONNREFUSED on some networks/Windows)
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; // ✅ Ajoute cet import

dotenv.config();

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO;
if (!mongoURI) {
  console.error('❌ ERREUR: Aucune URI MongoDB trouvée dans .env');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const __dirname = path.resolve();
const app = express();

// ✅ CORS avant tout le reste
// ✅ Configuration CORS pour autoriser le local et la prod
const allowedOrigins = ['https://hamzaestate.netlify.app', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(cookieParser());

// Routes API
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Fichiers statiques
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ success: false, statusCode, message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}!`));
