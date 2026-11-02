/**
 * ====================================================================
 * GOOGLE APPS SCRIPT UNTUK BUKU TAMU WEDDING INVITATION
 * ====================================================================
 * 
 * PANDUAN PEMASANGAN (HANYA 1 MENIT):
 * 1. Buka spreadsheet Anda:
 *    https://docs.google.com/spreadsheets/d/10AhTkXuDNHDtlffzi7BkIjj5SCIZnY08L7al8PAgudY/edit
 * 2. Di menu atas Google Spreadsheet, klik:
 *    "Ekstensi" (Extensions) -> "Apps Script"
 * 3. Hapus semua kode default di editor, lalu COPY & PASTE seluruh kode di bawah ini.
 * 4. Klik tombol "Simpan" (ikon disket / Ctrl+S).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas -> Pilih "Penerapan Baru" (New deployment).
 * 6. Klik ikon gerigi (Select type) -> Pilih "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: Buku Tamu Wedding Arya & Sekar
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 8. Klik "Terapkan" (Deploy). Berikan izin akses (Authorize access) jika diminta.
 * 9. Salin "URL Aplikasi Web" (Web app URL) yang berakhiran "/exec".
 * 10. Buka file "js/app.js", tempelkan URL tersebut pada variabel:
 *     const GOOGLE_SCRIPT_URL = "URL_DARI_APPS_SCRIPT_ANDA_DISINI";
 * ====================================================================
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Pastikan baris judul (header) sudah ada di baris pertama
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Nama Lengkap", "Konfirmasi Kehadiran", "Jumlah Hadir", "Ucapan & Doa Restu"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#F4EDE1");
    }
    
    // Ambil data dari request
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" });
    const name = data.name || data.nama || "Anonim";
    const status = data.status || data.kehadiran || "Hadir";
    const count = data.count || data.jumlah || "1 Orang";
    const message = data.message || data.ucapan || data.pesan || "-";
    
    // Tambahkan baris baru ke Google Spreadsheet
    sheet.appendRow([timestamp, name, status, count, message]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Data berhasil disimpan!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const wishes = [];
    // Baris ke-0 adalah header, mulai ambil dari baris ke-1
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[1] && !row[4]) continue; // Lewati baris kosong
      wishes.push({
        timestamp: row[0],
        name: row[1],
        status: row[2] + (row[3] ? " (" + row[3] + ")" : ""),
        count: row[3],
        message: row[4],
        time: row[0] ? String(row[0]) : "Baru saja"
      });
    }
    
    // Urutkan dari yang terbaru (paling atas)
    wishes.reverse();
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", data: wishes }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

