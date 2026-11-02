/**
 * LOMBOK SASAK WEDDING INVITATION SCRIPT
 * Handles URL parameter parsing (e.g. /for=Salman&Ajeng),
 * Countdown timer, Audio playback, RSVP, Gallery lightbox, and Copy tools.
 */

document.addEventListener('DOMContentLoaded', () => {
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
    const match = fullHref.match(/(?:[?&#/]|for=|to=)(?:for|to|guest|p)=([^#?]*)/i);

    let rawGuest = '';

    if (match && match[1]) {
        rawGuest = match[1];
    } else {
        // Fallback: Check standard URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        rawGuest = urlParams.get('for') || urlParams.get('to') || urlParams.get('guest') || urlParams.get('p') || '';
    }

    if (!rawGuest) {
        return 'Tamu Undangan';
    }

    try {
        // Replace plus with space before decoding
        let decoded = decodeURIComponent(rawGuest.replace(/\+/g, ' ')).trim();

        // Ensure clean spacing around '&' e.g. Salman&Ajeng -> Salman & Ajeng
        decoded = decoded.replace(/\s*&\s*/g, ' & ');

        // Capitalize words neatly
        return formatGuestName(decoded);
    } catch (e) {
        // If URI malformed, fall back to safe sanitized string
        return rawGuest.replace(/%20|\+/g, ' ').replace(/\s*&\s*/g, ' & ');
    }
}

/**
 * Format guest name nicely (Title Case, preserve &)
 */
function formatGuestName(name) {
    if (!name) return 'Tamu Undangan';
    return name
        .split(' ')
        .map(word => {
            if (word.trim() === '&') return '&';
            if (word.length <= 1) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

/**
 * Inject guest name into all relevant places on the page
 */
function initGuestName() {
    const guestName = getGuestNameFromURL();

    // 1. Cover modal
    const coverElement = document.getElementById('guest-name-cover');
    if (coverElement) {
        coverElement.textContent = guestName;
    }

    // 2. Hero section
    const heroElement = document.getElementById('guest-name-hero');
    if (heroElement) {
        heroElement.textContent = guestName;
    }

    // 3. Pre-fill RSVP form input
    const rsvpInput = document.getElementById('guest-input-name');
    if (rsvpInput && guestName !== 'Tamu Undangan') {
        rsvpInput.value = guestName;
    }

    // 4. Update document title for personalization
    if (guestName !== 'Tamu Undangan') {
        document.title = `Undangan Pernikahan Arya & Sekar - Spesial untuk ${guestName}`;
    }
}

/**
 * Cover Modal & Audio Controller
 */
function initCoverAndAudio() {
    const coverModal = document.getElementById('cover-modal');
    const openBtn = document.getElementById('open-invitation-btn');
    const audio = document.getElementById('wedding-audio');
    const audioControl = document.getElementById('audio-control');
    const toggleAudioBtn = document.getElementById('toggle-audio-btn');
    const audioIcon = document.getElementById('audio-icon');
    const bottomNav = document.getElementById('bottom-nav');

    let isPlaying = false;

    // "Buka Undangan" click handler
    openBtn.addEventListener('click', () => {
        // Fade out modal
        coverModal.classList.add('opacity-0');
        setTimeout(() => {
            coverModal.style.display = 'none';
        }, 800);

        // Show floating controls and bottom nav
        audioControl.classList.remove('hidden');
        bottomNav.classList.remove('hidden');

        // Play romantic background music
        audio.play().then(() => {
            isPlaying = true;
            audioIcon.classList.add('animate-spin-slow');
        }).catch(err => {
            console.log('Autoplay restriction or audio prevented:', err);
            isPlaying = false;
            audioIcon.classList.remove('animate-spin-slow');
        });

        // Launch celebratory confetti in Lombok warm tones
        launchCelebrationConfetti();
    });

    // Toggle Audio on floating button
    toggleAudioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            audioIcon.classList.remove('animate-spin-slow');
            audioIcon.className = 'fas fa-volume-mute text-lg';
            showToast('Musik dijeda');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                audioIcon.className = 'fas fa-compact-disc text-xl animate-spin-slow';
                showToast('Memutar alunan musik');
            }).catch(e => console.error(e));
        }
    });
}

/**
 * Celebration Confetti Effect
 */
function launchCelebrationConfetti() {
    if (typeof confetti === 'function') {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
                colors: ['#8E3E2C', '#C89B3C', '#F4EDE1', '#5B6E58']
            }));
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
    const targetDate = new Date('2026-12-10T08:00:00+08:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/**
 * Photo Gallery Lightbox Modal
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('close-gallery-btn');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullSrc = item.getAttribute('data-full');
            if (fullSrc) {
                modalImg.src = fullSrc;
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}

/**
 * RSVP & Guestbook with LocalStorage persistence
 */
function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const list = document.getElementById('wishes-list');
    const countEl = document.getElementById('wishes-count');

    // Default wishes with Lombok Sasak spirit
    const initialWishes = [
        {
            name: "Lalu Muhammad Fikri",
            status: "Hadir",
            message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat Arya & Sekar! Semoga senantiasa rukun dan bahagia selalu.",
            time: "Baru saja"
        },
        {
            name: "Baiq Diana Lestari",
            status: "Hadir",
            message: "Amiin yra. Turut berbahagia untuk kedua sahabat kami. Nanti kami sekeluarga hadir ke Senggigi. Lancar sampai hari H ya!",
            time: "2 jam yang lalu"
        },
        {
            name: "Dimas Anggara & Istri",
            status: "Hadir",
            message: "Selamat menempuh babak baru kehidupan bersama. Salam hangat dari Jakarta untuk keluarga besar di Lombok.",
            time: "1 hari yang lalu"
        }
    ];

    // Load from storage or set default
    let storedWishes = JSON.parse(localStorage.getItem('wedding_sasak_wishes'));
    if (!storedWishes || !Array.isArray(storedWishes) || storedWishes.length === 0) {
        storedWishes = initialWishes;
        localStorage.setItem('wedding_sasak_wishes', JSON.stringify(storedWishes));
    }

    function renderWishes() {
        list.innerHTML = '';
        countEl.textContent = `${storedWishes.length} Ucapan`;

        storedWishes.forEach(item => {
            const card = document.createElement('div');
            card.className = 'p-3.5 rounded-xl bg-sasak-sand/40 border border-sasak-gold/20 text-xs text-sasak-charcoal';

            const badgeColor = item.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';

            card.innerHTML = `
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-sasak-terracotta">${escapeHTML(item.name)}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor}">${escapeHTML(item.status)}</span>
                </div>
                <p class="text-sasak-charcoal/80 leading-relaxed mb-1">${escapeHTML(item.message)}</p>
                <div class="text-[10px] text-sasak-charcoal/40 text-right">${escapeHTML(item.time || 'Baru saja')}</div>
            `;
            list.appendChild(card);
        });
    }

    renderWishes();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('guest-input-name').value.trim();
        const status = document.getElementById('guest-status').value;
        const count = document.getElementById('guest-count').value;
        const message = document.getElementById('guest-message').value.trim();

        if (!name || !message) return;

        const newWish = {
            name: name,
            status: `${status} (${count})`,
            message: message,
            time: "Baru saja"
        };

        storedWishes.unshift(newWish);
        localStorage.setItem('wedding_sasak_wishes', JSON.stringify(storedWishes));
        renderWishes();

        document.getElementById('guest-message').value = '';
        showToast('Terima kasih atas doa & konfirmasinya!');
    });
}

/**
 * Shareable Link Generator Helper Tool
 */
function initLinkGenerator() {
    const input = document.getElementById('target-guest-input');
    const genBtn = document.getElementById('generate-link-btn');
    const resultBox = document.getElementById('generated-link-box');
    const resultUrl = document.getElementById('generated-link-url');
    const copyBtn = document.getElementById('copy-guest-link-btn');
    const waBtn = document.getElementById('share-wa-btn');

    // Get current clean base url
    // If running on GitHub Pages (e.g., https://user.github.io/wedding/), maintain path
    const url = new URL(window.location.href);
    let baseUrl = `${url.origin}${url.pathname}`;
    // Strip trailing index.html or /for=... if present
    baseUrl = baseUrl.replace(/\/index\.html$/i, '').replace(/\/for=.*$/i, '');
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }

    genBtn.addEventListener('click', () => {
        const guest = input.value.trim();
        if (!guest) {
            showToast('Silakan masukkan nama tamu');
            return;
        }

        // Format to: {baseUrl}?for=EncodedName
        // Note: Can also support /for=... as handled by our 404.html redirect and JS parser
        const targetUrl = `${baseUrl}?for=${encodeURIComponent(guest)}`;
        resultUrl.textContent = targetUrl;
        resultBox.classList.remove('hidden');

        // Prepare polite WhatsApp message
        const waText = `Kepada Yth. ${guest},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:\n\n*The Wedding of Arya & Sekar*\n\nInformasi lengkap undangan dapat diakses melalui tautan berikut:\n${targetUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;
        waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    });

    copyBtn.addEventListener('click', () => {
        const link = resultUrl.textContent;
        copyToClipboard(link, copyBtn, 'Link undangan berhasil disalin!');
    });
}

/**
 * Clipboard Copy Utility with Toast
 */
function copyToClipboard(text, btnElement, customSuccessMsg) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(customSuccessMsg || 'Nomor rekening berhasil disalin!');
        }).catch(() => {
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
        document.execCommand('copy');
        showToast(msg || 'Berhasil disalin ke papan klip!');
    } catch (err) {
        showToast('Gagal menyalin otomatis');
    }
    document.body.removeChild(textArea);
}

/**
 * Toast Notification Popup
 */
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-2');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-2');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2800);
}

/**
 * XSS prevention helper
 */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
