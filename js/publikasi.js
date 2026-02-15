// publikasi.js

import { db } from '../config/firebase.js';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { showToast } from '../script.js';

// --- CONFIGURATION ---
const BATAS_HARI_BARU = 7; // Berita dianggap "Terbaru" jika umurnya <= 7 hari

// --- STATE DATA ---
let allBerita = [];
let allDokumentasi = [];
let currentListData = []; 
let currentListType = "";
let currentDetailId = null;

// --- HELPER: Cek Status Berita ---
function isBeritaBaru(item) {
    const hariIni = new Date();
    const tanggalBerita = new Date(item.tanggal);
    const selisihHari = (hariIni - tanggalBerita) / (1000 * 3600 * 24);
    
    // Masuk kategori TERBARU jika: selisih hari <= batas ATAU ada flag isBaru: true
    return selisihHari <= BATAS_HARI_BARU || item.isBaru === true;
}

// --- 1. FETCH DATA ---
async function fetchData() {
    try {
        const qBerita = query(collection(db, "berita"), orderBy("tanggal", "desc"));
        const snapshotBerita = await getDocs(qBerita);
        allBerita = snapshotBerita.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const qDok = query(collection(db, "dokumentasi"), orderBy("tanggal", "desc"));
        const snapshotDok = await getDocs(qDok);
        allDokumentasi = snapshotDok.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        initPage();

        // Deep Linking Check
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        if (urlId) openDetail(urlId);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// --- 2. INIT PAGE (Preview Main Panel) ---
function initPage() {
    // Filter Data berdasarkan status Baru/Lama
    const beritaTerbaru = allBerita.filter(item => isBeritaBaru(item));
    const beritaArsip = allBerita.filter(item => !isBeritaBaru(item));

    // Render Preview (Hanya ambil 3 item teratas dari masing-masing kategori)
    renderCards(beritaTerbaru.slice(0, 3), "container-berita-terbaru", "berita");
    renderCards(beritaArsip.slice(0, 3), "container-arsip", "berita");
    renderCards(allDokumentasi.slice(0, 3), "container-dokumentasi", "dokumentasi");
    
    // Opsional: Tampilkan pesan jika kosong
    if (beritaTerbaru.length === 0) {
        document.getElementById("container-berita-terbaru").innerHTML = 
            `<p class="text-gray-400 text-sm italic col-span-full text-center py-4">Belum ada berita baru dalam ${BATAS_HARI_BARU} hari terakhir.</p>`;
    }
}

// --- 3. RENDER CARDS ---
function renderCards(data, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const templateBerita = document.getElementById("template-card-berita");
    const templateDok = document.getElementById("template-card-dok");

    data.forEach((item) => {
        let clone;
        
        if (type === "berita") {
            clone = templateBerita.content.cloneNode(true);
            const cardItem = clone.querySelector(".card-item");
            
            cardItem.addEventListener('click', () => openDetail(item.id));

            clone.querySelector(".card-img").src = item.img;
            clone.querySelector(".card-img").alt = item.judul;
            clone.querySelector(".card-title").textContent = item.judul;
            clone.querySelector(".card-desc").textContent = item.deskripsi;
            clone.querySelector(".card-date-top").textContent = item.tanggal;
            clone.querySelector(".card-date-bottom").textContent = item.tanggal;

            // Badge "Terbaru" (Opsional: Tetap dimunculkan jika memang kategori terbaru)
            // Kalau tidak mau ada badge sama sekali, biarkan hidden di HTML atau hapus blok ini
            const badge = clone.querySelector(".card-badge");
            if (badge && isBeritaBaru(item)) {
                 // badge.classList.remove("hidden"); // Uncomment jika ingin badge muncul
            }

        } else {
            clone = templateDok.content.cloneNode(true);
            const cardItem = clone.querySelector(".card-item");
            
            cardItem.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (item.gdrive) window.open(item.gdrive, "_blank");
                else alert("Link Google Drive belum tersedia.");
            });
            
            clone.querySelector(".card-img").src = item.img;
            clone.querySelector(".card-title").textContent = item.judul;
            clone.querySelector(".card-date").textContent = item.tanggal;
        }
        container.appendChild(clone);
    });
}

// --- 4. DETAIL VIEW LOGIC (Khusus Berita) ---
function openDetail(id) {
    const item = allBerita.find((x) => x.id === id);
    if (!item) return; // Stop jika bukan berita

    currentDetailId = id;
    const newUrl = `${window.location.pathname}?id=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    document.getElementById("detail-title").innerText = item.judul;
    document.getElementById("detail-date").innerText = item.tanggal;
    document.getElementById("detail-img").src = item.img;
    document.getElementById("detail-desc").innerText = item.fullContent || item.deskripsi;
    
    // Caption Gambar = Judul Berita
    const captionEl = document.getElementById("detail-caption");
    if(captionEl) captionEl.innerText = `Dokumentasi: ${item.judul}`;

    toggleViews('detail');
    window.scrollTo(0, 0);
}

// --- 5. GLOBAL FUNCTIONS ---

window.closeDetailView = function() {
    currentDetailId = null;
    window.history.pushState({}, '', window.location.pathname);
    toggleViews('main');
    window.scrollTo(0, 0);
}

// LOGIKA "LIHAT SEMUA" YANG DIPERBARUI
window.openFullListView = function(type) {
    const titleEl = document.getElementById("full-list-title");
    
    if (type === "terbaru") {
        titleEl.innerText = "Semua Berita Terbaru";
        // Hanya ambil SEMUA berita yang statusnya BARU
        currentListData = allBerita.filter(item => isBeritaBaru(item));
        currentListType = "berita";
    } else if (type === "selesai") {
        titleEl.innerText = "Arsip Berita Selesai";
        // Hanya ambil SEMUA berita yang statusnya LAMA
        currentListData = allBerita.filter(item => !isBeritaBaru(item));
        currentListType = "berita";
    } else {
        titleEl.innerText = "Semua Dokumentasi";
        currentListData = allDokumentasi;
        currentListType = "dokumentasi";
    }

    renderCards(currentListData, "container-full-list", currentListType);
    toggleViews('list');
    window.scrollTo(0, 0);
}

window.closeFullListView = function() {
    toggleViews('main');
    window.scrollTo(0, 0);
}

window.searchGlobal = function(query) {
    const term = query.toLowerCase();
    const filtered = currentListData.filter((item) =>
        item.judul.toLowerCase().includes(term)
    );
    renderCards(filtered, "container-full-list", currentListType);
}

window.shareSocial = function(platform) {
    let shareUrl = window.location.origin + window.location.pathname;
    if (currentDetailId) {
        shareUrl += `?id=${currentDetailId}`;
    }
    const text = "Cek info terbaru dari BTM FILKOM!";

    if (platform === "wa") {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank");
    } else if (platform === "copy") {
        navigator.clipboard.writeText(shareUrl).then(() => showToast("Link berhasil disalin!"));
    }
}

window.switchTab = function(tabName) {
    const contentBerita = document.getElementById("tab-content-berita");
    const contentDok = document.getElementById("tab-content-dokumentasi");
    
    if (contentBerita && contentDok) {
        if (tabName === "berita") {
            contentBerita.classList.remove("hidden");
            contentBerita.classList.add("block");
            contentDok.classList.add("hidden");
            contentDok.classList.remove("block");
        } else {
            contentDok.classList.remove("hidden");
            contentDok.classList.add("block");
            contentBerita.classList.add("hidden");
            contentBerita.classList.remove("block");
        }
    }

    const btnBerita = document.getElementById("tab-btn-berita");
    const btnDok = document.getElementById("tab-btn-dokumentasi");
    const activeClass = "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm bg-nav text-white shadow-md transition-all underline underline-offset-4 decoration-2 decoration-acsent";
    const inactiveClass = "w-1/2 md:w-auto px-6 md:px-8 py-2 rounded-md font-bold text-xs md:text-sm text-gray-500 hover:text-acsent transition-all";

    if (btnBerita && btnDok) {
        if (tabName === "berita") {
            btnBerita.className = activeClass;
            btnDok.className = inactiveClass;
        } else {
            btnDok.className = activeClass;
            btnBerita.className = inactiveClass;
        }
    }
}

function toggleViews(viewName) {
    const mainPanel = document.getElementById("main-panel");
    const detailPanel = document.getElementById("detail-view-panel");
    const listPanel = document.getElementById("full-list-panel");

    mainPanel.classList.add("hidden");
    detailPanel.classList.add("hidden");
    listPanel.classList.add("hidden");
    
    mainPanel.classList.remove("block", "flex");
    detailPanel.classList.remove("block", "flex");
    listPanel.classList.remove("block", "flex");

    if (viewName === 'main') {
        mainPanel.classList.remove("hidden");
        mainPanel.classList.add("flex", "flex-col");
    } else if (viewName === 'detail') {
        detailPanel.classList.remove("hidden");
        detailPanel.classList.add("flex", "flex-col");
    } else if (viewName === 'list') {
        listPanel.classList.remove("hidden");
        listPanel.classList.add("flex", "flex-col");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});
