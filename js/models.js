/* models.js
   Turns the raw form state into clean "document models".
   The on-screen preview, the PDF and the plain-text copy all read the same
   model, so they always agree with each other.

   cvModel()     -> { kicker, name, role, contacts[], details[], sections[] }
   letterModel() -> { sender[], date, recipient[], salutation, subject, blocks[], closing, name, enclTitle, encl[] }
*/

(function () {
  'use strict';

  const { lines, splitList } = CVB.utils;
  const { MONTHS } = CVB.config;
  const { DOC } = CVB.i18n;
  const { state } = CVB.store;

  function punctuatedLines(value) {
    const parts = String(value || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    return parts.map((line, i) => line.replace(/[.,;:]+$/, '') + (i === parts.length - 1 ? '.' : ','));
  }

  // "2026-10-18" -> "18 Oktoba 2026" / "18 October 2026"
  function fmtDate(iso) {
    let d = iso ? iso.split('-') : null;
    if (!d || d.length !== 3) {
      const n = new Date();
      d = [n.getFullYear(), n.getMonth() + 1, n.getDate()];
    }
    return (+d[2]) + ' ' + MONTHS[state.lang][(+d[1]) - 1] + ' ' + d[0];
  }

  function cvModel() {
    const c = state.cv, D = DOC[state.lang];

    const contacts = [c.phone, c.email, c.address, c.link].map(x => (x || '').trim()).filter(Boolean);

    const details = [];
    if ((c.dob || '').trim()) details.push(D.dob + ': ' + c.dob.trim());
    if ((c.nat || '').trim()) details.push(D.nat + ': ' + c.nat.trim());

    const edu = c.edu
      .filter(e => e.inst || e.qual || e.period || e.note)
      .map(e => ({ qualification: e.qual, institution: e.inst, period: e.period, details: e.note }));

    const exp = c.exp
      .filter(x => x.role || x.org || x.period || x.points)
      .map(x => ({ head: x.role || x.org, right: x.period || '', sub: x.role ? x.org : '', bullets: lines(x.points) }));

    const refs = c.refs
      .filter(r => r.name || r.title || r.phone || r.email)
      .map(r => {
        const contact = [];
        if (r.phone) contact.push(D.tel + ': ' + r.phone);
        if (r.email) contact.push(D.mail + ': ' + r.email);
        return { name: r.name, title: r.title, contact };
      });

    const sections = [];
    if ((c.summary || '').trim()) sections.push({ kind: 'text', title: D.hProfile, text: c.summary.trim() });

    // experience first when there is some, otherwise education first
    const E = edu.length ? { kind: 'education', title: D.hEdu, items: edu } : null;
    const X = exp.length ? { kind: 'entries', title: D.hExp, items: exp } : null;
    (exp.length ? [X, E] : [E, X]).forEach(s => { if (s) sections.push(s); });

    const skills = splitList(c.skills);
    if (skills.length) sections.push({ kind: 'text', title: D.hSkills, text: skills.join(', ') });
    if ((c.langs || '').trim()) sections.push({ kind: 'text', title: D.hLangs, text: c.langs.trim() });

    const extras = lines(c.extras);
    if (extras.length) sections.push({ kind: 'bullets', title: D.hExtras, items: extras });
    if (refs.length) sections.push({ kind: 'refs', title: D.hRefs, items: refs });

    return {
      kicker: D.kicker,
      name: (c.name || '').trim(),
      role: (c.role || '').trim(),
      contacts, details, sections
    };
  }

  // letter body text -> blocks: paragraphs ({type:'p', lines}) and bullet lists ({type:'ul', items})
  function parseBody(s) {
    const out = [];
    let cur = null;
    String(s || '').split(/\r?\n/).forEach(line => {
      const t = line.trim();
      if (!t) { cur = null; return; }
      const isBullet = /^[•\-\*]\s+/.test(t);
      if (isBullet) {
        if (!cur || cur.type !== 'ul') { cur = { type: 'ul', items: [] }; out.push(cur); }
        cur.items.push(t.replace(/^[•\-\*]\s+/, ''));
      } else {
        if (!cur || cur.type !== 'p') { cur = { type: 'p', lines: [] }; out.push(cur); }
        cur.lines.push(t);
      }
    });
    return out;
  }

  function letterModel() {
    const c = state.cv, l = state.letter, D = DOC[state.lang];

    const contactLine = [c.phone ? D.tel + ': ' + c.phone.trim() : '', c.email ? D.mail + ': ' + c.email.trim() : '']
      .filter(Boolean).join(', ');
    const sender = [(c.name || '').trim()]
      .concat(punctuatedLines(c.address))
      .concat(contactLine ? [contactLine + '.'] : [])
      .filter(Boolean);

    const title = (l.recTitle || '').trim() || D.defTitle;
    const recipient = punctuatedLines([title, (l.org || '').trim(), l.orgAddr || ''].filter(Boolean).join('\n'));

    return {
      sender,
      date: fmtDate(l.date),
      recipient,
      salutation: D.dear(title),
      subject: D.subj[l.type]((l.position || '').trim()),
      blocks: parseBody(l.body),
      closing: D.closing,
      name: (c.name || '').trim(),
      enclTitle: D.encl,
      encl: D.enc[l.type]
    };
  }

  CVB.models = { fmtDate, cvModel, letterModel, parseBody };
})();
