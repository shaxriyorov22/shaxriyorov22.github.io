// ---------------------------------------------
// OTASH Portfolio — Snap + Stacked Glass Panels
// ---------------------------------------------

const navbar = document.getElementById("navbar");
const snapRoot = document.getElementById("snapRoot");
const heroParallax = document.getElementById("heroParallax");
const yearEl = document.getElementById("year");

yearEl.textContent = String(new Date().getFullYear());

// Projects (9 items)
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
  {
    title: "Visual Composition Study",
    desc: "Editing, layout rhythm, and visual hierarchy explorations for sharper visual control.",
    img: "./assets/photoshop.jpg",
  },
];

// Render project cards
const grid = document.getElementById("projectsGrid");
grid.innerHTML = projects.map((p) => {
  return `
    <article class="project" tabindex="0" aria-label="${escapeHtml(p.title)}">
      <div class="project-media">
        <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
      </div>
    </article>
  `;
}).join("");

// Navbar glass on scroll (snapRoot scroll container)
function handleNavGlass(){
  const y = snapRoot.scrollTop;
  if (y > 8) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}

// Subtle hero parallax (only a small shift)
function handleHeroParallax(){
  const y = snapRoot.scrollTop;
  // very subtle: max ~14px
  const shift = Math.min(14, y * 0.06);
  heroParallax.style.setProperty("--heroY", `${shift}px`);
}

// Stacked overlay behavior using IntersectionObserver
// Active section: panel enters (slide-up + opacity)
// Before section: panel fades out, blurs, scales to 0.98
const sections = Array.from(document.querySelectorAll(".section"));
const io = new IntersectionObserver((entries) => {
  // choose the most visible stage section
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  const activeEl = visible.target;

  // mark active and before
  let activeIndex = sections.indexOf(activeEl);
  sections.forEach((sec, idx) => {
    sec.classList.toggle("is-active", idx === activeIndex);
    sec.classList.toggle("is-before", idx < activeIndex && sec.classList.contains("stage"));
  });
}, {
  root: snapRoot,
  threshold: [0.15, 0.35, 0.55, 0.75]
});

// Observe only stage sections for the overlay logic
sections.forEach((sec) => io.observe(sec));

// Modal logic
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
  // Here you can plug in EmailJS / Formspree later.
  form.reset();
  openModal();
});

// Run
snapRoot.addEventListener("scroll", () => {
  handleNavGlass();
  handleHeroParallax();
}, { passive: true });

// Initial state
handleNavGlass();
handleHeroParallax();

// Helpers
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
