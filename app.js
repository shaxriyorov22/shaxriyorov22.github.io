// app.js
// Calm futuristic minimal interactions (no heavy stuff)

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal on scroll
const reveals = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    }
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => io.observe(el));

// Subtle custom cursor (desktop only)
const isTouch = matchMedia("(pointer: coarse)").matches;
if (!isTouch) {
  const c = document.createElement("div");
  c.className = "cursor";
  document.body.appendChild(c);

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  // Hover state
  const hoverables = document.querySelectorAll("a, button, .work");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => c.classList.add("cursor--hover"));
    el.addEventListener("mouseleave", () => c.classList.remove("cursor--hover"));
  });
}

// Add cursor styles via JS to keep files minimal
const style = document.createElement("style");
style.textContent = `
  .cursor{
    position:fixed;
    left:0;top:0;
    width:12px;height:12px;
    border-radius:999px;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(58,141,255,.75));
    box-shadow: 0 0 0 10px rgba(58,141,255,.08), 0 0 26px rgba(58,141,255,.18);
    pointer-events:none;
    z-index:9999;
    transition: width .18s ease, height .18s ease, box-shadow .18s ease, opacity .2s ease;
    opacity:.9;
  }
  .cursor--hover{
    width:18px;height:18px;
    box-shadow: 0 0 0 14px rgba(58,141,255,.10), 0 0 36px rgba(58,141,255,.22);
  }
`;
document.head.appendChild(style);
