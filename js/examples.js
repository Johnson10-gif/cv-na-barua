/* examples.js
   Example content shown the first time the page opens (a made-up person),
   and the empty template used when the example is cleared. */

(function () {
  'use strict';

  const EX = {
    sw: {
      cv: {
        name: 'Neema Joseph Mushi', role: 'Afisa Rasilimali Watu Msaidizi',
        phone: '+255 712 000 000', email: 'neema.mushi@example.com', address: 'S.L.P 1234, Dodoma',
        dob: '12/03/2001', nat: 'Mtanzania', link: '',
        summary: 'Mhitimu wa Usimamizi wa Rasilimali Watu mwenye uzoefu wa mafunzo kwa vitendo katika utunzaji wa kumbukumbu za wafanyakazi. Mchapakazi, mwenye nidhamu na ari ya kujifunza.',
        skills: 'Utunzaji wa kumbukumbu, Microsoft Excel, Microsoft Word, Mawasiliano, Kazi ya timu, Kutatua matatizo',
        langs: 'Kiswahili (lugha ya kwanza), Kiingereza (nzuri)',
        extras: 'Cheti cha Ujuzi wa Kompyuta (ICDL)\nKiongozi wa Klabu ya Wanafunzi wa Rasilimali Watu, 2023',
        edu: [
          { inst: 'Chuo Kikuu cha Dodoma', qual: 'Shahada ya Usimamizi wa Rasilimali Watu', period: '2020 - 2024', note: 'GPA: 4.1 (Daraja la Pili Juu)' },
          { inst: 'Shule ya Sekondari Kilimani', qual: 'Cheti cha Elimu ya Sekondari ya Juu (ACSEE)', period: '2017 - 2019', note: 'Mchepuo: HGL' }
        ],
        exp: [
          { role: 'Mwanafunzi wa Mafunzo kwa Vitendo', org: 'Halmashauri ya Jiji la Dodoma', period: 'Julai - Septemba 2023',
            points: 'Kusaidia kutunza mafaili na kumbukumbu za wafanyakazi\nKuandaa ratiba za mafunzo kwa wafanyakazi wapya\nKuingiza taarifa za wafanyakazi kwenye mfumo wa kielektroniki' }
        ],
        refs: [
          { name: 'Dkt. Asha Mwakalinga', title: 'Mhadhiri, Chuo Kikuu cha Dodoma', phone: '+255 713 000 111', email: '' },
          { name: 'Bw. Peter Kimaro', title: 'Afisa Utumishi, Halmashauri ya Jiji la Dodoma', phone: '+255 754 000 222', email: '' }
        ]
      },
      letter: {
        type: 'job', recTitle: '', org: 'Kampuni ya Maendeleo Ltd', orgAddr: 'S.L.P 5678\nDodoma',
        position: 'Afisa Rasilimali Watu', source: 'kwenye tovuti ya Ajira Portal', when: 'mara moja',
        strengths: 'Ujuzi wa utunzaji wa kumbukumbu na taarifa za wafanyakazi\nUwezo wa kufanya kazi kwa timu na kwa muda uliopangwa\nMawasiliano mazuri ya kuandika na kuzungumza',
        why: ''
      }
    },

    en: {
      cv: {
        name: 'Neema Joseph Mushi', role: 'Assistant Human Resource Officer',
        phone: '+255 712 000 000', email: 'neema.mushi@example.com', address: 'P.O. Box 1234, Dodoma',
        dob: '12/03/2001', nat: 'Tanzanian', link: '',
        summary: 'Human Resource Management graduate with field attachment experience in staff records management. Hardworking, disciplined and eager to learn.',
        skills: 'Records management, Microsoft Excel, Microsoft Word, Communication, Teamwork, Problem solving',
        langs: 'Swahili (native), English (fluent)',
        extras: 'Computer Skills Certificate (ICDL)\nLeader, Human Resource Students Club, 2023',
        edu: [
          { inst: 'University of Dodoma', qual: 'Bachelor of Human Resource Management', period: '2020 - 2024', note: 'GPA: 4.1 (Upper Second Class)' },
          { inst: 'Kilimani Secondary School', qual: 'Advanced Certificate of Secondary Education (ACSEE)', period: '2017 - 2019', note: 'Combination: HGL' }
        ],
        exp: [
          { role: 'Field Attachment Student', org: 'Dodoma City Council', period: 'July - September 2023',
            points: 'Helped maintain staff files and records\nPrepared induction schedules for new employees\nEntered staff data into the electronic system' }
        ],
        refs: [
          { name: 'Dr. Asha Mwakalinga', title: 'Lecturer, University of Dodoma', phone: '+255 713 000 111', email: '' },
          { name: 'Mr. Peter Kimaro', title: 'Administrative Officer, Dodoma City Council', phone: '+255 754 000 222', email: '' }
        ]
      },
      letter: {
        type: 'job', recTitle: '', org: 'Maendeleo Company Ltd', orgAddr: 'P.O. Box 5678\nDodoma',
        position: 'Human Resource Officer', source: 'on the Ajira Portal', when: 'immediately',
        strengths: 'Records and staff data management skills\nAbility to work in a team and to deadlines\nGood written and spoken communication',
        why: ''
      }
    }
  };

  // empty form, one blank row in each repeatable list
  function blank(lang) {
    return {
      cv: {
        name: '', role: '', phone: '', email: '', address: '', dob: '',
        nat: lang === 'sw' ? 'Mtanzania' : 'Tanzanian',
        link: '', summary: '', skills: '', langs: '', extras: '',
        edu:  [{ inst: '', qual: '', period: '', note: '' }],
        exp:  [{ role: '', org: '', period: '', points: '' }],
        refs: [{ name: '', title: '', phone: '', email: '' }]
      },
      letter: { type: 'job', recTitle: '', org: '', orgAddr: '', position: '', source: '', when: '', strengths: '', why: '' }
    };
  }

  CVB.examples = { EX, blank };
})();
