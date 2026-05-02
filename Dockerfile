FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY api/ ./api/

# Exposer le port de l'API
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
