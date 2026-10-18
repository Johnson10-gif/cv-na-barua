/* i18n.js
   All text shown to people, in Swahili (sw) and English (en).

   T   = interface text (labels, buttons, hints, messages)
   DOC = text that goes INTO the generated CV and letter (headings, salutations...)

   To add a language: copy the `en` block in both T and DOC, translate it,
   then add the language to MONTHS and the language toggle in index.html. */

(function () {
  'use strict';

  const T = {
    sw: {
      tag: 'Tengeneza wasifu (CV) na barua ya maombi ya kazi. Taarifa zako hubaki kwenye kifaa chako.',
      tabCv: 'Wasifu (CV)', tabLetter: 'Barua ya maombi', toPrev: 'Hakiki', toEdit: 'Hariri',
      exMsg: 'Hii ni mifano. Badilisha na taarifa zako au uifute yote.', exClear: 'Futa mfano',

      gPersonal: 'Taarifa binafsi', fName: 'Jina kamili', fRole: 'Taaluma au nafasi unayotafuta', fPhone: 'Simu', fEmail: 'Barua pepe',
      fAddress: 'Anwani', fDob: 'Tarehe ya kuzaliwa', fNat: 'Uraia', fLink: 'Tovuti au LinkedIn (hiari)',

      gSummary: 'Muhtasari', fSummary: 'Maelezo mafupi kukuhusu', btnSuggest: 'Tengeneza muhtasari',
      btnSuggest2: 'Bonyeza tena kubadilisha maandishi', hSummary: 'Mistari 2 hadi 4 inatosha. Kitufe kinatumia elimu na ujuzi ulioandika.',

      gEdu: 'Elimu', eduInst: 'Shule au chuo', eduQual: 'Cheti, stashahada au shahada', eduPeriod: 'Muda (mf. 2020 - 2024)',
      eduNote: 'Maelezo (GPA, mchepuo, daraja)', addEdu: 'Ongeza elimu', hEdu: 'Weka ya hivi karibuni juu.',

      gExp: 'Uzoefu wa kazi', expRole: 'Cheo', expOrg: 'Mwajiri au taasisi', expPeriod: 'Muda',
      expPoints: 'Ulichofanya (mstari mmoja kwa kila jambo)', addExp: 'Ongeza uzoefu',

      gSkills: 'Ujuzi na lugha', fSkills: 'Ujuzi wako (tenganisha kwa koma)', fLangs: 'Lugha na kiwango',
      phSkills: 'mf. Microsoft Excel, Mawasiliano, Kazi ya timu', phLangs: 'mf. Kiswahili (lugha ya kwanza), Kiingereza (nzuri)',

      gExtras: 'Vyeti na mafanikio', fExtras: 'Mstari mmoja kwa kila jambo (hiari)',

      gRefs: 'Wadhamini (referees)', hRefs: 'Wadhamini 2 au 3 ambao wamekubali kutoa taarifa zako.',
      refName: 'Jina', refTitle: 'Cheo na taasisi', refPhone: 'Simu', refEmail: 'Barua pepe', addRef: 'Ongeza mdhamini',

      gLook: 'Muonekano', lookClassic: 'Classic', lookModern: 'Modern', remove: 'Ondoa', item: 'Kipengele',

      lType: 'Aina ya barua', tJob: 'Ajira', tAttach: 'Mafunzo kwa vitendo', tVol: 'Kujitolea',
      hSender: 'Jina, simu, barua pepe na anwani yako zinatoka kwenye tab ya Wasifu (CV).', goCv: 'Fungua taarifa zangu',

      gRecipient: 'Unamwandikia nani', lRecTitle: 'Cheo cha mpokeaji (hiari)', phRec: 'Meneja Rasilimali Watu',
      lOrg: 'Taasisi au kampuni', lOrgAddr: 'Anwani ya taasisi',
      lPosJob: 'Nafasi unayoomba', lPosAtt: 'Idara au eneo la mafunzo (hiari)', lPosVol: 'Eneo la kujitolea (hiari)',
      lSource: 'Nafasi ilitangazwa wapi (hiari)', phSource: 'mf. kwenye tovuti ya Ajira Portal',
      lWhenJob: 'Utaanza kazi lini (hiari)', lWhenAtt: 'Kipindi cha mafunzo', lWhenVol: 'Muda wa kujitolea (hiari)', lDate: 'Tarehe ya barua',

      gContent: 'Maudhui', lStrengths: 'Nguvu zako kwa nafasi hii (mstari mmoja kwa kila jambo)',
      hStrengths: 'Ukiacha wazi, ujuzi wako wa kwanza kwenye CV utatumika.', lWhy: 'Kwa nini taasisi hii (hiari)',

      gBody: 'Maandishi ya barua', hBody: 'Unaweza kuhariri maandishi moja kwa moja', btnRegen: 'Tengeneza upya',
      hDirty: 'Umehariri maandishi mwenyewe, kwa hiyo mabadiliko ya fomu hayabadilishi maandishi haya. Bonyeza Tengeneza upya kuanza tena.',

      dlPdf: 'Pakua PDF', copy: 'Nakili maandishi', copied: 'Maandishi yamenakiliwa',
      copyFail: 'Imeshindwa kunakili. Chagua maandishi mwenyewe.', pdfDone: 'PDF imehifadhiwa',
      pdfFail: 'Imeshindwa kutengeneza PDF. Jaribu tena.', noDl: 'Upakuaji hauruhusiwi hapa. Tumia Nakili maandishi.',
      hPdf: 'PDF hupangwa kwenye kurasa za A4 kiotomatiki.',
      suggested: 'Muhtasari umewekwa', emptyName: 'Jina Lako', cleared: 'Mfano umefutwa'
    },

    en: {
      tag: 'Build your CV and job application letter. Your details stay on your device.',
      tabCv: 'CV', tabLetter: 'Cover letter', toPrev: 'Preview', toEdit: 'Edit',
      exMsg: 'This is example content. Replace it with your details or clear it all.', exClear: 'Clear example',

      gPersonal: 'Personal details', fName: 'Full name', fRole: 'Profession or role you are seeking', fPhone: 'Phone', fEmail: 'Email',
      fAddress: 'Address', fDob: 'Date of birth', fNat: 'Nationality', fLink: 'Website or LinkedIn (optional)',

      gSummary: 'Profile summary', fSummary: 'Short statement about you', btnSuggest: 'Suggest a summary',
      btnSuggest2: 'Click again to replace the text', hSummary: 'Two to four lines is enough. The button uses the education and skills you entered.',

      gEdu: 'Education', eduInst: 'School or university', eduQual: 'Certificate, diploma or degree', eduPeriod: 'Period (e.g. 2020 - 2024)',
      eduNote: 'Details (GPA, combination, class)', addEdu: 'Add education', hEdu: 'Put the most recent first.',

      gExp: 'Work experience', expRole: 'Job title', expOrg: 'Employer or organisation', expPeriod: 'Period',
      expPoints: 'What you did (one line each)', addExp: 'Add experience',

      gSkills: 'Skills and languages', fSkills: 'Your skills (separate with commas)', fLangs: 'Languages and level',
      phSkills: 'e.g. Microsoft Excel, Communication, Teamwork', phLangs: 'e.g. Swahili (native), English (fluent)',

      gExtras: 'Certifications and achievements', fExtras: 'One per line (optional)',

      gRefs: 'Referees', hRefs: 'Two or three people who agreed to speak for you.',
      refName: 'Name', refTitle: 'Title and organisation', refPhone: 'Phone', refEmail: 'Email', addRef: 'Add referee',

      gLook: 'Look', lookClassic: 'Classic', lookModern: 'Modern', remove: 'Remove', item: 'Item',

      lType: 'Letter type', tJob: 'Job', tAttach: 'Field attachment', tVol: 'Volunteering',
      hSender: 'Your name, phone, email and address come from the CV tab.', goCv: 'Open my details',

      gRecipient: 'Who you are writing to', lRecTitle: 'Recipient title (optional)', phRec: 'The Human Resource Manager',
      lOrg: 'Organisation or company', lOrgAddr: 'Organisation address',
      lPosJob: 'Position you are applying for', lPosAtt: 'Department or area (optional)', lPosVol: 'Volunteer area (optional)',
      lSource: 'Where the vacancy was advertised (optional)', phSource: 'e.g. on the Ajira Portal',
      lWhenJob: 'When you can start (optional)', lWhenAtt: 'Attachment period', lWhenVol: 'Volunteer period (optional)', lDate: 'Letter date',

      gContent: 'Content', lStrengths: 'Your strengths for this role (one per line)',
      hStrengths: 'If left empty, the first skills on your CV are used.', lWhy: 'Why this organisation (optional)',

      gBody: 'Letter text', hBody: 'You can edit the text directly', btnRegen: 'Regenerate',
      hDirty: 'You edited the text yourself, so form changes no longer update it. Click Regenerate to start again.',

      dlPdf: 'Download PDF', copy: 'Copy text', copied: 'Text copied',
      copyFail: 'Could not copy. Select the text yourself.', pdfDone: 'PDF saved',
      pdfFail: 'Could not create the PDF. Try again.', noDl: 'Downloads are not allowed here. Use Copy text.',
      hPdf: 'The PDF is laid out on A4 pages automatically.',
      suggested: 'Summary added', emptyName: 'Your Name', cleared: 'Example cleared'
    }
  };

  const DOC = {
    sw: {
      kicker: 'WASIFU WA KAZI',
      hProfile: 'Muhtasari', hEdu: 'Elimu', hExp: 'Uzoefu wa Kazi', hSkills: 'Ujuzi', hLangs: 'Lugha',
      hExtras: 'Vyeti na Mafanikio', hRefs: 'Wadhamini',
      dob: 'Tarehe ya kuzaliwa', nat: 'Uraia', tel: 'Simu', mail: 'Barua pepe',
      defTitle: 'Meneja Rasilimali Watu',
      closing: 'Wako mtiifu,',
      encl: 'Viambatisho',
      dear: title => 'Ndugu ' + title + ',',
      subj: {
        job:    pos => 'YAH: MAOMBI YA NAFASI YA ' + (pos || 'KAZI').toUpperCase(),
        attach: () => 'YAH: MAOMBI YA MAFUNZO KWA VITENDO',
        vol:    () => 'YAH: MAOMBI YA KUJITOLEA'
      },
      enc: {
        job:    ['Wasifu (CV)', 'Nakala za vyeti vya elimu', 'Nakala ya kitambulisho'],
        attach: ['Barua ya utambulisho kutoka chuoni', 'Wasifu (CV)', 'Nakala ya kitambulisho cha mwanafunzi'],
        vol:    ['Wasifu (CV)']
      },
      and: 'na'
    },

    en: {
      kicker: 'CURRICULUM VITAE',
      hProfile: 'Profile', hEdu: 'Education', hExp: 'Work Experience', hSkills: 'Skills', hLangs: 'Languages',
      hExtras: 'Certifications and Achievements', hRefs: 'Referees',
      dob: 'Date of birth', nat: 'Nationality', tel: 'Tel', mail: 'Email',
      defTitle: 'The Human Resource Manager',
      closing: 'Yours faithfully,',
      encl: 'Enclosures',
      dear: () => 'Dear Sir/Madam,',
      subj: {
        job:    pos => 'RE: APPLICATION FOR ' + (pos ? 'THE POSITION OF ' + pos.toUpperCase() : 'THE ADVERTISED VACANCY'),
        attach: () => 'RE: APPLICATION FOR FIELD ATTACHMENT',
        vol:    () => 'RE: APPLICATION TO VOLUNTEER'
      },
      enc: {
        job:    ['Curriculum vitae', 'Copies of academic certificates', 'Copy of national ID'],
        attach: ['Introduction letter from the university', 'Curriculum vitae', 'Copy of student ID'],
        vol:    ['Curriculum vitae']
      },
      and: 'and'
    }
  };

  // text for the language currently selected (read at call time, so it follows the toggle)
  const tr  = () => T[CVB.store.state.lang];
  const doc = () => DOC[CVB.store.state.lang];

  CVB.i18n = { T, DOC, tr, doc };
})();
