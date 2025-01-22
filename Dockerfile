# Utiliser Node.js v20 comme base
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application avec npx vite
CMD ["npx", "vite", "--port", "3000", "--host", "0.0.0.0"]
