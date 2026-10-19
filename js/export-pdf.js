/* export-pdf.js
   Builds real, selectable-text PDFs on A4 with the jsPDF library.
   Layout is drawn by hand from the same models as the preview, and pages
   break automatically when the content is long.

   createPdf()    -> a jsPDF document for the current tab (CV or letter)
   pdfFileName()  -> e.g. "CV_Neema-Joseph-Mushi.pdf"
*/

(function () {
  'use strict';

  const { hex, slug } = CVB.utils;
  const { tr } = CVB.i18n;
  const { state } = CVB.store;
  const { cvModel, letterModel } = CVB.models;
  const { letterFormat } = CVB.letter;

  /* ---- tiny layout helper: tracks the cursor (y) and starts new pages ---- */
  function pdfBuilder(doc, M) {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const b = { W, H, M, cw: W - 2 * M, y: M };

    // make sure `h` points of space are left on the page, otherwise start a new one
    b.need = h => { if (b.y + h > H - M) { doc.addPage(); b.y = M; } };

    // wrapped paragraph; returns the wrapped lines
    b.para = (s, o) => {
      o = o || {};
      const size = o.size || 10, font = o.font || 'helvetica', style = o.style || 'normal';
      const x = o.x == null ? M : o.x, w = o.w || b.cw, lh = o.lh || 1.4, color = o.color || [22, 22, 22];
      doc.setFont(font, style);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      const firstLineIndent = o.firstLineIndent || 0;
      const ls = doc.splitTextToSize(String(s), Math.max(1, w - firstLineIndent));
      ls.forEach((l, i) => {
        b.need(size * lh);
        if (o.align === 'center') doc.text(l, x + w / 2, b.y + size * 0.8, { align: 'center' });
        else if (o.align === 'right') doc.text(l, x + w, b.y + size * 0.8, { align: 'right' });
        else doc.text(l, x + (i === 0 ? firstLineIndent : 0), b.y + size * 0.8);
        b.y += size * lh;
      });
      return ls;
    };

    // bullet with a drawn dot (no special characters, so every font works)
    b.bullet = (s, o) => {
      o = o || {};
      const size = o.size || 10, font = o.font || 'helvetica', lh = 1.4, indent = 14, off = o.x || 0;
      doc.setFont(font, 'normal');
      doc.setFontSize(size);
      const ls = doc.splitTextToSize(String(s), b.cw - indent - off);
      b.need(size * lh);
      doc.setFillColor(40, 40, 40);
      doc.circle(M + off + 4, b.y + size * 0.55, 1.4, 'F');
      doc.setTextColor(22, 22, 22);
      ls.forEach((l, i) => {
        if (i > 0) b.need(size * lh);
        doc.text(l, M + off + indent, b.y + size * 0.8);
        b.y += size * lh;
      });
    };

    return b;
  }

  /* ---------------------------- CV ---------------------------- */
  function pdfCv(doc) {
    const m = cvModel(), modern = state.template === 'modern';
    const labels = tr();
    const b = pdfBuilder(doc, 50), M = b.M, cw = b.cw, W = b.W;
    const acc = modern ? hex(state.accent) : [22, 22, 22];
    const f = modern ? 'helvetica' : 'times';
    const center = !modern;
    const align = center ? 'center' : 'left';

    // header
    b.para(m.kicker, { size: 7.5, font: 'helvetica', color: [110, 110, 110], align });
    b.y += 2;
    b.para(m.name || tr().emptyName, { size: 25, font: f, style: 'bold', color: modern ? acc : [22, 22, 22], align, lh: 1.2 });
    if (m.role) { b.y += 2; b.para(m.role, { size: 11.5, font: f, style: modern ? 'bold' : 'normal', align }); }
    if (m.contacts.length) { b.y += 5; b.para(m.contacts.join('   |   '), { size: 9.5, font: f, color: [50, 50, 50], align }); }
    if (m.details.length) b.para(m.details.join('   |   '), { size: 9, font: f, color: [90, 90, 90], align });

    // section heading with a rule under it
    function heading(title) {
      b.y += 12;
      b.need(34);
      doc.setFont(f, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(acc[0], acc[1], acc[2]);
      doc.text(title.toUpperCase(), M, b.y + 8);
      b.y += 13;
      if (modern) { doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(1.2); }
      else        { doc.setDrawColor(140, 140, 140);          doc.setLineWidth(0.6); }
      doc.line(M, b.y, W - M, b.y);
      b.y += 8;
    }

    function educationTable(items) {
      const widths = [cw * 0.29, cw * 0.27, cw * 0.15, cw * 0.29];
      const headers = [labels.eduQual, labels.eduInst, labels.eduPeriod, labels.eduNote];
      const pad = 5, lineH = 10, headerH = 25;

      function row(cells, isHeader, index) {
        const fontSize = isHeader ? 7.5 : 8.5;
        const wrapped = cells.map((value, i) => {
          doc.setFont(f, isHeader ? 'bold' : 'normal');
          doc.setFontSize(fontSize);
          return doc.splitTextToSize(String(value || ''), widths[i] - pad * 2);
        });
        const height = isHeader ? headerH : Math.max(1, ...wrapped.map(lines => lines.length)) * lineH + pad * 2;
        const pageBefore = doc.getNumberOfPages();
        b.need(height + (isHeader ? 0 : headerH));
        if (!isHeader && doc.getNumberOfPages() !== pageBefore) row(headers, true, 0);
        const fill = isHeader ? [226, 241, 231] : index % 2 === 0 ? [247, 251, 248] : [255, 255, 255];
        let x = M;
        widths.forEach((width, i) => {
          doc.setFillColor(fill[0], fill[1], fill[2]);
          doc.rect(x, b.y, width, height, 'F');
          doc.setDrawColor(185, 213, 194);
          doc.setLineWidth(0.5);
          doc.rect(x, b.y, width, height, 'S');
          doc.setFont(f, isHeader ? 'bold' : 'normal');
          doc.setFontSize(fontSize);
          doc.setTextColor(0, 0, 0);
          wrapped[i].forEach((line, j) => doc.text(line, x + pad, b.y + pad + fontSize * 0.8 + j * lineH));
          x += width;
        });
        b.y += height;
      }

      row(headers, true, 0);
      items.forEach((item, index) => row([
        item.qualification, item.institution, item.period, item.details
      ], false, index));
      b.y += 8;
    }

    m.sections.forEach(s => {
      heading(s.title);

      if (s.kind === 'text') {
        b.para(s.text, { size: 10, font: f });

      } else if (s.kind === 'education') {
        educationTable(s.items);

      } else if (s.kind === 'bullets') {
        s.items.forEach(i => b.bullet(i, { font: f }));

      } else if (s.kind === 'entries') {
        s.items.forEach(it => {
          b.need(40);
          // measure the right-hand period so the title wraps before it
          let rw = 0;
          if (it.right) { doc.setFont(f, 'normal'); doc.setFontSize(9.5); rw = doc.getTextWidth(it.right) + 12; }
          doc.setFont(f, 'bold');
          doc.setFontSize(10.5);
          const ls = doc.splitTextToSize(it.head, cw - rw);
          ls.forEach((l, i) => {
            b.need(15);
            doc.setFont(f, 'bold'); doc.setFontSize(10.5); doc.setTextColor(22, 22, 22);
            doc.text(l, M, b.y + 9);
            if (i === 0 && it.right) {
              doc.setFont(f, 'normal'); doc.setFontSize(9.5); doc.setTextColor(85, 85, 85);
              doc.text(it.right, W - M, b.y + 9, { align: 'right' });
            }
            b.y += 14.5;
          });
          if (it.sub) b.para(it.sub, { size: 10, font: f, style: 'italic', color: [70, 70, 70] });
          it.bullets.forEach(x => b.bullet(x, { font: f }));
          b.y += 7;
        });

      } else if (s.kind === 'refs') {
        // two referees per row
        const colW = (cw - 24) / 2;
        for (let i = 0; i < s.items.length; i += 2) {
          const pair = s.items.slice(i, i + 2);
          const rows = pair.map(r => {
            const arr = [];
            if (r.name) arr.push({ t: r.name, bold: true });
            if (r.title) {
              doc.setFont(f, 'normal'); doc.setFontSize(9.5);
              doc.splitTextToSize(r.title, colW).forEach(l => arr.push({ t: l, bold: false }));
            }
            r.contact.forEach(x => arr.push({ t: x, bold: false }));
            return arr;
          });
          const rowH = Math.max.apply(null, rows.map(a => a.length)) * 13;
          b.need(rowH + 6);
          rows.forEach((arr, j) => {
            arr.forEach((ln, k) => {
              doc.setFont(f, ln.bold ? 'bold' : 'normal');
              doc.setFontSize(ln.bold ? 10 : 9.5);
              const g = ln.bold ? 22 : 55;
              doc.setTextColor(g, g, g);
              doc.text(ln.t, M + j * (colW + 24), b.y + 9 + k * 13);
            });
          });
          b.y += rowH + 8;
        }
      }
    });
  }

  /* --------------------------- Letter --------------------------- */
  function pdfLetter(doc) {
    const m = letterModel(), modern = state.template === 'modern';
    const format = letterFormat();
    const b = pdfBuilder(doc, format.pdfMargin), M = b.M;
    const f = modern ? 'helvetica' : 'times';
    const size = modern ? format.modernFontSize : format.classicFontSize;

    // sender block, date, recipient, salutation
    m.sender.forEach((x, i) => b.para(x, {
      size, font: f, style: i === 0 ? 'bold' : 'normal',
      align: format.senderAlign,
      color: [22, 22, 22]
    }));
    b.y += format.addressGap; b.para(m.date, { size, font: f, align: format.dateAlign });
    b.y += format.addressGap; m.recipient.forEach(x => b.para(x, { size, font: f, align: format.recipientAlign }));
    b.y += format.addressGap; b.para(m.salutation, { size, font: f });
    b.y += format.salutationGap;

    // subject line, bold and underlined
    const sl = b.para(m.subject, { size, font: f, style: 'bold', align: format.subjectAlign });
    (function underline() {
      if (!format.subjectUnderline) return;
      const lh = size * 1.4, top = b.y - lh * sl.length;
      if (top < M - 1 || b.y > b.H - M + 1) return;   // subject crossed a page break: skip the underline
      doc.setDrawColor(22, 22, 22);
      doc.setLineWidth(0.6);
      doc.setFont(f, 'bold');
      doc.setFontSize(size);
      sl.forEach((l, i) => {
        const w = doc.getTextWidth(l);
        const y2 = top + i * lh + size * 0.8 + 2;
        const x = format.subjectAlign === 'center' ? M + (b.cw - w) / 2 : M;
        doc.line(x, y2, x + w, y2);
      });
    })();
    b.y += format.subjectGap;

    // body
    m.blocks.forEach((blk, i) => {
      const next = m.blocks[i + 1];
      if (blk.type === 'p') {
        b.para(blk.lines.join(' '), {
          size, font: f, lh: format.paragraphLineHeight,
          firstLineIndent: format.paragraphIndent
        });
        b.y += (next && next.type === 'ul') ? 3 : format.paragraphGap;
      } else {
        blk.items.forEach(x => b.bullet(x, { size, font: f, x: 6 }));
        b.y += format.listGap;
      }
    });

    // closing, signature space, name, enclosures
    b.need(110);
    b.para(m.closing, { size, font: f });
    b.y += 40;
    b.para(m.name || '', { size, font: f, style: 'bold' });
    b.y += 16;
    b.need(20 + m.encl.length * 14);
    b.para(m.enclTitle + ':', { size: size - 1, font: f, style: 'bold' });
    m.encl.forEach(x => b.bullet(x, { size: size - 1, font: f, x: 6 }));
  }

  /* ---------------------------- API ---------------------------- */
  function createPdf() {
    const lib = window.jspdf;
    if (!lib || !lib.jsPDF) throw new Error('jsPDF is not loaded');
    const doc = new lib.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    if (state.tab === 'cv') pdfCv(doc); else pdfLetter(doc);
    return doc;
  }

  async function createCombinedPdf() {
    const pdfLib = window.PDFLib;
    if (!pdfLib || !pdfLib.PDFDocument) throw new Error('PDF merging library is not loaded');

    const cvDoc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const letterDoc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    pdfCv(cvDoc);
    pdfLetter(letterDoc);

    const combined = await pdfLib.PDFDocument.create();
    for (const source of [cvDoc, letterDoc]) {
      const loaded = await pdfLib.PDFDocument.load(source.output('arraybuffer'));
      const pages = await combined.copyPages(loaded, loaded.getPageIndices());
      pages.forEach(page => combined.addPage(page));
    }

    const files = await CVB.attachments.list();
    if (files.length) {
      const divider = combined.addPage([595.28, 841.89]);
      const heading = state.lang === 'sw' ? 'VIAMBATISHO' : 'ATTACHMENTS';
      divider.drawText(heading, { x: 56, y: 750, size: 18, color: pdfLib.rgb(0, 0, 0) });
      divider.drawLine({ start: { x: 56, y: 735 }, end: { x: 539, y: 735 }, thickness: 1, color: pdfLib.rgb(0.18, 0.55, 0.34) });

      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        if (item.type === 'application/pdf') {
          const source = await pdfLib.PDFDocument.load(bytes);
          const pages = await combined.copyPages(source, source.getPageIndices());
          pages.forEach(page => combined.addPage(page));
        } else if (item.type === 'image/jpeg' || item.type === 'image/png') {
          const image = item.type === 'image/jpeg' ? await combined.embedJpg(bytes) : await combined.embedPng(bytes);
          const page = combined.addPage([595.28, 841.89]);
          const maxWidth = 483, maxHeight = 729;
          const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
          const width = image.width * scale, height = image.height * scale;
          page.drawImage(image, { x: (595.28 - width) / 2, y: (841.89 - height) / 2, width, height });
        }
      }
    }

    return combined.save();
  }

  function pdfFileName() {
    const who = slug(state.cv.name) || 'Jina';
    const kind = state.tab === 'cv' ? 'CV' : (state.lang === 'sw' ? 'Barua' : 'Cover-letter');
    return kind + '_' + who + '.pdf';
  }

  CVB.exportPdf = { createPdf, createCombinedPdf, pdfFileName };
})();
