/* state.js
   The single source of truth for everything the person typed or chose,
   plus saving to / loading from the browser (localStorage).

   `state` is one object that is never replaced, only changed in place,
   so every other file can safely keep a reference to it.

   Shape:
   {
     lang: 'sw' | 'en',
     tab: 'cv' | 'letter',
     template: 'classic' | 'modern',
     accent: '#RRGGBB',
     example: true | false,        // true while the made-up example is showing
     cv:     { name, role, phone, ..., edu:[], exp:[], refs:[] },
     letter: { type, recTitle, org, ..., date, body, dirty }
   }
*/

(function () {
  'use strict';

  const { ACCENTS, STORAGE_KEY } = CVB.config;
  const { clone, todayISO } = CVB.utils;
  const { EX, blank } = CVB.examples;

  const state = {};

  function initialState(lang) {
    const e = clone(EX[lang]);
    return {
      lang: lang,
      tab: 'cv',
      template: 'classic',
      accent: ACCENTS[0][0],
      example: true,
      cv: e.cv,
      letter: Object.assign(e.letter, { date: todayISO(), body: '', dirty: false })
    };
  }

  // read the saved state, or fall back to the example
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.cv && s.letter && (s.lang === 'sw' || s.lang === 'en')) {
          const base = initialState(s.lang);
          s.cv = Object.assign(base.cv, s.cv);
          s.letter = Object.assign(base.letter, s.letter);
          ['edu', 'exp', 'refs'].forEach(k => {
            if (!Array.isArray(s.cv[k]) || !s.cv[k].length) s.cv[k] = clone(blank(s.lang).cv[k]);
          });
          if (!s.letter.date) s.letter.date = todayISO();
          s.tab = s.tab === 'letter' ? 'letter' : 'cv';
          if (!s.template) s.template = 'classic';
          if (!s.accent) s.accent = ACCENTS[0][0];
          return s;
        }
      }
    } catch (e) { /* storage blocked or corrupted: start fresh */ }
    return initialState('sw');
  }

  // save a moment after the last change (not on every keystroke)
  let timer = null;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }, 300);
  }

  // 'cv.name' -> state.cv.name
  function getPath(path) {
    return path.split('.').reduce((o, k) => o && o[k], state);
  }
  function setPath(path, value) {
    const keys = path.split('.');
    let o = state;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = value;
  }

  Object.assign(state, load());

  CVB.store = { state, initialState, save, getPath, setPath };
})();
