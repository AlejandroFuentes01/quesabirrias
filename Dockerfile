# Usar una imagen base oficial de Node.js
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Definir la variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
