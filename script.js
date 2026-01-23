// script.js

// --- 1. GLOBAL VARIABLES & SELECTORS ---
const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");
const heroContainer = document.getElementById("hero-container");

// --- 2. NAVIGATION LOGIC ---

// Fungsi Update Link Aktif (Export agar bisa dipanggil jika perlu)
export function updateActiveLink(target) {
  const currentPath = window.location.pathname;
  let currentPage = currentPath
    .split("/")
    .pop()
    .replace(/\.html$/, "")
    .toLowerCase();

  if (currentPage === "" || currentPage === "index") {
    currentPage = "index";
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active-link");

    const linkPage =
      href
        .split("/")
        .pop()
        .replace(/\.html$/, "")
        .replace("#", "")
        .toLowerCase() || "index";

    if (target && target.startsWith("#")) {
      if (href === target) {
        link.classList.add("active-link");
      }
    } else {
      if (currentPage === linkPage) {
        link.classList.add("active-link");
      }
      if (
        currentPage === "index" &&
        (linkPage === "index" || href === "#beranda")
      ) {
        link.classList.add("active-link");
      }
    }
  });
}

// Fungsi Toggle Mobile Menu
function toggleMobileMenu(isOpen) {
  if (isOpen) {
    menuList.classList.remove(
      "opacity-0",
      "pointer-events-none",
      "-translate-y-10"
    );
    if(menuIcon) menuIcon.setAttribute("d", "M6 18L18 6M6 6l12 12");
  } else {
    menuList.classList.add(
      "opacity-0",
      "pointer-events-none",
      "-translate-y-10"
    );
    if(menuIcon) menuIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
}

// Event Listener Menu Button
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isCurrentlyClosed = menuList.classList.contains("opacity-0");
    toggleMobileMenu(isCurrentlyClosed);
  });
}

// Smooth Scroll untuk Navigasi Internal
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetHref = this.getAttribute("href");

    // Hanya prevent default jika itu anchor link (#) di halaman yang sama
    if (targetHref.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(targetHref);
      if (targetElement) {
        const offsetPosition = targetElement.offsetTop - (navbar ? navbar.offsetHeight : 0);
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.replaceState(null, null, window.location.pathname);
        updateActiveLink(targetHref);
      }
      if (window.innerWidth < 768) toggleMobileMenu(false);
    }
  });
});

// Scroll Spy (Khusus Halaman Index)
window.addEventListener("scroll", () => {
  const path = window.location.pathname;
  const isIndex =
    path === "/" || path.endsWith("index.html") || path.endsWith("index");

  if (isIndex) {
    let currentSection = "";
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.pageYOffset + (navbar ? navbar.offsetHeight : 0) + 100;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSection = "#" + section.getAttribute("id");
      }
    });

    if (currentSection) {
      updateActiveLink(currentSection);
    }
  }
});

// --- 3. UI ANIMATIONS & EFFECTS ---

// Hero Image Interaction (Mobile)
if (heroContainer) {
  heroContainer.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      this.classList.toggle("active-mobile");
    }
  });
}

document.addEventListener("click", function (e) {
  if (window.innerWidth < 768 && heroContainer && !heroContainer.contains(e.target)) {
    heroContainer.classList.remove("active-mobile");
  }
});

// Intersection Observer (Reveal on Scroll)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal-active");
    }
  });
}, observerOptions);

// --- 4. DEPARTEMEN LOGIC (Accordion & Slider) ---
// Note: Variable ini global di module scope
let autoSlideInterval;

function startAutoSlide(slider) {
  // Clear interval lama jika ada untuk mencegah tumpuk
  if(autoSlideInterval) clearInterval(autoSlideInterval);

  autoSlideInterval = setInterval(() => {
    const firstItem = slider.querySelector(".flex-none");
    if(!firstItem) return;

    slider.scrollTo({
      left: slider.clientWidth,
      behavior: "smooth",
    });

    setTimeout(() => {
      slider.appendChild(firstItem);
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = 0;
      slider.style.scrollBehavior = "smooth";
    }, 600);
  }, 2500);
}

// Kita pasang ke window agar bisa dipanggil via onclick di HTML
window.toggleDept = function(card) {
  const content = card.querySelector(".detail-content");
  const allCards = document.querySelectorAll(".dept-card");
  const slider = card.querySelector(".member-slider");

  const isActive = card.classList.contains("active");

  // Reset semua card lain
  clearInterval(autoSlideInterval);
  allCards.forEach((c) => {
    c.classList.remove("active", "shadow-xl", "-translate-y-2");
    const cContent = c.querySelector(".detail-content");
    if(cContent) cContent.style.maxHeight = null;
  });

  // Jika card yang diklik belum aktif, aktifkan
  if (!isActive) {
    card.classList.add("active", "shadow-xl", "-translate-y-2");
    if(content) content.style.maxHeight = content.scrollHeight + "px";

    setTimeout(() => {
      const elementPosition =
        card.getBoundingClientRect().top + window.pageYOffset;
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 130 : 120;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (slider) startAutoSlide(slider);
    }, 500);
  }
};

// --- 5. GLOBAL UTILITIES ---

// Toast Notification (Exported)
export function showToast(message = "Berhasil!") {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;

  // Bisa custom message jika elemen text ada
  // toast.innerText = message; 

  toast.classList.remove("opacity-0", "pointer-events-none", "scale-95");
  toast.classList.add("opacity-100", "scale-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100", "scale-100");
    toast.classList.add("opacity-0", "pointer-events-none", "scale-95");
  }, 2000);
}
// Pasang ke window juga untuk backup jika dipanggil non-module
window.showToast = showToast; 

// --- 6. INITIALIZATION ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Set Active Link
  const currentPath = window.location.pathname;
  if (currentPath === "/" || currentPath.endsWith("index.html")) {
    const target = window.location.hash || "#beranda";
    updateActiveLink(target);
  } else {
    updateActiveLink(currentPath);
  }

  // 2. Setup Reveal Animations
  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
  elementsToReveal.forEach((el) => scrollObserver.observe(el));

  // Animasi Reveal (Text Hero)
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("opacity-0", "-translate-x-10", "translate-x-10");
    el.classList.add("opacity-100", "translate-x-0");
  });

  // Footer reveal trigger
  window.addEventListener("scroll", () => {
    const isBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50;

    if (isBottom) {
      elementsToReveal.forEach((el) => {
        if (el.closest("footer")) {
          el.classList.add("reveal-active");
        }
      });
    }
  });

  // 3. Update Footer Year
  const yearElement = document.getElementById("copyright-year");
  const currentYear = new Date().getFullYear();
  if (yearElement) {
    yearElement.innerText = `© ${currentYear}`;
  }
});