/* =====================================================================
   SEVEN TRAVEL — interacciones
   JavaScript sin dependencias obligatorias. Lenis (desplazamiento suave)
   se usa si carga; si no, todo funciona igual con el scroll normal.
   ===================================================================== */

// ---------- 1. Datos de contacto: cámbialos aquí y se actualizan en toda la página ----------
const CONTACTO = {
  whatsapp: "573046839246",   // número con indicativo, sin + ni espacios
  email: "",                  // escribe aquí el correo, por ejemplo "hola@seventravel.co". Vacío = no se muestra
};

// Mensaje que llega escrito en WhatsApp según el botón que toquen
const MENSAJES_WA = {
  general: "Hola Seven Travel, los vi en su página y quiero escribirles.",
  marcas: "Hola Seven Travel, represento una marca y nos gustaría trabajar con ustedes.",
  recomendacion: "Hola Seven Travel, les recomiendo este destino para su próxima ruta: ",
};

document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- 2. Enlaces de WhatsApp y correo ----------
document.querySelectorAll("[data-wa]").forEach((a) => {
  const texto = MENSAJES_WA[a.dataset.wa] || MENSAJES_WA.general;
  a.href = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;
});

if (CONTACTO.email) {
  document.querySelectorAll("[data-email]").forEach((a) => {
    const asunto = a.dataset.email === "marcas" ? "Colaboración con Seven Travel" : "Hola Seven Travel";
    a.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(asunto)}`;
    a.hidden = false;
    if (a.parentElement.tagName === "LI") a.parentElement.hidden = false;
  });
  document.querySelectorAll(".js-email-text").forEach((s) => (s.textContent = CONTACTO.email));
}

// ---------- 3. Desplazamiento suave con inercia (Lenis) ----------
let lenis = null;
function iniciarLenis() {
  if (reduceMotion || !window.Lenis) return;
  lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
  document.documentElement.classList.add("lenis");
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  // los enlaces internos (#rutas, #reels...) también se deslizan suave
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const destino = document.querySelector(a.getAttribute("href"));
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { offset: -80, duration: 1.4 });
    });
  });
}
window.addEventListener("load", iniciarLenis);

// ---------- 4. Revelado de elementos al entrar en pantalla ----------
const revelar = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); revelar.unobserve(e.target); }
  }),
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
);
document.querySelectorAll("[data-reveal]").forEach((el) => revelar.observe(el));

// ---------- 5. Encabezado: píldora con fondo al bajar de la portada ----------
const topbar = document.getElementById("topbar");
const hero = document.querySelector(".hero");
new IntersectionObserver(
  ([entry]) => topbar.classList.toggle("is-solid", !entry.isIntersecting),
  { rootMargin: "-90px 0px 0px 0px" }
).observe(hero);

const navLinks = [...document.querySelectorAll(".topbar__nav a")];
const seccionVisible = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
["nosotros", "cafe", "rutas", "reels", "marcas"].forEach((id) => seccionVisible.observe(document.getElementById(id)));

// ---------- 6. Bucle de animación: profundidad en la portada + carretera ----------
const heroPhoto = document.getElementById("heroPhoto");
const heroContent = document.getElementById("heroContent");
const road = document.getElementById("road");
const paint = document.getElementById("roadPaint");
const stops = [...road.querySelectorAll(".road__stops li")];

let pinturaActual = 0;   // lo que se ve
let pinturaObjetivo = 0; // hasta dónde debería ir (nunca retrocede)
let heroY = 0;

function frame() {
  const vh = window.innerHeight;

  // Portada: la foto baja más lento que la página (profundidad) y el texto se desvanece
  const hr = hero.getBoundingClientRect();
  if (hr.bottom > 0) {
    heroY = lerp(heroY, Math.max(0, -hr.top), 0.18);
    heroPhoto.style.transform = `translate3d(0, ${heroY * 0.28}px, 0) scale(${1 + heroY / 6000})`;
    if (window.innerWidth > 700) {
      const p = Math.min(heroY / (hr.height * 0.7), 1);
      heroContent.style.transform = `translate3d(0, ${heroY * -0.12}px, 0)`;
      heroContent.style.opacity = String(1 - p * 0.9);
    }
  }

  // Carretera: la pintura sigue el scroll con suavidad (interpolación) y lo recorrido queda pintado
  const r = road.getBoundingClientRect();
  const avance = Math.min(Math.max((vh * 0.72 - r.top) / r.height, 0), 1);
  pinturaObjetivo = Math.max(pinturaObjetivo, avance);
  pinturaActual = lerp(pinturaActual, pinturaObjetivo, 0.09);
  if (Math.abs(pinturaObjetivo - pinturaActual) < 0.0005) pinturaActual = pinturaObjetivo;
  paint.style.transform = `scaleY(${pinturaActual.toFixed(4)})`;
  const alturaPintada = r.top + r.height * pinturaActual;
  for (const li of stops) {
    if (li.classList.contains("is-passed")) continue;
    const c = li.getBoundingClientRect();
    if (c.top + c.height / 2 <= alturaPintada + 6) li.classList.add("is-passed");
  }

  requestAnimationFrame(frame);
}

if (reduceMotion) {
  stops.forEach((li) => li.classList.add("is-passed"));
} else {
  requestAnimationFrame(frame);
}

// ---------- 7. Clips de café: se cargan y se reproducen solo cuando están en pantalla ----------
const clips = [...document.querySelectorAll("video.clip")];
const verClip = new IntersectionObserver(
  (entries) => entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src) { v.src = v.dataset.src; }
      if (!reduceMotion) v.play().catch(() => {});
    } else {
      v.pause();
    }
  }),
  { rootMargin: "120px 0px", threshold: 0.15 }
);
clips.forEach((v) => verClip.observe(v));

// ---------- 8. Cinta de café: se desliza de lado según el scroll (con suavidad) ----------
const brew = document.getElementById("brew");
const brewTrack = document.getElementById("brewTrack");
let brewX = 0;
function moverCinta() {
  const r = brew.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.bottom > -200 && r.top < vh + 200) {
    // progreso 0 → 1 mientras la cinta cruza la pantalla
    const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
    const recorrido = brewTrack.scrollWidth / 2 - brew.clientWidth * 0.35;
    brewX = lerp(brewX, -p * recorrido, 0.1);
    brewTrack.style.transform = `translate3d(${brewX.toFixed(1)}px, 0, 0)`;
  }
  requestAnimationFrame(moverCinta);
}
if (!reduceMotion) requestAnimationFrame(moverCinta);

// ---------- 9. Reels: se reproducen al tocarlos, uno a la vez ----------
const reels = [...document.querySelectorAll(".reel")];
reels.forEach((reel) => {
  const video = reel.querySelector("video");
  const boton = reel.querySelector(".reel__play");
  boton.addEventListener("click", () => {
    reels.forEach((otro) => { if (otro !== reel) otro.querySelector("video").pause(); });
    video.controls = true;
    video.play();
  });
  video.addEventListener("play", () => reel.classList.add("is-playing"));
  video.addEventListener("ended", () => { reel.classList.remove("is-playing"); video.controls = false; video.load(); });
});
