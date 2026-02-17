// departemen.js
import { db } from "../config/firebase.js";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

// Mapping Icon SVG berdasarkan ID Departemen (Hardcoded untuk estetika)
const ICONS = {
  BPH: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
  PI: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h5m-5 4h10m-10 4h10" />`,
  PJK: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3m0-6c-1.657 0-3 1.343-3 3s1.343 3 3 3m-9-3h18" />`,
  HUMAS: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />`,
  PO: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
  SB: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />`,
  DEFAULT: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />`,
};

async function fetchDataDepartemen() {
  try {
    // 1. Ambil Data Departemen (Urutkan berdasarkan no_urut)
    const qDept = query(
      collection(db, "departemen_data"),
      orderBy("no_urut", "asc"),
    );
    const snapshotDept = await getDocs(qDept);
    const departments = snapshotDept.docs.map((doc) => doc.data());

    // 2. Ambil Semua Pengurus
    // (Lebih efisien ambil semua sekali lalu filter di client daripada request berkali-kali)
    const qPengurus = query(collection(db, "pengurus"));
    const snapshotPengurus = await getDocs(qPengurus);
    const allPengurus = snapshotPengurus.docs.map((doc) => doc.data());

    // 3. Gabungkan Data (Join)
    const mergedData = departments.map((dept) => {
      // Filter pengurus yang punya field 'departemen' sama dengan 'id' departemen ini
      const members = allPengurus.filter((p) => p.departemen === dept.id);
      return {
        ...dept,
        members: members, // Array pengurus dimasukkan ke object departemen
      };
    });

    renderDepartemen(mergedData);
  } catch (error) {
    console.error("Gagal mengambil data departemen:", error);
    document.getElementById("container-departemen").innerHTML =
      `<p class="text-center text-red-500 col-span-full">Gagal memuat data. Cek koneksi internet.</p>`;
  }
}

function renderDepartemen(data) {
  const container = document.getElementById("container-departemen");
  container.innerHTML = "";

  data.forEach((dept) => {
    // Tentukan Icon
    const iconPath = ICONS[dept.id] || ICONS["DEFAULT"];

    // Buat HTML untuk Slider Anggota
    let membersHTML = "";
    if (dept.members && dept.members.length > 0) {
      // Urutkan pengurus (misal Ketua dulu), opsional jika ada field no_urut di pengurus
      // dept.members.sort((a, b) => a.no_urut - b.no_urut);

      membersHTML = dept.members
        .map(
          (p) => `
                <div class="flex-none w-full snap-center text-center px-4">
                    <div class="w-48 h-48 mx-auto rounded-3xl bg-white shadow-md overflow-hidden mb-4 border-4 border-white">
                        <img src="${p.foto}" class="w-full h-full object-cover" alt="${p.nama}" loading="lazy" decoding="async"/>
                    </div>
                    <p class="text-lg font-bold text-nav truncate">${p.nama}</p>
                    <p class="text-sm text-acsent font-medium uppercase tracking-wider truncate">${p.jabatan}</p>
                </div>
            `,
        )
        .join("");
    } else {
      membersHTML = `<div class="text-center text-gray-400 w-full py-10">Belum ada data pengurus.</div>`;
    }

    // Buat Elemen Card
    const card = document.createElement("div");
    card.className =
      "dept-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 cursor-pointer group my-5 md:my-0";
    // Pasang Event Listener langsung
    card.onclick = function () {
      window.toggleDept(this);
    };

    card.innerHTML = `
            <div class="px-8 pt-8 pb-6">
                <div class="w-14 h-14 bg-nav/5 rounded-2xl flex items-center justify-center mb-2 text-nav group-hover:bg-acsent group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        ${iconPath}
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-nav">${dept.id}</h3>
                <p class="text-gray-500 text-sm">${dept.nama_lengkap}</p>
                <div class="mt-2 flex items-center text-xs font-bold text-acsent uppercase tracking-widest">
                    <span>Detail</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-300 arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <div class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out detail-content bg-gray-50/50">
                <div class="px-8 pt-4 pb-4 border-t border-gray-100">
                    <div class="relative group/slider">
                        <div class="flex overflow-x-hidden w-full member-slider">
                            ${membersHTML}
                        </div>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-200/50 mt-4">
                        <h4 class="font-bold text-nav text-sm">Tugas Pokok:</h4>
                        <p class="text-xs text-gray-600 leading-relaxed">
                            ${dept.tugas_pokok}
                        </p>
                    </div>
                </div>
            </div>
        `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", fetchDataDepartemen);
