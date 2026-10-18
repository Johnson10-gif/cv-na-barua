/* export-text.js
   Plain-text versions of the CV and the letter, used by the "Copy text"
   button (handy for pasting into a job portal or an email). */

(function () {
  'use strict';

  const { cvModel, letterModel } = CVB.models;

  function cvText() {
    const m = cvModel(), out = [];

    out.push(m.name);
    if (m.role) out.push(m.role);
    if (m.contacts.length) out.push(m.contacts.join(' | '));
    if (m.details.length) out.push(m.details.join(' | '));

    m.sections.forEach(s => {
      out.push('');
      out.push(s.title.toUpperCase());

      if (s.kind === 'text') {
        out.push(s.text);
      } else if (s.kind === 'bullets') {
        s.items.forEach(i => out.push('- ' + i));
      } else if (s.kind === 'entries') {
        s.items.forEach(it => {
          out.push(it.head + (it.right ? ' (' + it.right + ')' : ''));
          if (it.sub) out.push(it.sub);
          it.bullets.forEach(b => out.push('- ' + b));
          out.push('');
        });
      } else if (s.kind === 'refs') {
        s.items.forEach(r => {
          out.push([r.name, r.title].filter(Boolean).join(', '));
          r.contact.forEach(x => out.push(x));
          out.push('');
        });
      }
    });

    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function letterText() {
    const m = letterModel();
    let out = [];

    out = out.concat(m.sender);
    out.push('', m.date, '');
    out = out.concat(m.recipient);
    out.push('', m.salutation, '', m.subject, '');

    m.blocks.forEach(b => {
      out.push(b.type === 'p' ? b.lines.join('\n') : b.items.map(x => '- ' + x).join('\n'));
      out.push('');
    });

    out.push(m.closing, '', m.name, '', m.enclTitle + ':');
    m.encl.forEach(x => out.push('- ' + x));

    return out.join('\n');
  }

  CVB.exportText = { cvText, letterText };
})();
