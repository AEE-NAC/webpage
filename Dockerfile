# Étape 1 : Construire l'application avec Node.js v20
FROM node:20 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2 : Exécuter l'application avec un serveur Nginx
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape 1
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 8080

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
