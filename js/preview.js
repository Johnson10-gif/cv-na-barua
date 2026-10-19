/* preview.js
   Draws the live A4 sheet on the right from the document models.
   Everything typed by the person goes through esc() before it reaches innerHTML. */

(function () {
  'use strict';

  const { $, esc } = CVB.utils;
  const { tr } = CVB.i18n;
  const { state } = CVB.store;
  const { cvModel, letterModel } = CVB.models;

  function cvHtml() {
    const m = cvModel(), t = tr();
    let h = '<div class="kicker">' + esc(m.kicker) + '</div>' +
            '<h2 class="nm' + (m.name ? '' : ' empty') + '">' + esc(m.name || t.emptyName) + '</h2>';

    if (m.role) h += '<div class="rl">' + esc(m.role) + '</div>';
    if (m.contacts.length) h += '<div class="contacts">' + m.contacts.map(x => '<span>' + esc(x) + '</span>').join('') + '</div>';
    if (m.details.length) h += '<div class="details">' + esc(m.details.join('   |   ')) + '</div>';

    m.sections.forEach(s => {
      h += '<h3>' + esc(s.title) + '</h3>';

      if (s.kind === 'text') {
        h += '<p>' + esc(s.text) + '</p>';

      } else if (s.kind === 'bullets') {
        h += '<ul>' + s.items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';

      } else if (s.kind === 'entries') {
        s.items.forEach(it => {
          h += '<div class="ent"><div class="eh"><b>' + esc(it.head) + '</b>' +
               (it.right ? '<span class="pr">' + esc(it.right) + '</span>' : '') + '</div>';
          if (it.sub) h += '<div class="es">' + esc(it.sub) + '</div>';
          if (it.bullets.length) h += '<ul>' + it.bullets.map(b => '<li>' + esc(b) + '</li>').join('') + '</ul>';
          h += '</div>';
        });

      } else if (s.kind === 'refs') {
        h += '<div class="refs">' + s.items.map(r =>
          '<div class="rf">' + (r.name ? '<b>' + esc(r.name) + '</b>' : '') +
          (r.title ? '<div>' + esc(r.title) + '</div>' : '') +
          r.contact.map(x => '<div>' + esc(x) + '</div>').join('') + '</div>'
        ).join('') + '</div>';
      }
    });
    return h;
  }

  function letterHtml() {
    const m = letterModel();
    const format = CVB.letter.letterFormat();
    let h = '';

    if (m.sender.length) {
      h += '<div class="blk sender align-' + format.senderAlign + '">' + m.sender.map((x, i) => '<div>' + (i === 0 ? '<b>' + esc(x) + '</b>' : esc(x)) + '</div>').join('') + '</div>';
    }
    h += '<div class="blk letter-date align-' + format.dateAlign + '">' + esc(m.date) + '</div>';
    h += '<div class="blk recipient align-' + format.recipientAlign + '">' + m.recipient.map(x => '<div>' + esc(x) + '</div>').join('') + '</div>';
    h += '<div class="blk">' + esc(m.salutation) + '</div>';
    h += '<div class="sub align-' + format.subjectAlign + (format.subjectUnderline ? ' underlined' : '') + '">' + esc(m.subject) + '</div>';

    m.blocks.forEach((b, i) => {
      const next = m.blocks[i + 1];
      if (b.type === 'p') {
        h += '<p class="blk' + (next && next.type === 'ul' ? ' tight' : '') + '">' + esc(b.lines.join(' ')) + '</p>';
      } else {
        h += '<ul class="blk">' + b.items.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
      }
    });

    h += '<div class="blk" style="margin-bottom:0">' + esc(m.closing) + '</div><div class="sig"></div>';
    h += '<div><b>' + esc(m.name || tr().emptyName) + '</b></div>';
    h += '<div class="encl"><b>' + esc(m.enclTitle) + ':</b><ul>' + m.encl.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    return h;
  }

  // redraw once per animation frame, however many keystrokes arrive
  let frame = 0;
  function renderPreview() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const paper = $('#paper');
      const format = CVB.letter.letterFormat();
      paper.className = 'paper ' + (state.tab === 'cv' ? 'cv ' : 'lt ') + 't-' + state.template;
      paper.style.setProperty('--doc-accent', state.accent);
      paper.style.setProperty('--letter-sender-gap', format.senderCssGap);
      paper.style.setProperty('--letter-date-gap', format.dateCssGap);
      paper.style.setProperty('--letter-recipient-gap', format.recipientCssGap);
      paper.style.setProperty('--letter-subject-top-gap', format.subjectCssTopGap);
      paper.style.setProperty('--letter-subject-bottom-gap', format.subjectCssBottomGap);
      paper.style.setProperty('--letter-paragraph-align', format.paragraphAlign);
      paper.style.setProperty('--letter-paragraph-indent', format.paragraphIndentCss);
      paper.innerHTML = state.tab === 'cv' ? cvHtml() : letterHtml();
    });
  }

  CVB.preview = { renderPreview, cvHtml, letterHtml };
})();
