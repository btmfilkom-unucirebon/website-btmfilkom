const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");
const heroContainer = document.getElementById("hero-container");

// -- FUNGSI UTAMA: Update Status Aktif --
// -- FUNGSI UTAMA: Update Status Aktif --
function updateActiveLink(target) {
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === "/" || currentPath.endsWith("index.html");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active-link"); // Reset semua dulu

    // 1. Logika untuk Halaman Utama (Scroll Spy / Hash)
    if (isHomePage) {
      if (href === target || (target === "#beranda" && href === "#beranda")) {
        link.classList.add("active-link");
      }
    }
    // 2. Logika untuk Halaman Luar (Publikasi dll)
    else {
      // Cek apakah href di menu (misal: 'page/publikasi.html') ada di dalam URL saat ini
      // Kita hilangkan '../' jika ada untuk perbandingan yang akurat
      const pageName = currentPath.split("/").pop();

      if (href.includes(pageName) && pageName !== "") {
        link.classList.add("active-link");
      }
    }
  });
}

// -- 1. INITIAL LOAD --
window.addEventListener("load", () => {
  const currentPath = window.location.pathname;

  // Jika di Beranda
  if (currentPath === "/" || currentPath.endsWith("index.html")) {
    // Jika ada hash (misal #departemen), gunakan itu, jika tidak gunakan #beranda
    const target = window.location.hash || "#beranda";
    updateActiveLink(target);
  }
  // Jika di halaman lain (Publikasi)
  else {
    updateActiveLink(currentPath);
  }

  // Trigger reveal animations
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("opacity-0", "-translate-x-10", "translate-x-10");
    el.classList.add("opacity-100", "translate-x-0");
  });
});

// -- 2. SMOOTH SCROLL --
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

// -- 4. SCROLL SPY (Hanya aktif di Index) --
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

// android click effect for images
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

// ANIMASI REVEAL ON SCROLL
const observerOptions = {
  threshold: 0.1, // Elemen akan muncul jika 15% bagiannya terlihat
  rootMargin: "0px 0px -50px 0px", // Trigger sedikit sebelum elemen benar-benar mentok bawah
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Tambahkan class aktif saat masuk layar
      entry.target.classList.add("reveal-active");
    }
  });
}, observerOptions);

// Daftarkan semua elemen yang ingin dianimasikan
document.addEventListener("DOMContentLoaded", () => {
  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
  elementsToReveal.forEach((el) => scrollObserver.observe(el));
});

window.addEventListener("scroll", () => {
  // Cek apakah scroll sudah mencapai 95% dari total tinggi halaman
  const isBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 50;

  if (isBottom) {
    elementsToReveal.forEach((el) => {
      // Jika elemen ada di dalam footer, langsung munculkan
      if (el.closest("footer")) {
        el.classList.add("reveal-active");
      }
    });
  }
});

// DEPARTEMEN CARD HOVER EFFECT
let autoSlideInterval;

function toggleDept(card) {
  const content = card.querySelector(".detail-content");
  const allCards = document.querySelectorAll(".dept-card");
  const slider = card.querySelector(".member-slider");

  // 1. Cek apakah kartu ini sudah terbuka
  const isActive = card.classList.contains("active");

  // reset interval setiap kali klik
  clearInterval(autoSlideInterval);

  // 2. Tutup semua kartu lain
  allCards.forEach((c) => {
    c.classList.remove("active", "shadow-xl", "-translate-y-2");
    c.querySelector(".detail-content").style.maxHeight = null;
  });

  // 3. Jika kartu yang diklik tadinya tertutup, sekarang buka
  if (!isActive) {
    card.classList.add("active", "shadow-xl", "-translate-y-2");
    content.style.maxHeight = content.scrollHeight + "px";

    // 4. Fitur Auto-Scroll: Berikan jeda sedikit agar animasi buka selesai
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

function startAutoSlide(slider) {
  autoSlideInterval = setInterval(() => {
    // 1. Ambil item pertama
    const firstItem = slider.querySelector(".flex-none");

    // 2. Beri efek geser ke kanan
    slider.scrollTo({
      left: slider.clientWidth,
      behavior: "smooth",
    });

    // 3. Tunggu animasi geser selesai (600ms), lalu pindahkan elemen
    setTimeout(() => {
      // Pindahkan foto pertama ke urutan paling terakhir secara instan
      slider.appendChild(firstItem);
      // Reset posisi scroll ke nol tanpa animasi (karena foto sudah pindah)
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = 0;
      // Kembalikan ke mode smooth untuk geseran berikutnya
      slider.style.scrollBehavior = "smooth";
    }, 600); // 600ms adalah durasi rata-rata smooth scroll browser
  }, 2500); // Geser setiap 2.5 detik
}
