const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

/* Nav Scroll */
const nav = $("#nav");
window.addEventListener("scroll", () => {
  if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
});

/* Smooth Scroll */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));
    if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" });
  });
});

/* Reveal Animations */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
$$('.reveal').forEach(el => observer.observe(el));

/* Index Floating Image Hover Effect */
const preview = $("#indexPreview");
const previewImg = $("#indexPreviewImg");
const indexItems = $$(".index-item");

if (preview && indexItems.length > 0 && window.innerWidth > 768) {
  indexItems.forEach(item => {
    item.addEventListener("mouseenter", (e) => {
      const imgSrc = item.getAttribute("data-image");
      if (imgSrc) {
        previewImg.src = imgSrc;
        preview.classList.add("is-active");
      }
    });
    
    item.addEventListener("mousemove", (e) => {
      // Rasmni sichqoncha orqasidan ergashtirish
      preview.style.left = e.clientX + 20 + "px";
      preview.style.top = e.clientY + 20 + "px";
    });

    item.addEventListener("mouseleave", () => {
      preview.classList.remove("is-active");
    });
  });
}

/* Modal and Form Logic */
const modal = $("#modal");
const openModal = () => { modal.classList.add("is-open"); };
const closeModal = () => { modal.classList.remove("is-open"); };

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal__backdrop")) closeModal();
  });
}

const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action");
    if (action.includes("YOUR_FORMSPREE_ID")) {
      e.preventDefault();
      alert("Formspree ID ulanmagan!");
      return;
    }

    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        form.reset();
        openModal();
      }
    } catch (err) {
      alert("Xatolik yuz berdi. Iltimos Telegram orqali bog'laning.");
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
