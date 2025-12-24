const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const icon = document.getElementById("menu-icon");

btn.addEventListener("click", () => {
  // Kita melakukan toggle pada class animasi, bukan 'hidden'
  menu.classList.toggle("opacity-0");
  menu.classList.toggle("pointer-events-none");
  menu.classList.toggle("-translate-y-10");

  // Mengecek apakah menu sedang terbuka (tidak punya class opacity-0)
  const isOpen = !menu.classList.contains("opacity-0");

  if (isOpen) {
    // Ikon X (Close)
    icon.setAttribute("d", "M6 18L18 6M6 6l12 12");
  } else {
    // Ikon Hamburger
    icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
});

// Tutup menu saat salah satu link diklik (untuk mobile)
const navLinks = document.querySelectorAll("#menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Hanya jalankan di tampilan mobile
    if (window.innerWidth < 768) {
      menu.classList.add("opacity-0", "pointer-events-none", "-translate-y-10");
      icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    }
  });
});
