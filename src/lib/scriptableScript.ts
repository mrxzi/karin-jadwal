export const SCRIPTABLE_CODE = `// =============================================================================
// SCRIPTABLE IOS WIDGET - CLEAN MONOCHROME AESTHETIC EDITION
// =============================================================================

const API_URL = "https://karin-jadwal.vercel.app/api/jadwal/today";

async function createWidget() {
  const widget = new ListWidget();
  
  // Background Gradasi Hitam Matte -> Charcoal Gelap Aesthetic
  const gradient = new LinearGradient();
  gradient.colors = [new Color("#1c1c1e"), new Color("#0c0c0e")];
  gradient.locations = [0.0, 1.0];
  widget.backgroundGradient = gradient;
  
  widget.setPadding(16, 18, 16, 18);

  let data = null;
  try {
    const req = new Request(API_URL);
    req.timeoutInterval = 10;
    data = await req.loadJSON();
  } catch (err) {
    console.error("Gagal mengambil data dari API: " + err);
  }

  if (!data || !data.schedule) {
    const errText = widget.addText("Jadwal Tidak Terhubung");
    errText.textColor = new Color("#71717a");
    errText.font = Font.mediumSystemFont(12);
    return widget;
  }

  // Header: Minimalist & Clean (e.g. "JADWAL KARIN - SENIN" + "4 Pelajaran")
  const headerStack = widget.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();

  const dayTitle = \`JADWAL KARIN - \${(data.day || "HARI INI").toUpperCase()}\`;
  const dayText = headerStack.addText(dayTitle);
  dayText.textColor = new Color("#f4f4f5"); // Putih Bersih
  dayText.font = Font.boldSystemFont(12);

  headerStack.addSpacer();

  const countText = headerStack.addText(\`\${data.totalClasses || 0} Pelajaran\`);
  countText.textColor = new Color("#71717a"); // Muted Grey
  countText.font = Font.mediumSystemFont(10);

  widget.addSpacer(10);

  // Minimal Thin Divider
  const divider = widget.addStack();
  divider.size = new Size(0, 1);
  divider.backgroundColor = new Color("#27272a");

  widget.addSpacer(10);

  // Free Day / Libur State
  if (!data.schedule || data.schedule.length === 0) {
    const freeText = widget.addText("Libur & Bersantai");
    freeText.textColor = new Color("#e4e4e7");
    freeText.font = Font.semiboldSystemFont(13);

    widget.addSpacer(3);
    const subFree = widget.addText("Tidak ada jadwal pelajaran hari ini.");
    subFree.textColor = new Color("#71717a");
    subFree.font = Font.systemFont(11);
    return widget;
  }

  // Daftar Pelajaran Clean (Hanya Nama Mata Pelajaran)
  const maxItems = config.widgetFamily === "small" ? 3 : 4;
  const itemsToShow = data.schedule.slice(0, maxItems);

  itemsToShow.forEach((item, index) => {
    const itemStack = widget.addStack();
    itemStack.layoutHorizontally();
    itemStack.centerAlignContent();

    // Indikator Titik Status Minimalis
    const dot = itemStack.addText(item.isCurrent ? "● " : "• ");
    dot.textColor = item.isCurrent ? new Color("#ffffff") : new Color("#52525b");
    dot.font = Font.systemFont(item.isCurrent ? 11 : 10);

    const subjectTitle = itemStack.addText(item.subject);
    subjectTitle.font = item.isCurrent ? Font.boldSystemFont(13) : Font.mediumSystemFont(12);
    subjectTitle.textColor = item.isCurrent 
      ? new Color("#ffffff") 
      : item.isPast ? new Color("#52525b") : new Color("#d4d4d8");

    if (item.isCurrent) {
      itemStack.addSpacer(6);
      const tag = itemStack.addText("sekarang");
      tag.textColor = new Color("#a1a1aa");
      tag.font = Font.italicSystemFont(10);
    }

    if (index < itemsToShow.length - 1) {
      widget.addSpacer(7);
    }
  });

  return widget;
}

const widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();
`;
