/* config.js
   App-wide constants. Loaded first; creates the shared CVB namespace. */

window.CVB = window.CVB || {};

CVB.config = {
  // localStorage key (bump the version if the saved data shape changes)
  STORAGE_KEY: 'cvnabarua.v1',

  // most referees a CV can list
  MAX_REFEREES: 4,

  MONTHS: {
    sw: ['Januari','Februari','Machi','Aprili','Mei','Juni','Julai','Agosti','Septemba','Oktoba','Novemba','Desemba'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December']
  },

  // accent colours for the Modern template: [hex, [Swahili name, English name]]
  ACCENTS: [
    ['#0F5C4A', ['Kijani', 'Green']],
    ['#1F3A68', ['Bluu', 'Navy']],
    ['#7A1F2B', ['Maroon', 'Maroon']],
    ['#333B45', ['Kijivu', 'Graphite']]
  ]
};
