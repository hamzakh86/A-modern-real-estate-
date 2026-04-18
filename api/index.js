import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

// Support des différents noms de variable
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO;

if (!mongoURI) {
  console.error('❌ ERREUR: Aucune URI MongoDB trouvée dans .env');
  console.error('Ajoutez MONGO, MONGODB_URI ou MONGO_URI dans votre fichier .env');
  process.exit(1);
}

console.log('🔍 Tentative de connexion à MongoDB...');

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes API
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Serveur des fichiers statiques (production)
app.use(express.static(path.join(__dirname, '/client/dist')));

// Route pour SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}!`);
});
