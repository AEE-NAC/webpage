# Utiliser la dernière version de Node.js
FROM node:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances, y compris les devDependencies
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port pour le serveur de développement (généralement 3000 pour React)
EXPOSE 3000

# Lancer en mode développement
CMD ["npm", "run", "dev"]
