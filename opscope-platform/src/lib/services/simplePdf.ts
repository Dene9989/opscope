import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateSimplePdf(title: string, rows: string[]) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  let cursorY = height - 40;

  const drawLine = (text: string, isTitle = false) => {
    if (cursorY < 40) {
      page = pdfDoc.addPage([595, 842]);
      cursorY = height - 40;
    }
    page.drawText(text, {
      x: 40,
      y: cursorY,
      size: isTitle ? 14 : 10,
      font: isTitle ? bold : font,
      color: rgb(0.1, 0.1, 0.1)
    });
    cursorY -= isTitle ? 24 : 14;
  };

  drawLine(title, true);
  rows.forEach((row) => drawLine(row));

  return pdfDoc.save();
}
