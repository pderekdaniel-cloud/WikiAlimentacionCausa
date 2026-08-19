# Wiki Alimentación — versión preparada para publicar

Esta copia está preparada como aplicación Node/Express + React/Vite para un servicio web como Render.

## Importante

- El proyecto original no se modifica; esta es una copia preparada para despliegue.
- La interfaz, alimentos, datos, recetas, restaurantes y componentes se conservan.
- El flujo de pago de anuncios queda explícitamente en **modo demostración**: no cobra ni verifica pagos reales.
- En el plan gratuito de un hosting sin disco persistente, los archivos que el servidor escriba pueden reiniciarse; los datos base de la aplicación siguen incluidos y el navegador conserva sus datos locales.

## Publicación con Render

1. Sube este proyecto a un repositorio de GitHub.
2. En Render crea un **Web Service** desde ese repositorio.
3. Render puede leer `render.yaml`; si pide los datos manualmente usa:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Espera a que termine el build.
5. Render te dará una URL pública `*.onrender.com`.

El servidor usa `process.env.PORT`, sirve el build de Vite y expone `/api/health`.
