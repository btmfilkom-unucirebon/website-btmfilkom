const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");
const heroContainer = document.getElementById("hero-container");

function updateActiveLink(target) {
  const currentPath = window.location.pathname;
  const currentPage =
    currentPath.split("/").pop().replace("html", "").toLowerCase() || "index";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active-link");

    const linkPage = href
      .split("/")
      .pop()
      .replace(".html", "")
      .replace("#", "")
      .toLowerCase();

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
// publikasi
 
const dbBerita = [
    {
        id: 1,
        judul: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        tanggal: "30 Des 2025",
        kategori: "terbaru",
        deskripsi: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
        isBaru: true
    },
    {
        id: 2,
        judul: "Sed ut perspiciatis unde omnis iste natus error",
        tanggal: "29 Des 2025",
        kategori: "terbaru",
        deskripsi: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
        fullContent: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
        isBaru: false
    },
    {
        id: 3,
        judul: "At vero eos et accusamus et iusto odio dignissimos",
        tanggal: "28 Des 2025",
        kategori: "terbaru",
        deskripsi: "Ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.",
        fullContent: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.",
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop",
        isBaru: false
    },
    {
        id: 4,
        judul: "Excepteur sint occaecat cupidatat non proident",
        tanggal: "20 Des 2024",
        kategori: "arsip",
        deskripsi: "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
        fullContent: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop",
        isBaru: false
    },
    {
        id: 5,
        judul: "Duis aute irure dolor in reprehenderit",
        tanggal: "15 Des 2024",
        kategori: "arsip",
        deskripsi: "Voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        fullContent: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
        img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
        isBaru: false
    }
];

const dbDokumentasi = [
    { id: 101, judul: "Dokumentasi 1", tanggal: "Jan 2025", img: "../image/img-home.webp", deskripsi: "Lorem ipsum dolor sit amet." },
    { id: 102, judul: "Dokumentasi 2", tanggal: "Jan 2025", img: "../image/img-subHome.webp", deskripsi: "Consectetur adipiscing elit." },
    { id: 103, judul: "Dokumentasi 3", tanggal: "Jan 2025", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop", deskripsi: "Sed do eiusmod tempor." }
];


// 2. RENDER KARTU (PAKAI TEMPLATE)

function renderCards(data, containerId, type = 'berita') {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = ''; 

    const templateBerita = document.getElementById('template-card-berita');
    const templateDok = document.getElementById('template-card-dok');

    data.forEach(item => {
        let clone;
        if (type === 'berita') {
            clone = templateBerita.content.cloneNode(true);
            const cardItem = clone.querySelector('.card-item');
            cardItem.onclick = () => openDetail(item.id, type);
            
            clone.querySelector('.card-img').src = item.img;
            clone.querySelector('.card-img').alt = item.judul;
            clone.querySelector('.card-title').textContent = item.judul;
            clone.querySelector('.card-desc').textContent = item.deskripsi;
            clone.querySelector('.card-date-top').textContent = item.tanggal;
            clone.querySelector('.card-date-bottom').textContent = item.tanggal;

            if (item.isBaru) {
                clone.querySelector('.card-badge').classList.remove('hidden');
            }
        } else {
            clone = templateDok.content.cloneNode(true);
            const cardItem = clone.querySelector('.card-item');
            cardItem.onclick = () => openDetail(item.id, type);
            clone.querySelector('.card-img').src = item.img;
            clone.querySelector('.card-title').textContent = item.judul;
            clone.querySelector('.card-date').textContent = item.tanggal;
        }
        container.appendChild(clone);
    });
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
    const beritaTerbaru = dbBerita.filter(item => item.kategori === 'terbaru');
    const beritaArsip = dbBerita.filter(item => item.kategori === 'arsip');

    renderCards(beritaTerbaru, 'container-berita-terbaru', 'berita');
    renderCards(beritaArsip, 'container-arsip', 'berita');
    renderCards(dbDokumentasi, 'container-dokumentasi', 'dokumentasi');
});

// 3. NAVIGATION SYSTEM

function openDetail(id, type) {
    let item;
    if (type === 'berita') item = dbBerita.find(x => x.id === id);
    else item = dbDokumentasi.find(x => x.id === id);

    if (!item) return;

    // Isi Konten
    document.getElementById('detail-title').innerText = item.judul;
    document.getElementById('detail-date').innerText = item.tanggal;
    document.getElementById('detail-img').src = item.img;
    document.getElementById('detail-desc').innerText = item.fullContent || item.deskripsi;
    
    // KONTROL TOMBOL
    const btnDownload = document.getElementById('btn-download');
    
    if (type === 'berita') {
        btnDownload.classList.add('hidden');
        btnDownload.classList.remove('flex');
    } else {
        btnDownload.classList.remove('hidden');
        btnDownload.classList.add('flex');
    }

    // Switch View
    document.getElementById('main-panel').classList.add('hidden');
    document.getElementById('main-panel').classList.remove('flex');
    document.getElementById('full-list-panel').classList.add('hidden');
    document.getElementById('full-list-panel').classList.remove('flex');

    document.getElementById('detail-view-panel').classList.remove('hidden');
    document.getElementById('detail-view-panel').classList.add('flex');
    
    window.scrollTo(0,0);
}

function closeDetailView() {
    document.getElementById('detail-view-panel').classList.add('hidden');
    document.getElementById('detail-view-panel').classList.remove('flex');
    
    document.getElementById('main-panel').classList.remove('hidden');
    document.getElementById('main-panel').classList.add('flex');
    window.scrollTo(0,0);
}

// 4. ACTION FUNCTIONS (Share & Download & Toast)

function shareSocial(platform) {
    const url = window.location.href; 
    const text = "Cek info terbaru dari BTM FILKOM!";

    if (platform === 'wa') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    } 
    else if (platform === 'copy') {
        // Salin ke Clipboard lalu Tampilkan Toast
        navigator.clipboard.writeText(url).then(() => {
            showToast();
        });
    }
}

function showToast() {
    const toast = document.getElementById('toast-notification');
    
    // Munculkan
    toast.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    toast.classList.add('opacity-100', 'scale-100');
    
    // Hilangkan setelah 2 detik
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'scale-100');
        toast.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    }, 2000);
}

function downloadImage() {
    const imgSrc = document.getElementById('detail-img').src;
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = 'Dokumentasi-BTM.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 5. HELPER FUNCTIONS

let currentListData = [];
let currentListType = '';

function openFullListView(type) {
    const titleEl = document.getElementById('full-list-title');
    
    if(type === 'terbaru') {
        titleEl.innerText = "Semua Berita Terbaru";
        currentListData = dbBerita; 
        currentListType = 'berita';
    } else if (type === 'selesai') {
        titleEl.innerText = "Arsip Berita Selesai";
        currentListData = dbBerita.filter(i => i.kategori === 'arsip');
        currentListType = 'berita';
    } else {
        titleEl.innerText = "Semua Dokumentasi";
        currentListData = dbDokumentasi;
        currentListType = 'dokumentasi';
    }

    renderCards(currentListData, 'container-full-list', currentListType);
    document.getElementById('main-panel').classList.add('hidden');
    document.getElementById('main-panel').classList.remove('flex');
    document.getElementById('full-list-panel').classList.remove('hidden');
    document.getElementById('full-list-panel').classList.add('flex');
    window.scrollTo(0,0);
}

function closeFullListView() {
    document.getElementById('full-list-panel').classList.add('hidden');
    document.getElementById('full-list-panel').classList.remove('flex');
    document.getElementById('main-panel').classList.remove('hidden');
    document.getElementById('main-panel').classList.add('flex');
    window.scrollTo(0,0);
}

function searchGlobal(query) {
    const term = query.toLowerCase();
    const filtered = currentListData.filter(item => item.judul.toLowerCase().includes(term));
    renderCards(filtered, 'container-full-list', currentListType);
}

function switchTab(tabName) {
    document.getElementById('tab-content-berita').style.display = (tabName === 'berita') ? 'block' : 'none';
    document.getElementById('tab-content-dokumentasi').style.display = (tabName === 'dokumentasi') ? 'block' : 'none';
    
    const btnBerita = document.getElementById('tab-btn-berita');
    const btnDok = document.getElementById('tab-btn-dokumentasi');
    const activeClass = "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm bg-nav text-white shadow-md transition-all underline underline-offset-4 decoration-2 decoration-acsent";
    const inactiveClass = "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm text-gray-500 hover:text-acsent transition-all";
    
    if(tabName === 'berita') {
        btnBerita.className = activeClass;
        btnDok.className = inactiveClass;
    } else {
        btnDok.className = activeClass;
        btnBerita.className = inactiveClass;
    }
}