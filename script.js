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
      const offset = isMobile ? 130 : 120;
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

// publikasi

const dbBerita = [
  {
    id: 1,
    judul: "Pelantikan Pengurus BTM FILKOM",
    tanggal: "2025-06-14",
    kategori: "terbaru",
    deskripsi:
      "Selamat dan Semoga Sukses! Atas dilantiknya pengurus BTM FILKOM Periode 2025 - 2026",
    fullContent: `Cirebon, BTM UNU CIREBON – Badan Tanfidziyah Mahasiswa (BTM) Universitas Nahdlatul Ulama Cirebon telah melaksanakan Pelantikan Raya dan Stadiumm General (14/06). Kegiatan ini menjadi ajang pelantikan resmi bagi seluruh ORMAWA dan UKM UNU CIREBON, khususnya BTM FILKOM!

    Dengan mengusung tema "Membangun Kepemimpinan Progresif, Menguatkan Semangat Kebangsaan", pelantikan ini menjadi langkah awal yang penuh harapan dalam mewujudkan peran aktif dan berintegritas mahasiswa di lingkungan kampus. 

    Selamat dan sukses untuk semua pengurus baru yang telah resmi dilantik!`,
    img: "../image/img-subHome.webp",
    caption: "Pelantikan Pengurus BTM FILKOM",
    isBaru: false,
  },
  {
    id: 2,
    judul: "Fun Futsal Match",
    tanggal: "2025-06-26",
    kategori: "terbaru",
    deskripsi:
      "Sinergi tanpa batas! BTM FILKOM dan BTM UNIV beradu sportivitas dalam laga persahabatan demi mempererat koordinasi antar lembaga.",
    fullContent: `Cirebon, BTM FILKOM – Menjaga hubungan harmonis antar lembaga tidak selalu harus di dalam ruang rapat. BTM FILKOM bersama BTM Universitas (UNIV) sukses menggelar laga persahabatan "Fun Futsal Match" (26/06) sebagai bentuk penguatan relasi dan komunikasi antar pengurus.

    Kegiatan yang berlangsung di lapangan RIZKY FUTSAL ini menjadi ajang "refreshing" sekaligus ruang diskusi santai di luar agenda formal organisasi. Pertandingan berjalan seru dengan aksi saling balas gol, namun suasana keakraban tetap menjadi prioritas utama.`,
    img: "../image/a2.jpg",
    isBaru: false,
  },
  {
    id: 3,
    judul: "Upgrading & Raker",
    tanggal: "2025-07-30",
    kategori: "terbaru",
    deskripsi:
      "Langkah awal menuju perubahan sinergi, kolaborasi, dan komitmen dalam upgrading dan rapat kerja BTM FILKOM",
    fullContent: `Cirebon, BTM FILKOM - Menandai dimulainya perjalanan baru kepengurusan, BTM FILKOM menyelenggarakan kegiatan Upgrading dan Rapat Kerja (30/07). Dengan mengusung tema "Dari visi menjadi aksi: Membangun organisasi unggul dan visioner", agenda ini di fokuskan pada penguatan internal organisasi dan perumusan program kerja satu periode ke depan.
    
    Sesi Upgrading diisi dengan pembekalan soft skills dan manajemen organisasi untuk membekali pengurus agar lebih progresif dan siap menghadapi tantangan. Setelah itu, dilanjutkan dengan pemaparan program kerja dari setiap departemen yang penuh dengan inovasi.
    
    Langkah awal ini menjadi pondasi penting bagi BTM FILKOM untuk terus berkomitmen dalam melayani dan memberikan dampak positif bagi civitas dan lingkungan kampus.`,
    img: "../image/a3.jpg",
    isBaru: false,
  },
  {
    id: 4,
    judul: "Growth Class",
    tanggal: "2025-11-15",
    kategori: "terbaru",
    deskripsi:
      "Program rutin bulanan FILKOM untuk mengasah skill teknis. Kali ini kita bedah syntax dasar HTML sebagai fondasi web programming.",
    fullContent: `Cirebon, BTM FILKOM – Departemen Humas kembali menghadirkan Growth Class "Ngoding Bareng" sebagai bagian dari komitmen BTM FILKOM dalam memfasilitasi pengembangan skill mahasiswa setiap bulannya.
    
    Kegiatan rutin bulanan ini dirancang sebagai wadah belajar intensif namun santai. Pada edisi 15 November 2025, fokus utama adalah pengenalan syntax HTML. Melalui program ini, mahasiswa diajak untuk mulai membangun fondasi yang kuat di dunia pemrograman web tanpa rasa takut menghadapi baris kode.
    
    Belajar bersama terbukti membuat materi yang sulit menjadi lebih mudah dipahami. Suasana kelas yang hidup dengan praktik langsung (hands-on) memastikan setiap peserta pulang dengan pemahaman baru. Sebagai program berkelanjutan, Growth Class akan terus hadir setiap bulan dengan materi-materi IT yang relevan dan dibutuhkan oleh mahasiswa saat ini.
    
    Jangan lewatkan Growth Class edisi bulan depan! Terus pantau informasinya hanya di kanal resmi BTM FILKOM.`,

    img: "../image/growth.jpeg",
    isBaru: true,
  },
];

const dbDokumentasi = [
  {
    id: 101,
    judul: "Dokumentasi Upgrading & Raker BTM FILKOM",
    tanggal: "2025-06-30",
    img: "../image/d1.png",
    deskripsi: "Lorem ipsum dolor sit amet.",
    linkDrive:
      "https://drive.google.com/drive/folders/1VmZoAhKndeRqJmjfDaqvIKKKbalWphSt?usp=drive_link",
  },
  {
    id: 102,
    judul: "Dokumentasi Studi Banding",
    tanggal: "2025-07-02",
    img: "../image/d2.png",
    deskripsi: "Lorem ipsum dolor sit amet.",
    linkDrive:
      "https://drive.google.com/drive/folders/1XDFI4rLVRKNRZnPfB_7e4pbZcPM9GvkH?usp=drive_link",
  },
  {
    id: 103,
    judul: "Dokumentasi Penyambutan MABA FILKOM",
    tanggal: "2025-11-08",
    img: "../image/d3.png",
    deskripsi: "Lorem ipsum dolor sit amet.",
    linkDrive:
      "https://drive.google.com/drive/folders/1QrqfXuS_E-djJUpJ3mWvS7xqI1RAQ0DI?usp=drive_link",
  },
];

// 2. RENDER KARTU (PAKAI TEMPLATE)

function renderCards(data, containerId, type = "berita") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const templateBerita = document.getElementById("template-card-berita");
  const templateDok = document.getElementById("template-card-dok");

  // Ambil waktu sekarang untuk perbandingan
  const hariIni = new Date();

  data.forEach((item) => {
    let clone;
    if (type === "berita") {
      clone = templateBerita.content.cloneNode(true);
      const cardItem = clone.querySelector(".card-item");
      cardItem.onclick = () => openDetail(item.id, type);

      clone.querySelector(".card-img").src = item.img;
      clone.querySelector(".card-img").alt = item.judul;
      clone.querySelector(".card-title").textContent = item.judul;
      clone.querySelector(".card-desc").textContent = item.deskripsi;
      clone.querySelector(".card-date-top").textContent = item.tanggal;
      clone.querySelector(".card-date-bottom").textContent = item.tanggal;

      // --- LOGIKA OTOMATIS BADGE "TERBARU" ---
      const tanggalBerita = new Date(item.tanggal);
      const selisihHari = (hariIni - tanggalBerita) / (1000 * 3600 * 24);

      const badge = clone.querySelector(".card-badge");
      // Badge muncul otomatis jika berita kurang dari 7 hari
      if (selisihHari <= 7) {
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
      // ---------------------------------------
    } else {
      // Logic untuk dokumentasi tetap sama
      clone = templateDok.content.cloneNode(true);
      const cardItem = clone.querySelector(".card-item");
      cardItem.onclick = () => openDetail(item.id, type);
      clone.querySelector(".card-img").src = item.img;
      clone.querySelector(".card-title").textContent = item.judul;
      clone.querySelector(".card-date").textContent = item.tanggal;
    }
    container.appendChild(clone);
  });
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
  const BATAS_ARSIP = 15;
  const hariIni = new Date();

  dbBerita.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const beritaTerbaru = dbBerita.filter((item) => {
    const selisih = (hariIni - new Date(item.tanggal)) / (1000 * 3600 * 24);
    return selisih <= BATAS_ARSIP || item.isBaru === true;
  });

  const beritaArsip = dbBerita.filter((item) => {
    const selisih = (hariIni - new Date(item.tanggal)) / (1000 * 3600 * 24);
    return selisih > BATAS_ARSIP;
  });

  renderCards(beritaTerbaru.slice(0, 3), "container-berita-terbaru", "berita");
  renderCards(beritaArsip.slice(0, 3), "container-arsip", "berita");
  renderCards(
    dbDokumentasi.slice(0, 3),
    "container-dokumentasi",
    "dokumentasi"
  );
});

// 3. NAVIGATION SYSTEM

function openDetail(id, type) {
  let item;
  if (type === "berita") item = dbBerita.find((x) => x.id === id);
  else item = dbDokumentasi.find((x) => x.id === id);

  if (!item) return;

  if (type === "dokumentasi" && item.linkDrive) {
    window.open(item.linkDrive, "_blank");
    return; // Keluar dari fungsi agar tidak membuka panel detail
  }

  // Isi Konten
  document.getElementById("detail-title").innerText = item.judul;
  document.getElementById("detail-date").innerText = item.tanggal;
  document.getElementById("detail-img").src = item.img;

  const captionText = item.caption || item.judul;
  document.querySelector(
    "figcaption"
  ).innerText = `Dokumentasi: ${captionText}`;

  // 4. DESKRIPSI/ISI BERITA (Teks panjang di bawah)
  // Pastikan yang masuk ke sini adalah fullContent
  document.getElementById("detail-desc").innerText =
    item.fullContent || item.deskripsi;
  item.fullContent || item.deskripsi || item.caption;

  const captionEl = document.querySelector("#detail-view-panel figcaption");
  if (captionEl) {
    captionEl.innerText = `Dokumentasi: ${item.caption || item.judul}`;
  }

  // KONTROL TOMBOL
  const btnDownload = document.getElementById("btn-download");

  if (type === "berita") {
    btnDownload.classList.add("hidden");
    btnDownload.classList.remove("flex");
  } else {
    btnDownload.classList.remove("hidden");
    btnDownload.classList.add("flex");
  }

  // Switch View
  document.getElementById("main-panel").classList.add("hidden");
  document.getElementById("main-panel").classList.remove("flex");
  document.getElementById("full-list-panel").classList.add("hidden");
  document.getElementById("full-list-panel").classList.remove("flex");

  document.getElementById("detail-view-panel").classList.remove("hidden");
  document.getElementById("detail-view-panel").classList.add("flex");

  window.scrollTo(0, 0);
}

function closeDetailView() {
  document.getElementById("detail-view-panel").classList.add("hidden");
  document.getElementById("detail-view-panel").classList.remove("flex");

  document.getElementById("main-panel").classList.remove("hidden");
  document.getElementById("main-panel").classList.add("flex");
  window.scrollTo(0, 0);
}

// 4. ACTION FUNCTIONS (Share & Download & Toast)

function shareSocial(platform) {
  const url = window.location.href;
  const text = "Cek info terbaru dari BTM FILKOM!";

  if (platform === "wa") {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  } else if (platform === "copy") {
    // Salin ke Clipboard lalu Tampilkan Toast
    navigator.clipboard.writeText(url).then(() => {
      showToast();
    });
  }
}

function showToast() {
  const toast = document.getElementById("toast-notification");

  // Munculkan
  toast.classList.remove("opacity-0", "pointer-events-none", "scale-95");
  toast.classList.add("opacity-100", "scale-100");

  // Hilangkan setelah 2 detik
  setTimeout(() => {
    toast.classList.remove("opacity-100", "scale-100");
    toast.classList.add("opacity-0", "pointer-events-none", "scale-95");
  }, 2000);
}

// 5. HELPER FUNCTIONS

let currentListData = [];
let currentListType = "";

function openFullListView(type) {
  const titleEl = document.getElementById("full-list-title");

  if (type === "terbaru") {
    titleEl.innerText = "Semua Berita Terbaru";
    currentListData = dbBerita; // Ambil semua data tanpa filter kategori yang salah
    currentListType = "berita";
  } else if (type === "selesai") {
    titleEl.innerText = "Arsip Berita Selesai";
    // Jika kamu ingin benar-benar filter yang sudah lama (lewat 15 hari):
    const hariIni = new Date();
    currentListData = dbBerita.filter((i) => {
      const selisih = (hariIni - new Date(i.tanggal)) / (1000 * 3600 * 24);
      return selisih > 15;
    });
    currentListType = "berita";
  } else {
    titleEl.innerText = "Semua Dokumentasi";
    currentListData = dbDokumentasi;
    currentListType = "dokumentasi";
  }

  // Render SEMUA data (tanpa slice) karena ini tampilan "Lihat Semua"
  renderCards(currentListData, "container-full-list", currentListType);

  // Logic panel switch tetap sama
  document.getElementById("main-panel").classList.add("hidden");
  document.getElementById("main-panel").classList.remove("flex");
  document.getElementById("full-list-panel").classList.remove("hidden");
  document.getElementById("full-list-panel").classList.add("flex");
  window.scrollTo(0, 0);
}

function closeFullListView() {
  document.getElementById("full-list-panel").classList.add("hidden");
  document.getElementById("full-list-panel").classList.remove("flex");
  document.getElementById("main-panel").classList.remove("hidden");
  document.getElementById("main-panel").classList.add("flex");
  window.scrollTo(0, 0);
}

function searchGlobal(query) {
  const term = query.toLowerCase();
  const filtered = currentListData.filter((item) =>
    item.judul.toLowerCase().includes(term)
  );
  renderCards(filtered, "container-full-list", currentListType);
}

function switchTab(tabName) {
  document.getElementById("tab-content-berita").style.display =
    tabName === "berita" ? "block" : "none";
  document.getElementById("tab-content-dokumentasi").style.display =
    tabName === "dokumentasi" ? "block" : "none";

  const btnBerita = document.getElementById("tab-btn-berita");
  const btnDok = document.getElementById("tab-btn-dokumentasi");
  const activeClass =
    "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm bg-nav text-white shadow-md transition-all underline underline-offset-4 decoration-2 decoration-acsent";
  const inactiveClass =
    "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm text-gray-500 hover:text-acsent transition-all";

  if (tabName === "berita") {
    btnBerita.className = activeClass;
    btnDok.className = inactiveClass;
  } else {
    btnDok.className = activeClass;
    btnBerita.className = inactiveClass;
  }
}

// FOOTER UPDATE YEAR
const yearElement = document.getElementById("copyright-year");
const currentYear = new Date().getFullYear();

if (yearElement) {
  yearElement.innerText = currentYear("©");
}
