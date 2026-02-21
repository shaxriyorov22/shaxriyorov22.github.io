const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

/* Dynamic Year */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Glassmorphism Navbar Scroll Effect */
const nav = $("#nav");
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll(); // Init

/* Smooth Scroll with exact offset */
const getNavHeight = () => nav ? nav.offsetHeight : 72;
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    
    e.preventDefault();
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - getNavHeight() - 20;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  });
});

/* Blur-Reveal Staggered Animations */
const reveals = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      // Optional: unobserve after reveal to keep it visible
      io.unobserve(entry.target); 
    }
  });
}, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

reveals.forEach(el => io.observe(el));

/* Modal Logic */
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
    if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal__backdrop")) {
      closeModal();
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

/* Contact Form Handling */
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action");

    if (!action || action.includes("YOUR_FORMSPREE_ID")) {
      e.preventDefault();
      openModal("Birlashtirish uchun HTML faylida Formspree ID ni o'zgartiring.");
      return;
    }

    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "Send";
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
        openModal("Message delivered. I'll get back to you soon.");
      } else {
        openModal("Something went wrong. Try Telegram.");
      }
    } catch (err) {
      openModal("Network error. Try Telegram.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}
