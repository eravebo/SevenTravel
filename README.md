# Seven Travel: página web

Página portafolio de Seven Travel (viajes en moto por Colombia). Es un sitio estático: HTML, CSS y JavaScript sin pasos de compilación, así que se publica gratis en GitHub Pages. Usa una sola librería externa, Lenis (desplazamiento suave), cargada desde jsDelivr en una versión fija; si no carga, la página funciona igual.

## Estructura

```
index.html        contenido de la página (textos, secciones, destinos)
styles.css        diseño: colores, tipografía, carretera, animaciones
main.js           contacto (WhatsApp y correo), menú, carretera animada, reels
assets/
  img/            fotos optimizadas (WebP) y la imagen para compartir en redes
  video/          reels comprimidos (MP4) y sus portadas
  logo/           logo en vector (SVG) e íconos de la pestaña
  fonts/          tipografía Barlow (licencia libre SIL OFL)
```

## Publicar en GitHub Pages

1. Crea una cuenta en github.com si no la tienen.
2. Crea un repositorio nuevo, público, por ejemplo `seventravel`. No marques ninguna opción de README.
3. En el repositorio vacío toca "uploading an existing file". Arrastra todo el contenido de esta carpeta (index.html, styles.css, main.js, README.md, .nojekyll y la carpeta assets) y toca "Commit changes".
   Si la web de GitHub no deja subir la carpeta completa, sube primero los archivos sueltos y luego la carpeta assets.
4. Ve a Settings > Pages. En "Build and deployment" elige Source: "Deploy from a branch", Branch: `main` y carpeta `/ (root)`. Guarda.
5. En uno o dos minutos la página queda en `https://TU-USUARIO.github.io/seventravel/`. Ese es el enlace para la bio de Instagram y TikTok.

Con Git desde la terminal es lo mismo:

```bash
cd seventravel-web
git init
git add .
git commit -m "Página de Seven Travel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/seventravel.git
git push -u origin main
```

## Cambios frecuentes

- Correo: en `main.js`, línea `email: ""`. Escribe el correo entre las comillas y aparecen solos los botones de correo.
- WhatsApp: en `main.js`, `whatsapp: "573046839246"`. Los mensajes que llegan escritos están en `MENSAJES_WA`.
- Nuevo destino: en `index.html`, dentro de `<ol class="road__stops">`, copia una línea `<li>Nombre</li>`. Si es pueblo patrimonio usa `<li class="is-heritage">Nombre</li>`. Para cambiar la etiqueta (por ejemplo en un municipio) agrega `data-label="Municipio patrimonio"`.
- Nuevo reel: comprime el video a MP4 (H.264) de máximo 10 MB, ponlo en `assets/video/`, y copia un bloque `<figure class="reel">` cambiando el archivo, el póster y el título.
- Fotos de la galería: guárdalas en `assets/img/` (WebP o JPG, máximo 1600 px) y copia un `<li>` dentro de `gallery__grid`. Las fotos horizontales llevan `class="media is-wide"`. Para que el mosaico no deje huecos en computador, mantén 6 verticales y 2 horizontales, o agrega de a 4 verticales.
- Animaciones: los elementos con `data-reveal` aparecen con desenfoque al hacer scroll; `style="--d: 100ms"` les da un pequeño retraso.

## Dominio propio (opcional)

Si compran un dominio (por ejemplo seventravel.co), en Settings > Pages > Custom domain lo escriben y siguen las instrucciones de DNS que GitHub muestra. Activen "Enforce HTTPS".
