document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.getElementById("nav");
  let lastScrollY = window.scrollY;

  // --- PRELOADER SIMULATSIYASI ---
  // Haqiqiy resurslar yuklanishini kutmasdan, "tizim ishga tushishi" effektini beramiz
  setTimeout(() => {
    body.classList.add("loaded");
    body.classList.remove("loading");
  }, 2500); // 2.5 soniya "yuklanish"

  // --- NAVIGATSIYA SKROLL EFFEKTI ---
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Pastga skroll qilganda menyuni yashirish (agar tepada bo'lmasa)
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.classList.add("is-hidden");
    } else {
      nav.classList.remove("is-hidden");
    }

    // Tepadan tushganda shisha effektini kuchaytirish
    if (currentScrollY > 50) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // --- SILLIQ SKROLL (Smooth Scroll) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Navigatsiya balandligini hisobga olish
        const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim().replace('px','') || 90;
        const targetPosition = targetElement.offsetTop - parseInt(navHeight) - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- TERMINAL PREVIEW (Suzuvchi Rasm) ---
  // Faqat kompyuterda (hover bor joyda) ishlaydi
  if (window.matchMedia("(hover: hover)").matches) {
    const preview = document.querySelector(".terminal-preview");
    const previewImg = document.getElementById("preview-img");
    const dataRows = document.querySelectorAll(".data-row");
    const terminalBody = document.querySelector(".terminal-body");

    if (preview && previewImg && dataRows.length > 0) {
      dataRows.forEach(row => {
        row.addEventListener("mouseenter", () => {
          const imgSrc = row.getAttribute("data-img");
          if (imgSrc) {
            previewImg.src = imgSrc;
            preview.classList.add("is-active");
          }
        });

        row.addEventListener("mouseleave", () => {
          preview.classList.remove("is-active");
        });
      });

      // Sichqoncha harakatini kuzatish va rasmni siljitish
      terminalBody.addEventListener("mousemove", (e) => {
        // Terminal oynasiga nisbatan koordinatalar
        const rect = terminalBody.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Rasmni sichqonchadan biroz uzoqroqda ushlash
        preview.style.transform = `translate(${x + 30}px, ${y - 100}px) scale(1)`;
      });
    }
  }

  // --- FORMA VA MODAL MANTIG'I ---
  const form = document.getElementById("uplinkForm");
  const modal = document.getElementById("modal");
  const modalCloseBtns = document.querySelectorAll("[data-close]");

  const openModal = () => {
    modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden"; // Modal ochiqligida skrollni bloklash
  };

  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  modalCloseBtns.forEach(btn => btn.addEventListener("click", closeModal));

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = form.getAttribute("action");
      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector(".cyber-btn__text");
      const originalText = btnText.textContent;

      // Formspree ID tekshiruvi
      if (action.includes("YOUR_FORMSPREE_ID")) {
        alert("SYSTEM ERROR: Formspree ID not configured. Uplink failed.");
        return;
      }

      // Tugma holatini o'zgartirish
      submitBtn.disabled = true;
      btnText.textContent = "TRANSMITTING...";

      try {
        const response = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          form.reset();
          openModal();
        } else {
          throw new Error("Transmission failed");
        }
      } catch (error) {
        alert("UPLINK ERROR: Connection lost. Please attempt transmission via alternative channels (Telegram).");
      } finally {
        // Tugmani asl holiga qaytarish
        submitBtn.disabled = false;
        btnText.textContent = originalText;
      }
    });
  }
});
