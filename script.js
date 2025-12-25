/**
 * BTM FILKOM Script
 * Menangani navigasi, scroll, dan animasi halaman
 */

const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");

// -- FUNGSI UTAMA: Update Status Aktif Navbar --
function updateActiveLink(targetHref) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === targetHref) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}

// -- 1. INITIAL LOAD --
window.addEventListener("load", () => {
  // Default active state
  updateActiveLink("#beranda");

  // Trigger reveal animations
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("opacity-0", "-translate-x-10", "translate-x-10");
    el.classList.add("opacity-100", "translate-x-0");
  });
});

// -- 2. SMOOTH SCROLL & CLEAN URL --
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");

    // Hanya proses jika href diawali dengan #
    if (targetId.startsWith("#")) {
      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetPosition = targetElement.offsetTop - navbar.offsetHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // HAPUS TANDA PAGAR DARI URL BAR
        window.history.replaceState(null, null, window.location.pathname);

        // Update UI link aktif
        updateActiveLink(targetId);
      }

      // Tutup menu mobile jika sedang terbuka
      if (window.innerWidth < 768) {
        toggleMobileMenu(false);
      }
    }
  });
});

// -- 3. MOBILE MENU TOGGLE --
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

// -- 4. SCROLL SPY (Auto update navbar saat scroll) --
window.addEventListener("scroll", () => {
  let currentSection = "";
  const sections = document.querySelectorAll("section");
  const scrollPosition = window.pageYOffset + navbar.offsetHeight + 50;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = "#" + section.getAttribute("id");
    }
  });

  if (currentSection) {
    updateActiveLink(currentSection);
  }
});
