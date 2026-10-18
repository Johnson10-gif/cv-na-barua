/* utils.js
   Small pure helpers used everywhere. No app state in here. */

(function () {
  'use strict';

  // DOM shortcuts
  const $  = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  // escape text before putting it into innerHTML
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // textarea text -> clean lines (blank lines dropped, leading bullet marks removed)
  function lines(s) {
    return String(s || '')
      .split(/\r?\n/)
      .map(x => x.trim().replace(/^[•\-\*]\s+/, ''))
      .filter(Boolean);
  }

  // "a, b; c" -> ['a','b','c']
  function splitList(s) {
    return String(s || '').split(/[,;\n]+/).map(x => x.trim()).filter(Boolean);
  }

  // ['a','b','c'], 'and' -> "a, b and c"
  function joinList(arr, and) {
    if (arr.length < 2) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' ' + and + ' ' + arr[arr.length - 1];
  }

  // "Neema Joseph" -> "Neema-Joseph" (for file names)
  function slug(s) {
    return String(s || '').trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  const clone = o => JSON.parse(JSON.stringify(o));

  // '#0F5C4A' -> [15, 92, 74]
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // today as YYYY-MM-DD in the device's local time
  function todayISO() {
    const d = new Date();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + m + '-' + day;
  }

  CVB.utils = { $, $$, esc, lines, splitList, joinList, slug, clone, hex, todayISO };
})();
