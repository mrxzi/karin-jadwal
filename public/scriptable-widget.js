// =============================================================================
// SCRIPTABLE IOS WIDGET - JADWAL PELAJARAN PERSONAL
// =============================================================================
// Petunjuk Penggunaan:
// 1. Install aplikasi "Scriptable" gratis dari App Store di iPhone.
// 2. Buat Script Baru (+) dan paste seluruh kode di bawah ini.
// 3. Ganti URL API_URL di bawah ini dengan URL website Anda yang sudah dideploy.
// 4. Kembali ke Home Screen, tambahkan Widget Scriptable, lalu pilih script ini.
// =============================================================================

// GANTI URL INI DENGAN URL DEPLOY VERCEL / NETLIFY ANDA (Atau URL lokal via ngrok/local IP)
const API_URL = "https://karin-jadwal.vercel.app/api/jadwal/today";

async function createWidget() {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#0f172a"); // Dark Navy theme background
  widget.setPadding(14, 16, 14, 16);

  let data = null;
  try {
    const req = new Request(API_URL);
    req.timeoutInterval = 10;
    data = await req.loadJSON();
  } catch (err) {
    console.error("Gagal mengambil data dari API: " + err);
  }

  if (!data || !data.schedule) {
    // Tampilan Error / Offline State
    const errIcon = widget.addText("⚠️");
    errIcon.font = Font.boldSystemFont(22);
    
    widget.addSpacer(4);
    const errTitle = widget.addText("Jadwal Tidak Terhubung");
    errTitle.textColor = new Color("#f87171");
    errTitle.font = Font.boldSystemFont(13);

    const errDesc = widget.addText("Pastikan URL API_URL sudah benar & terhubung internet.");
    errDesc.textColor = new Color("#94a3b8");
    errDesc.font = Font.systemFont(10);
    return widget;
  }

  // Header Widget (Hari & Tanggal)
  const headerStack = widget.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();

  const dayText = headerStack.addText((data.day || "HARI INI").toUpperCase());
  dayText.textColor = new Color("#38bdf8"); // Sky Blue accent
  dayText.font = Font.boldSystemFont(13);

  headerStack.addSpacer();

  const countBadge = headerStack.addText(`${data.totalClasses || 0} Pelajaran`);
  countBadge.textColor = new Color("#94a3b8");
  countBadge.font = Font.mediumSystemFont(10);

  widget.addSpacer(6);

  // Divider Line
  const divider = widget.addStack();
  divider.size = new Size(0, 1);
  divider.backgroundColor = new Color("#334155");

  widget.addSpacer(8);

  // Jika Tidak Ada Jadwal (Hari Libur)
  if (data.schedule.length === 0) {
    const emptyStack = widget.addStack();
    emptyStack.layoutVertically();
    
    const freeText = emptyStack.addText("🎉 Libur / Bebas!");
    freeText.textColor = new Color("#4ade80");
    freeText.font = Font.boldSystemFont(14);

    emptyStack.addSpacer(2);
    const subFree = emptyStack.addText("Tidak ada jadwal pelajaran hari ini.");
    subFree.textColor = new Color("#94a3b8");
    subFree.font = Font.systemFont(11);
    return widget;
  }

  // Daftar Pelajaran (Max 3-4 item untuk Medium Widget)
  const maxItems = config.widgetFamily === "small" ? 2 : 4;
  const itemsToShow = data.schedule.slice(0, maxItems);

  itemsToShow.forEach((item, index) => {
    const itemStack = widget.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    // Color Indicator Bar
    const bar = itemStack.addStack();
    bar.size = new Size(3, 26);

    if (item.isCurrent) {
      bar.backgroundColor = new Color("#22c55e"); // Green for active class
    } else if (item.isNext) {
      bar.backgroundColor = new Color("#38bdf8"); // Sky Blue for next class
    } else if (item.isPast) {
      bar.backgroundColor = new Color("#64748b"); // Muted Gray for past
    } else {
      bar.backgroundColor = new Color("#818cf8"); // Indigo
    }

    itemStack.addSpacer(8);

    // Text Information
    const infoStack = itemStack.addStack();
    infoStack.layoutVertically();

    // Subject title + status badge
    const titleRow = infoStack.addStack();
    titleRow.layoutHorizontally();
    
    const subjectTitle = titleRow.addText(item.subject);
    subjectTitle.font = item.isCurrent ? Font.boldSystemFont(12) : Font.semiboldSystemFont(11);
    subjectTitle.textColor = item.isPast ? new Color("#94a3b8") : new Color("#f8fafc");

    if (item.isCurrent) {
      titleRow.addSpacer(4);
      const tag = titleRow.addText("• SEKARANG");
      tag.textColor = new Color("#4ade80");
      tag.font = Font.boldSystemFont(9);
    }

    // Time & Room
    const metaText = infoStack.addText(`🕒 ${item.time}  📍 ${item.room}`);
    metaText.font = Font.systemFont(9);
    metaText.textColor = item.isCurrent ? new Color("#cbd5e1") : new Color("#64748b");

    if (index < itemsToShow.length - 1) {
      widget.addSpacer(6);
    }
  });

  if (data.schedule.length > maxItems) {
    widget.addSpacer(4);
    const moreText = widget.addText(`+${data.schedule.length - maxItems} pelajaran lainnya`);
    moreText.textColor = new Color("#64748b");
    moreText.font = Font.italicSystemFont(9);
  }

  return widget;
}

const widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium(); // Preview mode inside Scriptable app
}
Script.complete();
