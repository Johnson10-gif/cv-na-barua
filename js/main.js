/* main.js
   Wires the page together: listens for typing and clicks, then starts the app.
   Loaded last. Almost no logic lives here, it only calls the other files. */

(function () {
  'use strict';

  const { $, $$, clone, todayISO } = CVB.utils;
  const { MAX_REFEREES } = CVB.config;
  const { tr } = CVB.i18n;
  const { EX, blank } = CVB.examples;
  const { state, setPath, save } = CVB.store;
  const { syncBody, suggestSummary } = CVB.letter;
  const { renderPreview } = CVB.preview;
  const ui = CVB.ui;
  const { doPdf, doCombinedPrint, doCopy, getDownloader } = CVB.actions;

  $('#f-attachments').addEventListener('change', async e => {
    const input = e.target;
    const files = Array.from(input.files || []);
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];

    try {
      let existing = await CVB.attachments.list();
      for (const file of files) {
        if (!allowed.includes(file.type)) { ui.toast(tr().attachmentTypeFail); continue; }
        if (file.size > 15 * 1024 * 1024) { ui.toast(tr().attachmentSizeFail); continue; }
        if (existing.length >= 10) { ui.toast(tr().attachmentMaxFail); break; }
        await CVB.attachments.add(file);
        existing = await CVB.attachments.list();
        ui.toast(tr().attachmentAdded);
      }
    } catch (err) {
      ui.toast(tr().attachmentDbFail);
    }
    input.value = '';
    ui.renderAttachments();
  });

  /* ---------- typing in any form field ---------- */
  $('#edit').addEventListener('input', e => {
    const el = e.target;

    if (el.id === 'f-body') {                       // the person edits the letter text by hand
      state.letter.body = el.value;
      state.letter.dirty = true;
      $('#dirtyNote').hidden = false;
    } else if (el.dataset.k) {                      // fixed fields: data-k="cv.name"
      setPath(el.dataset.k, el.value);
    } else if (el.dataset.list) {                   // list fields: education, experience, referees
      state.cv[el.dataset.list][+el.dataset.i][el.dataset.f] = el.value;
    } else {
      return;
    }
    ui.update();
  });

  /* ---------- all button clicks ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('button');
    if (!el) return;

    if (el.dataset.removeAttachment) {
      CVB.attachments.remove(el.dataset.removeAttachment)
        .then(() => ui.renderAttachments())
        .catch(() => ui.toast(tr().attachmentDbFail));
      return;
    }

    // language toggle
    if (el.dataset.lang) {
      if (state.lang === el.dataset.lang) return;
      state.lang = el.dataset.lang;
      if (state.example) {                          // swap the example to the new language
        const ex = clone(EX[state.lang]);
        state.cv = ex.cv;
        state.letter = Object.assign(ex.letter, { date: state.letter.date, body: '', dirty: false });
      }
      ui.refreshAll();
      save();

    // CV / Letter tabs
    } else if (el.dataset.tab) {
      state.tab = el.dataset.tab;
      ui.applyTab();
      renderPreview();
      save();

    // option buttons: letter type, template, accent colour
    } else if (el.dataset.set) {
      const key = el.dataset.set, val = el.dataset.val;
      if (key === 'letter.type') { state.letter.type = val; if (!state.letter.dirty) state.letter.body = ''; }
      else if (key === 'template') state.template = val;
      else if (key === 'accent') state.accent = val;
      ui.applyType();
      $$('.sw').forEach(s => s.setAttribute('aria-pressed', String(s.dataset.val === state.accent)));
      ui.update();

    // remove a list item
    } else if (el.dataset.rm) {
      const arr = state.cv[el.dataset.rm];
      if (arr.length > 1) { arr.splice(+el.dataset.i, 1); ui.renderLists(); ui.update(); }

    // add a list item
    } else if (el.id === 'addEdu' || el.id === 'addExp' || el.id === 'addRef') {
      const key = el.id === 'addEdu' ? 'edu' : el.id === 'addExp' ? 'exp' : 'refs';
      if (key === 'refs' && state.cv.refs.length >= MAX_REFEREES) return;
      state.cv[key].push(ui.LISTS[key].blank());
      ui.renderLists();
      const first = $('#' + key + '-' + (state.cv[key].length - 1) + '-' + ui.LISTS[key].fields[0][0]);
      if (first) first.focus();
      ui.update();

    // suggest a CV summary (asks for a second click before replacing existing text)
    } else if (el.id === 'btnSuggest') {
      const t = tr();
      if ((state.cv.summary || '').trim() && el.dataset.armed !== '1') {
        el.dataset.armed = '1';
        el.textContent = t.btnSuggest2;
        return;
      }
      el.dataset.armed = '';
      el.textContent = t.btnSuggest;
      state.cv.summary = suggestSummary();
      $('#f-cv-summary').value = state.cv.summary;
      ui.update();
      ui.toast(t.suggested);

    // regenerate the letter text from the form
    } else if (el.id === 'btnRegen') {
      state.letter.dirty = false;
      syncBody();
      $('#dirtyNote').hidden = true;
      ui.update();

    // jump from the letter tab to the CV details
    } else if (el.id === 'goCv') {
      state.tab = 'cv';
      ui.applyTab();
      renderPreview();
      save();
      window.scrollTo(0, 0);

    // clear the example content
    } else if (el.id === 'exClear') {
      const b = blank(state.lang);
      state.cv = b.cv;
      state.letter = Object.assign(b.letter, { date: todayISO(), body: '', dirty: false });
      state.example = false;
      ui.refreshAll();
      save();
      ui.toast(tr().cleared);

    // preview toolbar
    } else if (el.id === 'btnPdf') {
      doPdf();
    } else if (el.id === 'btnCombined') {
      doCombinedPrint();
    } else if (el.id === 'btnCopy') {
      doCopy();

    // phone: switch between form and preview
    } else if (el.id === 'flip') {
      const app = $('#app');
      app.dataset.pane = app.dataset.pane === 'edit' ? 'preview' : 'edit';
      ui.applyPane();
      window.scrollTo(0, 0);
    }
  });

  // cancel the "click again to replace" state when focus leaves the summary area
  $('#edit').addEventListener('focusout', e => {
    if (e.target.id === 'f-cv-summary' || e.target.id === 'btnSuggest') {
      const b = $('#btnSuggest');
      if (b.dataset.armed === '1' && e.relatedTarget !== b) {
        b.dataset.armed = '';
        b.textContent = tr().btnSuggest;
      }
    }
  });

  /* ---------- start ---------- */
  ui.refreshAll();

  // inside claude.ai without download permission the PDF button would do nothing, so hide it
  getDownloader().then(dl => { if (window.claude && !dl) $('#btnPdf').hidden = true; });
})();
