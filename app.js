const navbar = document.getElementById("navbar");
const snapRoot = document.getElementById("snapRoot");
const heroParallax = document.getElementById("heroParallax");
const yearEl = document.getElementById("year");

yearEl.textContent = String(new Date().getFullYear());

// Projects (you can reorder anytime)
const projects = [
  {
    title: "RLLC Window Campaign System",
    desc: "Retail-focused visual structure designed to guide attention and amplify storefront impact.",
    img: "./assets/rllc.jpg",
  },
  {
    title: "Yozma Web Platform",
    desc: "A content-first digital writing experience built around clarity and reading flow.",
    img: "./assets/yozma.jpg",
  },
  {
    title: "Registan LC Brand System",
    desc: "Identity framework balancing tradition and modern education — consistent across touchpoints.",
    img: "./assets/registan-brand.jpg",
  },
  {
    title: "Quantum Brand Identity",
    desc: "Minimal, system-based visual language for a conceptual technology brand.",
    img: "./assets/quantum-brand.jpg",
  },
  {
    title: "Tourism Experience Interface",
    desc: "Exploration-first interface concept focused on narrative flow and destination mapping.",
    img: "./assets/tourisms.jpg",
  },
  {
    title: "Education Landing Architecture",
    desc: "Conversion-driven structure designed for modern learning platforms.",
    img: "./assets/learningc.jpg",
  },
  {
    title: "Automotive Aesthetic Poster Series",
    desc: "Cinematic automotive visuals crafted with controlled lighting, depth, and atmosphere.",
    img: "./assets/posterdesign.jpg",
  },
  {
    title: "Image Prompt Engineering System",
    desc: "Structured prompt frameworks for repeatable, high-quality visual output.",
    img: "./assets/promptsystem.jpg",
  },
];

// Render grid: overlay shows on hover
const grid = document.getElementById("projectsGrid");
grid.innerHTML = projects.map((p) => `
  <article class="project" tabindex="0" aria-label="${esc(p.title)}">
    <div class="project-media">
      <img src="${p.img}" alt="${esc(p.title)}" loading="lazy" decoding="async" />
    </div>
    <div class="project-overlay">
      <h3 class="project-title">${esc(p.title)}</h3>
      <p class="project-desc">${esc(p.desc)}</p>
    </div>
  </article>
`).join("");

// Navbar glass on scroll
function handleNavGlass(){
  const y = snapRoot.scrollTop;
  if (y > 8) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}

// Subtle hero parallax (very controlled)
function handleHeroParallax(){
  const y = snapRoot.scrollTop;
  const shift = Math.min(16, y * 0.05); // slower
  heroParallax.style.setProperty("--heroY", `${shift}px`);
}

// Modal
const form = document.getElementById("contactForm");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModal");

function openModal(){
  modalBackdrop.classList.add("show");
  modalBackdrop.setAttribute("aria-hidden", "false");
  closeModalBtn.focus();
}
function closeModal(){
  modalBackdrop.classList.remove("show");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalBackdrop.classList.contains("show")) closeModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
  openModal();
});

// Copy buttons for direct contact
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const val = btn.getAttribute("data-copy") || "";
    try{
      await navigator.clipboard.writeText(val);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = old), 900);
    }catch{
      // fallback: do nothing
    }
  });
});

// Scroll handlers
snapRoot.addEventListener("scroll", () => {
  handleNavGlass();
  handleHeroParallax();
}, { passive: true });

handleNavGlass();
handleHeroParallax();

// Helpers
function esc(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
