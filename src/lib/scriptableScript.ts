export const SCRIPTABLE_CODE = `// ═══════════════════════════════════════════════════════════════
// JADWAL KARIN — Scriptable iOS Widget (Realtime WITA)
// ═══════════════════════════════════════════════════════════════
// Cara Pasang:
//   1. Install Scriptable dari App Store (gratis)
//   2. Buat script baru → paste kode ini
//   3. Tahan Home Screen → + → Scriptable → Medium Widget
// ═══════════════════════════════════════════════════════════════

const API_URL = "https://karin-jadwal.vercel.app/api/jadwal/today";

async function fetchData() {
  try {
    const req = new Request(API_URL);
    req.timeoutInterval = 12;
    return await req.loadJSON();
  } catch (e) {
    return null;
  }
}

async function createWidget() {
  const widget = new ListWidget();

  // Background hitam matte
  const grad = new LinearGradient();
  grad.colors    = [new Color("#111111"), new Color("#080808")];
  grad.locations = [0.0, 1.0];
  widget.backgroundGradient = grad;
  widget.setPadding(14, 16, 14, 16);

  // Auto-refresh setiap 5 menit
  widget.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);

  const data = await fetchData();

  // ── GAGAL KONEKSI ────────────────────────────────────────────
  if (!data || !data.schedule) {
    const t = widget.addText("Tidak dapat terhubung ke API.");
    t.textColor = new Color("#52525b");
    t.font      = Font.mediumSystemFont(12);
    return widget;
  }

  const { day, currentTimeWITA, totalClasses, schedule } = data;
  const isSmall = config.widgetFamily === "small";

  // ── HEADER: "JADWAL KARIN · SENIN  |  4 Pelajaran" ──────────
  const header = widget.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();

  const titleTxt = header.addText(
    \`JADWAL KARIN · \${(day || "HARI INI").toUpperCase()}\`
  );
  titleTxt.textColor = new Color("#f4f4f5");
  titleTxt.font      = Font.boldSystemFont(10);

  header.addSpacer();

  const countTxt = header.addText(\`\${totalClasses || 0} pelajaran\`);
  countTxt.textColor = new Color("#52525b");
  countTxt.font      = Font.systemFont(10);

  // ── DIVIDER ──────────────────────────────────────────────────
  widget.addSpacer(8);
  const divider = widget.addStack();
  divider.backgroundColor = new Color("#222222");
  divider.size            = new Size(0, 1);
  widget.addSpacer(9);

  // ── LIBUR ────────────────────────────────────────────────────
  if (schedule.length === 0) {
    const free = widget.addText("Libur & Membuat Matcha! 🍵");
    free.textColor = new Color("#e4e4e7");
    free.font      = Font.semiboldSystemFont(13);
    widget.addSpacer(4);
    const sub = widget.addText("Tidak ada jadwal pelajaran hari ini.");
    sub.textColor = new Color("#52525b");
    sub.font      = Font.systemFont(11);
    return widget;
  }

  // ── DAFTAR PELAJARAN ─────────────────────────────────────────
  // Small: maks 3 item | Medium: maks 5 item
  const maxItems = isSmall ? 3 : 5;
  const items    = schedule.slice(0, maxItems);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const row  = widget.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    // Titik status
    const dot = row.addText(item.isCurrent ? "● " : "· ");
    dot.textColor = item.isCurrent
      ? new Color("#ffffff")
      : item.isPast
        ? new Color("#333333")
        : new Color("#52525b");
    dot.font = Font.boldSystemFont(item.isCurrent ? 11 : 10);

    // Nama pelajaran
    const name = row.addText(item.subject);
    name.lineLimit = 1;
    name.font = item.isCurrent
      ? Font.boldSystemFont(isSmall ? 12 : 13)
      : Font.mediumSystemFont(isSmall ? 11 : 12);
    name.textColor = item.isCurrent
      ? new Color("#ffffff")
      : item.isPast
        ? new Color("#3f3f46")
        : new Color("#d4d4d8");

    // Label "sekarang" di kanan untuk kelas aktif
    if (item.isCurrent) {
      row.addSpacer();
      const now = row.addText("sekarang");
      now.textColor = new Color("#71717a");
      now.font      = Font.italicSystemFont(10);
    }

    if (i < items.length - 1) {
      widget.addSpacer(7);
    }
  }

  // "+N lagi" jika ada pelajaran yang tidak muat
  if (schedule.length > maxItems) {
    widget.addSpacer(6);
    const more = widget.addText(\`+\${schedule.length - maxItems} pelajaran lainnya\`);
    more.textColor   = new Color("#3f3f46");
    more.font        = Font.systemFont(10);
  }

  return widget;
}

// ── Run ──────────────────────────────────────────────────────────
const widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
`;
