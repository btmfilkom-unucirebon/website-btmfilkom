const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");
const heroContainer = document.getElementById("hero-container");

function updateActiveLink(target) {
  const currentPath = window.location.pathname;
  const currentPage =
    currentPath.split("/").pop().replace("html", "") || "index";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active-link");

    const linkPage = href.split("/").pop().replace("html", "").replace("#", "");

    if (target.startsWith("#")) {
      if (href === target) {
        link.classList.add("active-link");
      }
    } else {
      if (currentPage === linkPage && linkPage !== "") {
        link.classList.add("active-link");
      } else if (
        currentPage === "index" &&
        (linkPage === "index" || href === "#beranda")
      ) {
        link.classList.add("active-link");
      }
    }
  });
}

// Inisialisasi saat halaman dimuat
window.addEventListener("load", () => {
  const currentPath = window.location.pathname;

  if (currentPath === "/" || currentPath.endsWith("index.html")) {
    const target = window.location.hash || "#beranda";
    updateActiveLink(target);
  } else {
    updateActiveLink(currentPath);
  }

  // Animasi muncul elemen
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("opacity-0", "-translate-x-10", "translate-x-10");
    el.classList.add("opacity-100", "translate-x-0");
  });
});

// Setup smooth scroll untuk navigasi internal
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetHref = this.getAttribute("href");

    if (targetHref.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(targetHref);
      if (targetElement) {
        const offsetPosition = targetElement.offsetTop - navbar.offsetHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.replaceState(null, null, window.location.pathname);
        updateActiveLink(targetHref);
      }
      if (window.innerWidth < 768) toggleMobileMenu(false);
    }
  });
});

// Toggle menu mobile
function toggleMobileMenu(isOpen) {
  if (isOpen) {
    menuList.classList.remove(
      "opacity-0",
      "pointer-events-none",
      "-translate-y-10"
    );
    menuIcon.setAttribute("d", "M6 18L18 6M6 6l12 12");
  } else {
    menuList.classList.add(
      "opacity-0",
      "pointer-events-none",
      "-translate-y-10"
    );
    menuIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
}

menuBtn.addEventListener("click", () => {
  const isCurrentlyClosed = menuList.classList.contains("opacity-0");
  toggleMobileMenu(isCurrentlyClosed);
});

// Logic Scroll Spy untuk index
window.addEventListener("scroll", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  if (currentPath === "index.html") {
    let currentSection = "";
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;

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

// Klik efek untuk hero image di mobile
if (heroContainer) {
  heroContainer.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      this.classList.toggle("active-mobile");
    }
  });
}

document.addEventListener("click", function (e) {
  if (window.innerWidth < 768 && heroContainer) {
    this.classList.remove("active-mobile");
  }
});

// Intersection Observer untuk animasi scroll
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

document.addEventListener("DOMContentLoaded", () => {
  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
  elementsToReveal.forEach((el) => scrollObserver.observe(el));
});

window.addEventListener("scroll", () => {
  const isBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 50;

  if (isBottom) {
    const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
    elementsToReveal.forEach((el) => {
      if (el.closest("footer")) {
        el.classList.add("reveal-active");
      }
    });
  }
});

// Kontrol kartu departemen
let autoSlideInterval;

function toggleDept(card) {
  const content = card.querySelector(".detail-content");
  const allCards = document.querySelectorAll(".dept-card");
  const slider = card.querySelector(".member-slider");

  const isActive = card.classList.contains("active");

  clearInterval(autoSlideInterval);

  allCards.forEach((c) => {
    c.classList.remove("active", "shadow-xl", "-translate-y-2");
    c.querySelector(".detail-content").style.maxHeight = null;
  });

  if (!isActive) {
    card.classList.add("active", "shadow-xl", "-translate-y-2");
    content.style.maxHeight = content.scrollHeight + "px";

    setTimeout(() => {
      const elementPosition =
        card.getBoundingClientRect().top + window.pageYOffset;
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 100 : 120;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (slider) startAutoSlide(slider);
    }, 500);
  }
}

// Fungsi auto slide slider anggota
function startAutoSlide(slider) {
  autoSlideInterval = setInterval(() => {
    const firstItem = slider.querySelector(".flex-none");

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
