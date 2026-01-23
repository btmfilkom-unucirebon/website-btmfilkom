// publikasi.js

import { db } from './config/firebase.js';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { showToast } from './script.js';

// --- STATE DATA ---
let allBerita = [];
let allDokumentasi = [];
let currentListData = []; 
let currentListType = "";
let currentDetailId = null; // Menyimpan ID berita yang sedang dibuka

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
        
        // Cek URL Params (Deep Linking) setelah data siap
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        if (urlId) {
            openDetail(urlId);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// --- 2. INIT PAGE ---
function initPage() {
    const BATAS_ARSIP = 15;
    const hariIni = new Date();

    const beritaTerbaru = allBerita.filter((item) => {
        const selisih = (hariIni - new Date(item.tanggal)) / (1000 * 3600 * 24);
        return selisih <= BATAS_ARSIP || item.isBaru === true;
    });

    const beritaArsip = allBerita.filter((item) => {
        const selisih = (hariIni - new Date(item.tanggal)) / (1000 * 3600 * 24);
        return selisih > BATAS_ARSIP && item.isBaru !== true;
    });

    renderCards(beritaTerbaru.slice(0, 3), "container-berita-terbaru", "berita");
    renderCards(beritaArsip.slice(0, 3), "container-arsip", "berita");
    renderCards(allDokumentasi.slice(0, 3), "container-dokumentasi", "dokumentasi");
}

// --- 3. RENDER CARDS ---
function renderCards(data, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const templateBerita = document.getElementById("template-card-berita");
    const templateDok = document.getElementById("template-card-dok");
    const hariIni = new Date();

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

            const tanggalBerita = new Date(item.tanggal);
            const selisihHari = (hariIni - tanggalBerita) / (1000 * 3600 * 24);
            const badge = clone.querySelector(".card-badge");
            if (badge) {
                if (selisihHari <= 7) badge.classList.remove("hidden");
                else badge.classList.add("hidden");
            }

        } else {
            clone = templateDok.content.cloneNode(true);
            const cardItem = clone.querySelector(".card-item");
            
            // Direct Link Drive
            cardItem.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (item.gdrive) {
                    window.open(item.gdrive, "_blank");
                } else {
                    alert("Link Google Drive belum tersedia.");
                }
            });
            
            clone.querySelector(".card-img").src = item.img;
            clone.querySelector(".card-title").textContent = item.judul;
            clone.querySelector(".card-date").textContent = item.tanggal;
        }
        container.appendChild(clone);
    });
}

// --- 4. DETAIL VIEW LOGIC (UPDATED: CAPTION + SHARE LINK) ---
function openDetail(id) {
    const item = allBerita.find((x) => x.id === id);
    if (!item) return;

    currentDetailId = id; // Set ID aktif

    // Update URL agar bisa di-copas manual juga (UX)
    const newUrl = `${window.location.pathname}?id=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Isi Konten
    document.getElementById("detail-title").innerText = item.judul;
    document.getElementById("detail-date").innerText = item.tanggal;
    document.getElementById("detail-img").src = item.img;
    document.getElementById("detail-desc").innerText = item.fullContent || item.deskripsi;
    
    // UPDATE CAPTION (Sesuai request: Judul Berita)
    const captionEl = document.getElementById("detail-caption");
    if(captionEl) {
        captionEl.innerText = `Dokumentasi: ${item.judul}`;
    }

    toggleViews('detail');
    window.scrollTo(0, 0);
}

// --- 5. EXPORTED FUNCTIONS ---

window.closeDetailView = function() {
    currentDetailId = null;
    // Bersihkan URL saat kembali
    window.history.pushState({}, '', window.location.pathname);
    
    toggleViews('main');
    window.scrollTo(0, 0);
}

window.openFullListView = function(type) {
    const titleEl = document.getElementById("full-list-title");
    
    if (type === "terbaru") {
        titleEl.innerText = "Semua Berita Terbaru";
        currentListData = allBerita;
        currentListType = "berita";
    } else if (type === "selesai") {
        titleEl.innerText = "Arsip Berita Selesai";
        const hariIni = new Date();
        currentListData = allBerita.filter((i) => {
            const selisih = (hariIni - new Date(i.tanggal)) / (1000 * 3600 * 24);
            return selisih > 15;
        });
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

// UPDATED SHARE LOGIC (Menggunakan ID)
window.shareSocial = function(platform) {
    // Bangun URL dasar + ID jika ada
    let shareUrl = window.location.origin + window.location.pathname;
    if (currentDetailId) {
        shareUrl += `?id=${currentDetailId}`;
    }

    const text = "Cek info terbaru dari BTM FILKOM!";

    if (platform === "wa") {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank");
    } else if (platform === "copy") {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast("Link berita berhasil disalin!");
        });
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