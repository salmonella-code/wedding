/**
 * LOMBOK SASAK WEDDING INVITATION SCRIPT
 * Handles URL parameter parsing (e.g. /for=Salman&Ajeng),
 * Countdown timer, Audio playback, RSVP, Gallery lightbox, and Copy tools.
 */

document.addEventListener("DOMContentLoaded", () => {
  initGuestName();
  initCountdown();
  initCoverAndAudio();
  initGallery();
  initRSVP();
  initLinkGenerator();
});

/**
 * Robust URL parser to extract guest name from URL formats:
 * - {base_url}/for=Salman&Ajeng
 * - {base_url}/?for=Salman&Ajeng
 * - {base_url}/?for=Salman%20%26%20Ajeng
 * - {base_url}/#for=Salman&Ajeng
 * - {base_url}/?to=Salman&Ajeng
 */
function getGuestNameFromURL() {
  const fullHref = window.location.href;

  // Regex to capture "for=..." or "to=..." from pathname, query, or hash
  // Handles cases where unencoded ampersand is used: "for=Salman&Ajeng"
  const match = fullHref.match(
    /(?:[?&#/]|for=|to=)(?:for|to|guest|p)=([^#?]*)/i,
  );

  let rawGuest = "";

  if (match && match[1]) {
    rawGuest = match[1];
  } else {
    // Fallback: Check standard URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    rawGuest =
      urlParams.get("for") ||
      urlParams.get("to") ||
      urlParams.get("guest") ||
      urlParams.get("p") ||
      "";
  }

  if (!rawGuest) {
    return "Tamu Undangan";
  }

  try {
    // Replace plus with space before decoding
    let decoded = decodeURIComponent(rawGuest.replace(/\+/g, " ")).trim();

    // Ensure clean spacing around '&' e.g. Salman&Ajeng -> Salman & Ajeng
    decoded = decoded.replace(/\s*&\s*/g, " & ");

    // Capitalize words neatly
    return formatGuestName(decoded);
  } catch (e) {
    // If URI malformed, fall back to safe sanitized string
    return rawGuest.replace(/%20|\+/g, " ").replace(/\s*&\s*/g, " & ");
  }
}

/**
 * Format guest name nicely (Title Case, preserve &)
 */
function formatGuestName(name) {
  if (!name) return "Tamu Undangan";
  return name
    .split(" ")
    .map((word) => {
      if (word.trim() === "&") return "&";
      if (word.length <= 1) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Inject guest name into all relevant places on the page
 */
function initGuestName() {
  const guestName = getGuestNameFromURL();

  // 1. Cover modal
  const coverElement = document.getElementById("guest-name-cover");
  if (coverElement) {
    coverElement.textContent = guestName;
  }

  // 2. Hero section
  const heroElement = document.getElementById("guest-name-hero");
  if (heroElement) {
    heroElement.textContent = guestName;
  }

  // 3. Pre-fill RSVP form input
  const rsvpInput = document.getElementById("guest-input-name");
  if (rsvpInput && guestName !== "Tamu Undangan") {
    rsvpInput.value = guestName;
  }

  // 4. Update document title for personalization
  if (guestName !== "Tamu Undangan") {
    document.title = `Undangan Pernikahan Arya & Sekar - Spesial untuk ${guestName}`;
  }
}

/**
 * Cover Modal & Audio Controller
 */
function initCoverAndAudio() {
  const coverModal = document.getElementById("cover-modal");
  const openBtn = document.getElementById("open-invitation-btn");
  const audio = document.getElementById("wedding-audio");
  const audioControl = document.getElementById("audio-control");
  const toggleAudioBtn = document.getElementById("toggle-audio-btn");
  const audioIcon = document.getElementById("audio-icon");
  const bottomNav = document.getElementById("bottom-nav");

  let isPlaying = false;

  // "Buka Undangan" click handler
  openBtn.addEventListener("click", () => {
    // Fade out modal
    coverModal.classList.add("opacity-0");
    setTimeout(() => {
      coverModal.style.display = "none";
    }, 800);

    // Show floating controls and bottom nav
    audioControl.classList.remove("hidden");
    bottomNav.classList.remove("hidden");

    // Play romantic background music
    audio
      .play()
      .then(() => {
        isPlaying = true;
        audioIcon.classList.add("animate-spin-slow");
      })
      .catch((err) => {
        console.log("Autoplay restriction or audio prevented:", err);
        isPlaying = false;
        audioIcon.classList.remove("animate-spin-slow");
      });

    // Launch celebratory confetti in Lombok warm tones
    launchCelebrationConfetti();
  });

  // Toggle Audio on floating button
  toggleAudioBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      audioIcon.classList.remove("animate-spin-slow");
      audioIcon.className = "fas fa-volume-mute text-lg";
      showToast("Musik dijeda");
    } else {
      audio
        .play()
        .then(() => {
          isPlaying = true;
          audioIcon.className = "fas fa-compact-disc text-xl animate-spin-slow";
          showToast("Memutar alunan musik");
        })
        .catch((e) => console.error(e));
    }
  });
}

/**
 * Celebration Confetti Effect
 */
function launchCelebrationConfetti() {
  if (typeof confetti === "function") {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
          colors: ["#8E3E2C", "#C89B3C", "#F4EDE1", "#5B6E58"],
        }),
      );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }
}

/**
 * Countdown Timer to the Wedding Day (10 Desember 2026 08:00 WITA / UTC+8)
 */
function initCountdown() {
  const targetDate = new Date("2026-12-10T08:00:00+08:00").getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/**
 * Photo Gallery Lightbox Modal
 */
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  const closeBtn = document.getElementById("close-gallery-btn");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const fullSrc = item.getAttribute("data-full");
      if (fullSrc) {
        modalImg.src = fullSrc;
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
}

/**
 * RSVP & Guestbook with Google Spreadsheet Integration & Local Cache
 */
function initRSVP() {
  const form = document.getElementById("rsvp-form");
  const list = document.getElementById("wishes-list");
  const countEl = document.getElementById("wishes-count");
  const refreshBtn = document.getElementById("refresh-wishes-btn");
  const configBtn = document.getElementById("config-script-btn");
  const configBox = document.getElementById("script-config-box");
  const scriptInput = document.getElementById("script-url-input");
  const saveScriptBtn = document.getElementById("save-script-url-btn");

  // Google Spreadsheet Config
  const SPREADSHEET_ID = "10AhTkXuDNHDtlffzi7BkIjj5SCIZnY08L7al8PAgudY";
  const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

  // URL Web App dari Google Apps Script (bisa diatur langsung di kode atau lewat UI)
  let GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxGyvknC6EeLbqwQdKumt6EiUE87fIKwQoKCh2xZg98-kofUOkkWIix6p9xoz9F3gCp/exec";

  // Default sample wishes (tampil jika spreadsheet baru dibuat & masih kosong)
  const fallbackWishes = [
    {
      name: "Lalu Muhammad Fikri",
      status: "Hadir (2 Orang)",
      message:
        "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat Salman & Ajeng! Semoga senantiasa rukun dan bahagia selalu.",
      time: "Baru saja",
    },
    {
      name: "Baiq Diana Lestari",
      status: "Hadir (1 Orang)",
      message:
        "Amiin yra. Turut berbahagia untuk kedua sahabat kami. Nanti kami sekeluarga hadir ke Senggigi. Lancar sampai hari H ya!",
      time: "2 jam yang lalu",
    },
    {
      name: "Dimas Anggara & Istri",
      status: "Hadir (2 Orang)",
      message:
        "Selamat menempuh babak baru kehidupan bersama. Salam hangat dari Jakarta untuk keluarga besar di Lombok.",
      time: "1 hari yang lalu",
    },
  ];

  let currentWishes = [];

  // Helper: render kartu ucapan ke DOM
  function renderWishes(wishesToRender, sourceLabel = "") {
    list.innerHTML = "";
    const count = wishesToRender.length;
    countEl.textContent = `${count} Ucapan${sourceLabel ? ` (${sourceLabel})` : ""}`;

    if (count === 0) {
      list.innerHTML = `
                <div class="text-center py-8 text-sasak-charcoal/60 text-xs italic">
                    <i class="far fa-comment-dots text-2xl text-sasak-gold mb-2 block"></i>
                    Belum ada ucapan doa. Jadilah yang pertama memberikan doa restu!
                </div>
            `;
      return;
    }

    wishesToRender.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "p-3.5 rounded-xl bg-sasak-sand/40 border border-sasak-gold/20 text-xs text-sasak-charcoal transition-all hover:bg-sasak-sand/60";

      const statusText = item.status || "Hadir";
      const isHadir =
        statusText.toLowerCase().includes("hadir") &&
        !statusText.toLowerCase().includes("tidak");
      const badgeColor = isHadir
        ? "bg-emerald-100 text-emerald-800"
        : "bg-amber-100 text-amber-800";

      card.innerHTML = `
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-sasak-terracotta">${escapeHTML(item.name || "Tamu Undangan")}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor}">${escapeHTML(statusText)}</span>
                </div>
                <p class="text-sasak-charcoal/80 leading-relaxed mb-1">${escapeHTML(item.message || "-")}</p>
                <div class="text-[10px] text-sasak-charcoal/40 text-right">${escapeHTML(item.time || "Baru saja")}</div>
            `;
      list.appendChild(card);
    });
  }

  // Ambil data dari Google Spreadsheet via GViz API (Tanpa perlu API Key)
  async function fetchWishesFromGoogleSheet() {
    try {
      countEl.textContent = "Menyinkronkan...";
      // Tambahkan timestamp query parameter agar tidak kena cache browser
      const response = await fetch(`${GVIZ_URL}&tq=&_=${Date.now()}`);
      if (!response.ok)
        throw new Error("Gagal mengambil data dari Google Sheets");

      const text = await response.text();
      // Format respon GViz: google.visualization.Query.setResponse({...});
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1)
        throw new Error("Format data tidak sesuai");

      const json = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      const parsed = parseGvizTable(json.table);

      if (parsed.length > 0) {
        currentWishes = parsed;
        localStorage.setItem("wedding_sheet_wishes", JSON.stringify(parsed));
        renderWishes(currentWishes, "Google Sheets");
      } else {
        // Jika sheet masih kosong (baru dibuat), cek local storage atau fallback
        const storedLocal = JSON.parse(
          localStorage.getItem("wedding_sheet_wishes"),
        );
        if (storedLocal && storedLocal.length > 0) {
          currentWishes = storedLocal;
          renderWishes(currentWishes, "Lokal");
        } else {
          currentWishes = fallbackWishes;
          renderWishes(currentWishes, "Contoh");
        }
      }
    } catch (error) {
      console.warn(
        "Gagal sinkron Google Sheets, menggunakan data cadangan:",
        error,
      );
      const storedLocal =
        JSON.parse(localStorage.getItem("wedding_sheet_wishes")) ||
        fallbackWishes;
      currentWishes = storedLocal;
      renderWishes(currentWishes, "Offline");
    }
  }

  // Parser tabel Google Visualization API menjadi array objek
  function parseGvizTable(table) {
    if (!table || !table.rows || table.rows.length === 0) return [];

    const results = [];
    table.rows.forEach((row, index) => {
      if (!row || !row.c) return;

      const cells = row.c.map((cell) => {
        if (!cell || cell.v === null || cell.v === undefined) return "";
        return String(cell.f || cell.v).trim();
      });

      // Lewati baris kosong
      if (cells.every((val) => val === "")) return;

      // Lewati baris header jika terambil
      if (
        index === 0 &&
        (cells[0].toLowerCase().includes("time") ||
          cells[1]?.toLowerCase().includes("nama"))
      ) {
        return;
      }

      let timestamp = cells[0] || "Baru saja";
      let name = cells[1] || cells[0] || "Tamu Undangan";
      let status = cells[2] || "Hadir";
      let count = cells[3] || "";
      let message = cells[4] || cells[3] || cells[2] || "";

      // Jika hanya 3 kolom (Nama, Status, Pesan)
      if (cells.length === 3 && !cells[0].includes(":")) {
        name = cells[0];
        status = cells[1];
        message = cells[2];
        timestamp = "Baru saja";
      }

      const fullStatus =
        count && !status.includes("(") ? `${status} (${count})` : status;

      results.push({
        name: name,
        status: fullStatus,
        message: message,
        time: timestamp,
      });
    });

    // Urutkan dari yang terbaru (paling atas)
    return results.reverse();
  }

  // Load data awal saat halaman dibuka
  fetchWishesFromGoogleSheet();

  // Tombol Sinkron Manual
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      const icon = refreshBtn.querySelector("i");
      if (icon) icon.classList.add("fa-spin");
      fetchWishesFromGoogleSheet().finally(() => {
        setTimeout(() => {
          if (icon) icon.classList.remove("fa-spin");
          showToast("Data tersinkron dengan Google Spreadsheet!");
        }, 600);
      });
    });
  }

  // Tombol Konfigurasi Script
  if (configBtn && configBox) {
    configBtn.addEventListener("click", () => {
      configBox.classList.toggle("hidden");
      if (scriptInput) scriptInput.value = GOOGLE_SCRIPT_URL;
    });
  }

  if (saveScriptBtn && scriptInput) {
    saveScriptBtn.addEventListener("click", () => {
      const val = scriptInput.value.trim();
      GOOGLE_SCRIPT_URL = val;
      localStorage.setItem("wedding_google_script_url", val);
      configBox.classList.add("hidden");
      showToast("URL Google Apps Script berhasil disimpan!");
    });
  }

  // Form Submit: Kirim data ke Google Spreadsheet & Update Tampilan
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;

    const name = document.getElementById("guest-input-name").value.trim();
    const status = document.getElementById("guest-status").value;
    const count = document.getElementById("guest-count").value;
    const message = document.getElementById("guest-message").value.trim();

    if (!name || !message) return;

    // Tampilkan status pengiriman pada tombol
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim ke Spreadsheet...';

    const nowFormatted = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newWish = {
      name: name,
      status: `${status} (${count})`,
      message: message,
      time: nowFormatted,
    };

    // Optimistic UI Update: Tampilkan langsung di daftar paling atas
    currentWishes.unshift(newWish);
    renderWishes(currentWishes, "Tersimpan");

    // Simpan ke local cache
    localStorage.setItem("wedding_sheet_wishes", JSON.stringify(currentWishes));

    // Kirim ke Google Apps Script jika URL sudah diisi
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Mencegah error CORS browser pada Google Apps Script
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            name: name,
            status: status,
            count: count,
            message: message,
          }),
        });
        showToast("Doa & kehadiran berhasil dikirim ke Google Spreadsheet!");
      } catch (err) {
        console.error("Error sending to Google Script:", err);
        showToast("Doa tersimpan di website!");
      }
    } else {
      showToast(
        "Doa berhasil dikirim! (Tambahkan Apps Script untuk masuk sheet otomatis)",
      );
      // Buka info konfigurasi jika belum ada URL
      if (configBox) configBox.classList.remove("hidden");
    }

    // Reset form & tombol
    document.getElementById("guest-message").value = "";
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;

    // Ambil data terbaru dari Google Sheets setelah 2.5 detik
    setTimeout(() => {
      fetchWishesFromGoogleSheet();
    }, 2500);
  });
}

/**
 * Shareable Link Generator Helper Tool
 */
function initLinkGenerator() {
  const input = document.getElementById("target-guest-input");
  const genBtn = document.getElementById("generate-link-btn");
  const resultBox = document.getElementById("generated-link-box");
  const resultUrl = document.getElementById("generated-link-url");
  const copyBtn = document.getElementById("copy-guest-link-btn");
  const waBtn = document.getElementById("share-wa-btn");

  // Get current clean base url
  // If running on GitHub Pages (e.g., https://user.github.io/wedding/), maintain path
  const url = new URL(window.location.href);
  let baseUrl = `${url.origin}${url.pathname}`;
  // Strip trailing index.html or /for=... if present
  baseUrl = baseUrl.replace(/\/index\.html$/i, "").replace(/\/for=.*$/i, "");
  if (!baseUrl.endsWith("/")) {
    baseUrl += "/";
  }

  genBtn.addEventListener("click", () => {
    const guest = input.value.trim();
    if (!guest) {
      showToast("Silakan masukkan nama tamu");
      return;
    }

    // Format to: {baseUrl}?for=EncodedName
    // Note: Can also support /for=... as handled by our 404.html redirect and JS parser
    const targetUrl = `${baseUrl}?for=${encodeURIComponent(guest)}`;
    resultUrl.textContent = targetUrl;
    resultBox.classList.remove("hidden");

    // Prepare polite WhatsApp message
    const waText = `Kepada Yth. ${guest},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:\n\n*The Wedding of Arya & Sekar*\n\nInformasi lengkap undangan dapat diakses melalui tautan berikut:\n${targetUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;
    waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
  });

  copyBtn.addEventListener("click", () => {
    const link = resultUrl.textContent;
    copyToClipboard(link, copyBtn, "Link undangan berhasil disalin!");
  });
}

/**
 * Clipboard Copy Utility with Toast
 */
function copyToClipboard(text, btnElement, customSuccessMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(customSuccessMsg || "Nomor rekening berhasil disalin!");
      })
      .catch(() => {
        fallbackCopy(text, customSuccessMsg);
      });
  } else {
    fallbackCopy(text, customSuccessMsg);
  }
}

function fallbackCopy(text, msg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(msg || "Berhasil disalin ke papan klip!");
  } catch (err) {
    showToast("Gagal menyalin otomatis");
  }
  document.body.removeChild(textArea);
}

/**
 * Toast Notification Popup
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove("opacity-0", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-2");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-2");
    toast.classList.add("opacity-0", "pointer-events-none");
  }, 2800);
}

/**
 * XSS prevention helper
 */
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}
