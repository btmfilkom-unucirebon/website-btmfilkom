const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");
const heroContainer = document.getElementById("hero-container");

function updateActiveLink(target) {
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

    if (target.startsWith("#")) {
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
  const path = window.location.pathname;
  const isIndex =
    path === "/" || path.endsWith("index.html") || path.endsWith("index");

  if (isIndex) {
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
Updated upstream
// ==========================================
// LOGIKA KHUSUS HALAMAN PUBLIKASI
// ==========================================

// 1. FUNGSI SWITCH TAB (Berita vs Dokumentasi)
function switchTab(tabName) {
    // Sembunyikan/Tampilkan Konten
    document.getElementById('tab-content-berita').style.display = (tabName === 'berita') ? 'block' : 'none';
    document.getElementById('tab-content-dokumentasi').style.display = (tabName === 'dokumentasi') ? 'block' : 'none';
    
    const btnBerita = document.getElementById('tab-btn-berita');
    const btnDok = document.getElementById('tab-btn-dokumentasi');
    
    // Class untuk tombol Aktif (dengan underline)
    const activeClass = "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm bg-nav text-white shadow-md transition-all underline underline-offset-4 decoration-2 decoration-acsent";
    
    // Class untuk tombol Tidak Aktif
    const inactiveClass = "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm text-gray-500 hover:text-acsent transition-all";
    
    // Terapkan Class
    if(tabName === 'berita') {
        btnBerita.className = activeClass;
        btnDok.className = inactiveClass;
    } else {
        btnDok.className = activeClass;
        btnBerita.className = inactiveClass;
    }
}

// 2. FUNGSI BUKA TAMPILAN PENUH (Lihat Semua)
function openFullView(viewName) {
    // Sembunyikan panel utama
    document.getElementById('main-panel').classList.add('hidden');
    // Tampilkan panel full view yang dipilih
    document.getElementById(`full-view-${viewName}`).classList.remove('hidden');
    // Scroll ke paling atas agar user sadar halaman berubah
    window.scrollTo(0,0);
}

// 3. FUNGSI TUTUP TAMPILAN PENUH (Kembali)
function closeFullView() {
    // Sembunyikan semua panel full view
    document.querySelectorAll('[id^="full-view-"]').forEach(el => el.classList.add('hidden'));
    // Tampilkan kembali panel utama
    document.getElementById('main-panel').classList.remove('hidden');
}

// 4. FUNGSI PENCARIAN (Search)
function searchCards(gridId, query) {
    const grid = document.getElementById(gridId);
    const cards = grid.querySelectorAll('.card-item');
    const term = query.toLowerCase();

    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        // Jika judul mengandung kata kunci, tampilkan (flex), jika tidak sembunyikan (none)
        if(title.includes(term)) {
            card.style.display = 'flex'; // Menggunakan flex agar layout kartu tetap terjaga
        } else {
            card.style.display = 'none';
        }
    });
}

// 5. FUNGSI MODAL (Popup Detail)
function openModal(el) {
    // Ambil data dari atribut elemen yang diklik
    const title = el.getAttribute('data-title');
    const desc = el.getAttribute('data-desc') || 'Tidak ada deskripsi.';
    const img = el.getAttribute('data-img');

    // Isi konten modal
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    
    // Cek apakah ada gambar
    if(img) {
        document.getElementById('modalImg').src = img;
        document.getElementById('modalImgContainer').classList.remove('hidden');
    } else {
        document.getElementById('modalImgContainer').classList.add('hidden');
    }
    
    // --- FITUR KUNCI SCROLL (Agar belakangnya tidak bergerak) ---
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Tampilkan Modal dengan animasi
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    overlay.classList.remove('hidden');
    
    // Sedikit delay agar transisi CSS berjalan halus
    setTimeout(() => { 
        overlay.classList.remove('opacity-0'); 
        content.classList.remove('scale-95'); 
        content.classList.add('scale-100'); 
    }, 10);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    // Animasi menghilang
    overlay.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // --- KEMBALIKAN FUNGSI SCROLL ---
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // Sembunyikan elemen setelah durasi animasi selesai (300ms)
    setTimeout(() => { 
        overlay.classList.add('hidden'); 
    }, 300);
}

// publikasi
// 1. SWITCH TAB UTAMA
function switchTab(tabName) {
  document.getElementById("tab-content-berita").style.display =
    tabName === "berita" ? "block" : "none";
  document.getElementById("tab-content-dokumentasi").style.display =
    tabName === "dokumentasi" ? "block" : "none";

  const btnBerita = document.getElementById("tab-btn-berita");
  const btnDok = document.getElementById("tab-btn-dokumentasi");

  if (tabName === "berita") {
    btnBerita.className =
      "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm bg-nav text-white shadow-md transition-all";
    btnDok.className =
      "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm text-gray-500 hover:text-acsent transition-all";
  } else {
    btnDok.className =
      "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm bg-nav text-white shadow-md transition-all";
    btnBerita.className =
      "w-1/2 md:w-auto px-8 py-2 rounded-md font-bold text-sm text-gray-500 hover:text-acsent transition-all";
  }
}

// 2. OPEN FULL VIEW
function openFullView(viewName) {
  document.getElementById("main-panel").classList.add("hidden");
  document.getElementById(`full-view-${viewName}`).classList.remove("hidden");
  window.scrollTo(0, 0);
}

// 3. CLOSE FULL VIEW
function closeFullView() {
  document
    .querySelectorAll('[id^="full-view-"]')
    .forEach((el) => el.classList.add("hidden"));
  document.getElementById("main-panel").classList.remove("hidden");
}

// 4. SEARCH FUNCTION
function searchCards(gridId, query) {
  const grid = document.getElementById(gridId);
  const cards = grid.querySelectorAll(".card-item");
  const term = query.toLowerCase();

  cards.forEach((card) => {
    const title = card.getAttribute("data-title").toLowerCase();
    if (title.includes(term)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// 5. MODAL
function openModal(el) {
  document.getElementById("modalTitle").innerText =
    el.getAttribute("data-title");
  document.getElementById("modalDesc").innerText =
    el.getAttribute("data-desc") || "Tidak ada deskripsi.";
  const img = el.getAttribute("data-img");

  if (img) {
    document.getElementById("modalImg").src = img;
    document.getElementById("modalImgContainer").classList.remove("hidden");
  } else {
    document.getElementById("modalImgContainer").classList.add("hidden");
  }

  const overlay = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.remove("opacity-0");
    content.classList.remove("scale-95");
    content.classList.add("scale-100");
  }, 10);
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  overlay.classList.add("opacity-0");
  content.classList.remove("scale-100");
  content.classList.add("scale-95");
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 300);
}
 Stashed changes
