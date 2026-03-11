const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = (data) => {
  const {
    patientName,
    medecinName,
    date,
    compteRendu,
    ordonnance,
    consultationId,
  } = data;

  const filePath = path.join(
    __dirname,
    `../uploads/ordonnance-${consultationId}.pdf`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // HEADER
  doc
    .fontSize(18)
    .text("ORDONNANCE MÉDICALE", { align: "center" })
    .moveDown();

  doc.fontSize(12).text(`Date : ${date}`);
  doc.text(`Médecin : Dr. ${medecinName}`);
  doc.text(`Patient : ${patientName}`);

  doc.moveDown();

  // COMPTE RENDU
  doc.fontSize(14).text("Compte rendu médical", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(compteRendu);

  doc.moveDown();

  // ORDONNANCE
  doc.fontSize(14).text("Ordonnance", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(ordonnance);

  doc.moveDown(3);
  doc.text("Signature du médecin", { align: "right" });

  doc.end();

  return filePath;
};
