/* ui.js
   Everything that puts state onto the screen (except the A4 sheet, see preview.js):
   labels in the chosen language, tabs, the phone pane switch, the repeatable
   lists (education, experience, referees), accent swatches and the toast.

   refreshAll() redraws the whole interface (use after a big change such as
   switching language or clearing the example).
   update()     is the light version used on every keystroke. */

(function () {
  'use strict';

  const { $, $$, esc } = CVB.utils;
  const { ACCENTS } = CVB.config;
  const { tr } = CVB.i18n;
  const { state, getPath, save } = CVB.store;
  const { syncBody } = CVB.letter;
  const { renderPreview } = CVB.preview;

  /* ---- toast ---- */
  let toastTimer = null;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('on'), 2800);
  }

  /* ---- repeatable lists ----
     fields: [key in the item, label key in i18n, 'i' = input | 't' = textarea] */
  const LISTS = {
    edu: {
      host: '#eduList',
      fields: [['inst', 'eduInst', 'i'], ['qual', 'eduQual', 'i'], ['period', 'eduPeriod', 'i'], ['note', 'eduNote', 't']],
      blank: () => ({ inst: '', qual: '', period: '', note: '' })
    },
    exp: {
      host: '#expList',
      fields: [['role', 'expRole', 'i'], ['org', 'expOrg', 'i'], ['period', 'expPeriod', 'i'], ['points', 'expPoints', 't']],
      blank: () => ({ role: '', org: '', period: '', points: '' })
    },
    refs: {
      host: '#refList',
      fields: [['name', 'refName', 'i'], ['title', 'refTitle', 'i'], ['phone', 'refPhone', 'i'], ['email', 'refEmail', 'i']],
      blank: () => ({ name: '', title: '', phone: '', email: '' })
    }
  };

  function renderLists() {
    const t = tr();
    Object.keys(LISTS).forEach(key => {
      const def = LISTS[key], arr = state.cv[key];
      let html = '';

      arr.forEach((item, i) => {
        html += '<div class="item"><div class="item-h"><span>' + (i + 1) + '</span>' +
          (arr.length > 1
            ? '<button type="button" class="btn sm rm" id="rm-' + key + '-' + i + '" data-rm="' + key + '" data-i="' + i + '">' + esc(t.remove) + '</button>'
            : '') + '</div>';

        let grid = '';
        def.fields.forEach(fd => {
          const id = key + '-' + i + '-' + fd[0];
          const attrs = 'id="' + id + '" data-list="' + key + '" data-i="' + i + '" data-f="' + fd[0] + '"';
          grid += '<label class="fld"><span>' + esc(t[fd[1]]) + '</span>' +
            (fd[2] === 't'
              ? '<textarea ' + attrs + ' rows="3">' + esc(item[fd[0]]) + '</textarea>'
              : '<input ' + attrs + ' value="' + esc(item[fd[0]]) + '">') +
            '</label>';
        });
        html += '<div class="cols">' + grid + '</div></div>';
      });

      $(def.host).innerHTML = html;
    });
  }

  async function renderAttachments() {
    const list = $('#attachmentList');
    try {
      const files = await CVB.attachments.list();
      list.innerHTML = files.length ? files.map(file =>
        '<li><span>' + esc(file.name) + ' <small>(' + (file.size / 1048576).toFixed(1) + ' MB)</small></span>' +
        '<button type="button" class="btn sm rm" data-remove-attachment="' + file.id + '">' + esc(tr().attachmentRemove) + '</button></li>'
      ).join('') : '<li class="attachment-empty">' + esc(tr().attachmentEmpty) + '</li>';
    } catch (e) {
      list.innerHTML = '<li class="attachment-empty">' + esc(tr().attachmentDbFail) + '</li>';
    }
  }

  // put state values into the fixed form fields (anything with data-k="path")
  function fillStatic() {
    $$('[data-k]').forEach(el => {
      const v = getPath(el.dataset.k);
      el.value = v == null ? '' : v;
    });
    $('#f-body').value = state.letter.body || '';
  }

  /* ---- language ---- */
  function applyLang() {
    const t = tr();
    document.documentElement.lang = state.lang;
    $$('[data-t]').forEach(el  => { if (t[el.dataset.t]  != null) el.textContent = t[el.dataset.t]; });
    $$('[data-ph]').forEach(el => { if (t[el.dataset.ph] != null) el.placeholder = t[el.dataset.ph]; });
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    $('#btnSuggest').textContent = t.btnSuggest;
    applyType();
    renderLists();
    renderAttachments();
    renderSwatches();
    applyPane();
  }

  // labels and pressed states that depend on the letter type and template
  function applyType() {
    const t = tr(), type = state.letter.type;
    $('#lbl-pos').textContent  = type === 'job' ? t.lPosJob  : type === 'attach' ? t.lPosAtt  : t.lPosVol;
    $('#lbl-when').textContent = type === 'job' ? t.lWhenJob : type === 'attach' ? t.lWhenAtt : t.lWhenVol;
    $('#wrap-source').hidden = type !== 'job';
    $$('[data-set]').forEach(b => b.setAttribute('aria-pressed', String(String(getPath(b.dataset.set)) === b.dataset.val)));
    $('#swatches').hidden = state.template !== 'modern';
  }

  function renderSwatches() {
    const li = state.lang === 'sw' ? 0 : 1;
    $('#swatches').innerHTML = ACCENTS.map((a, i) =>
      '<button type="button" class="sw" id="sw-' + i + '" data-set="accent" data-val="' + a[0] + '"' +
      ' aria-label="' + esc(a[1][li]) + '" title="' + esc(a[1][li]) + '"' +
      ' style="background:' + a[0] + '" aria-pressed="' + (state.accent === a[0]) + '"></button>'
    ).join('');
    $('#swatches').hidden = state.template !== 'modern';
  }

  /* ---- tabs, phone pane, example banner ---- */
  function applyTab() {
    $('#panel-cv').hidden = state.tab !== 'cv';
    $('#panel-letter').hidden = state.tab !== 'letter';
    $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)));
  }
  function applyPane() {
    const pane = $('#app').dataset.pane, t = tr();
    $('#flip').textContent = pane === 'edit' ? t.toPrev : t.toEdit;
  }
  function applyExample() {
    $('#exNote').hidden = !state.example;
  }

  /* ---- redraw ---- */
  function refreshAll() {
    applyTab();
    applyLang();
    applyExample();
    fillStatic();
    syncBody();
    $('#dirtyNote').hidden = !state.letter.dirty;
    renderPreview();
  }

  function update() {
    syncBody();
    renderPreview();
    save();
  }

  CVB.ui = { toast, LISTS, renderLists, renderAttachments, fillStatic, applyLang, applyType, renderSwatches, applyTab, applyPane, applyExample, refreshAll, update };
})();
