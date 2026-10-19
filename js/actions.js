/* actions.js
   The two buttons above the preview: Download PDF and Copy text. */

(function () {
  'use strict';

  const { tr } = CVB.i18n;
  const { slug } = CVB.utils;
  const { state } = CVB.store;
  const { toast } = CVB.ui;
  const { createPdf, createCombinedPdf, pdfFileName } = CVB.exportPdf;
  const { cvText, letterText } = CVB.exportText;

  /* Inside claude.ai the page must use the "downloads" capability to save a file.
     On your own hosting there is no window.claude, so jsPDF saves the file directly. */
  let downloaderPromise = null;
  function getDownloader() {
    if (!downloaderPromise) {
      downloaderPromise = (async () => {
        try {
          return window.claude && window.claude.use ? await window.claude.use('downloads') : null;
        } catch (e) { return null; }
      })();
    }
    return downloaderPromise;
  }

  async function doPdf() {
    const t = tr();
    try {
      const downloader = await getDownloader();
      const embedded = !!window.claude;              // running inside claude.ai
      if (embedded && !downloader) { toast(t.noDl); return; }

      const doc = createPdf();
      const filename = pdfFileName();
      if (downloader) await downloader.save({ filename, data: doc.output('blob') });
      else doc.save(filename);
      toast(t.pdfDone);
    } catch (e) {
      if (e && e.code === 'declined') return;        // the person said no: stay quiet
      toast(t.pdfFail);
    }
  }

  async function doCombinedPrint() {
    const t = tr();
    const printTab = window.claude ? null : window.open('about:blank', '_blank');
    try {
      const downloader = await getDownloader();
      if (window.claude && !downloader) { toast(t.noDl); return; }

      const bytes = await createCombinedPdf();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const filename = 'Maombi_' + (slug(state.cv.name) || 'Jina') + '.pdf';
      if (downloader) {
        await downloader.save({ filename, data: blob });
        toast(t.pdfDone);
      } else if (printTab) {
        printTab.location.href = URL.createObjectURL(blob);
        toast(t.combinedReady);
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        toast(t.pdfDone);
      }
    } catch (e) {
      if (printTab) printTab.close();
      toast(t.combinedFail);
    }
  }

  async function doCopy() {
    const t = tr();
    const text = state.tab === 'cv' ? cvText() : letterText();
    try {
      await navigator.clipboard.writeText(text);
      toast(t.copied);
      return;
    } catch (e) { /* fall through to the older method */ }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      toast(ok ? t.copied : t.copyFail);
    } catch (e2) {
      toast(t.copyFail);
    }
  }

  CVB.actions = { getDownloader, doPdf, doCombinedPrint, doCopy };
})();
