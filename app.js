const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

/* Year */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Nav glass on scroll */
const nav = $("#nav");
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Smooth scroll with fixed nav offset */
const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navH")) || 68;
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* Reveal: fade-up */
const reveals = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const ent of entries) {
    if (ent.isIntersecting) ent.target.classList.add("is-visible");
  }
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

/* Modal */
const modal = $("#modal");
const modalText = $("#modalText");

const openModal = (text) => {
  if (!modal) return;
  if (modalText && text) modalText.textContent = text;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

if (modal) {
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.hasAttribute && t.hasAttribute("data-close")) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* Contact form (Formspree) */
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action") || "";

    // If user didn't set Formspree id yet
    if (action.includes("YOUR_FORMSPREE_ID")) {
      e.preventDefault();
      openModal("Replace YOUR_FORMSPREE_ID in index.html to enable submissions.");
      return;
    }

    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const prevText = submitBtn ? submitBtn.textContent : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
        openModal("I’ll reply as soon as possible.");
        setTimeout(closeModal, 2000);
      } else {
        openModal("Something went wrong. Try Email/Telegram instead.");
      }
    } catch {
      openModal("Network error. Try Email/Telegram instead.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevText;
      }
    }
  });
}
