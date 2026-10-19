/* letter-generator.js
   Writes the cover letter text and the CV summary suggestion from what the
   person entered. Plain templates, no AI and no network.

   genBody()          -> the letter body (paragraphs separated by a blank line,
                         bullet lines start with "• ")
   syncBody()         -> refresh the body textarea, unless the person edited it by hand
   suggestSummary()   -> a 2 to 3 sentence CV summary
*/

(function () {
  'use strict';

  const { $, lines, splitList, joinList } = CVB.utils;
  const { state } = CVB.store;

  const bullets = arr => arr.map(x => '• ' + x).join('\n');
  const LETTER_FORMAT = Object.freeze({
    senderAlign: 'right',
    dateAlign: 'right',
    recipientAlign: 'left',
    subjectAlign: 'center',
    subjectUnderline: true,
    addressGap: 12,
    salutationGap: 12,
    subjectGap: 10,
    paragraphGap: 10,
    listGap: 10,
    senderCssGap: '0.35em',
    dateCssGap: '1em',
    recipientCssGap: '1em',
    subjectCssTopGap: '1.2em',
    subjectCssBottomGap: '1em',
    paragraphAlign: 'justify',
    pdfMargin: 64,
    modernFontSize: 10.5,
    classicFontSize: 11.5,
    paragraphLineHeight: 1.45
  });

  function letterFormat() {
    return LETTER_FORMAT;
  }

  function genBody() {
    const L = state.lang, c = state.cv, l = state.letter;
    const e0 = c.edu[0] || {}, x0 = c.exp[0] || {};

    const org  = (l.org || '').trim();
    const pos  = (l.position || '').trim();
    const when = (l.when || '').trim();
    const src  = (l.source || '').trim();
    const qual = (e0.qual || '').trim();
    const inst = (e0.inst || '').trim();
    const why  = (l.why || '').trim();
    const hasExp = !!((x0.role || '').trim() || (x0.org || '').trim());

    // strengths: what was typed, otherwise the first skills from the CV
    let st = lines(l.strengths);
    if (!st.length) st = splitList(c.skills).slice(0, 4);

    const P = [];

    /* ---------------- Kiswahili ---------------- */
    if (L === 'sw') {
      const edu = qual ? ' Elimu yangu ni pamoja na ' + qual + (inst ? ' kutoka ' + inst : '') + '.' : '';
      const orgWhy = org
        ? 'Ninavutiwa na ' + org + ' kutokana na mchango wake katika sekta hii, na ninaamini nafasi hii itaniwezesha kukua kitaaluma huku nikiongeza thamani kwa taasisi.'
        : '';

      if (l.type === 'job') {
        P.push('Kwa heshima na taadhima, naomba kuwasilisha maombi ya nafasi ya ' + (pos || 'kazi') +
          (src ? ' kama ilivyotangazwa ' + src : '') + (org ? ' katika ' + org : '') + '.' + edu +
          ' Ninapenda kutumia ujuzi wangu kuchangia mafanikio ya ' + (org || 'taasisi yenu') + '.');
        if (st.length) P.push('Nguvu zangu kuu ni pamoja na:\n' + bullets(st));
        P.push(hasExp
          ? 'Hivi karibuni nimefanya kazi kama ' + (x0.role || 'mfanyakazi') + (x0.org ? ' katika ' + x0.org : '') +
            (x0.period ? ' (' + x0.period + ')' : '') +
            '. Uzoefu huo umenijengea nidhamu ya kazi, ushirikiano na timu na ujuzi wa vitendo unaoendana na nafasi hii.'
          : 'Nikiwa mhitimu mpya, nimepata maarifa na ujuzi wa vitendo kupitia masomo na miradi, na niko tayari kujifunza na kuchangia kuanzia siku ya kwanza.');
        if (why || orgWhy) P.push(why || orgWhy);
        P.push((when ? 'Niko tayari kuanza kazi ' + when + '. ' : '') +
          'Nimeambatisha wasifu wangu (CV) pamoja na nakala za vyeti vyangu. Nitafurahi kupata fursa ya usaili ili kujadili maombi yangu kwa kina. Asanteni kwa kuzingatia maombi haya.');

      } else if (l.type === 'attach') {
        P.push('Kwa heshima na taadhima, naomba kuwasilisha maombi ya nafasi ya mafunzo kwa vitendo' +
          (org ? ' katika ' + org : '') + (pos ? ', katika ' + pos : '') + (when ? ' kwa kipindi cha ' + when : '') + '.' +
          (qual || inst ? ' Mimi ni mwanafunzi' + (qual ? ' wa ' + qual : '') + (inst ? ' katika ' + inst : '') + '.' : ''));
        P.push('Mafunzo haya ni sehemu ya mtaala wangu na yatanipa fursa ya kutumia kwa vitendo ninachojifunza darasani.' +
          (st.length ? '\nUjuzi nilionao ni pamoja na:\n' + bullets(st) : ''));
        P.push('Ninaahidi kufuata kanuni na taratibu za taasisi yenu, na kuwa mwadilifu, mchapakazi na mwenye nidhamu katika kipindi chote cha mafunzo.');
        if (why || orgWhy) P.push(why || orgWhy);
        P.push('Nimeambatisha barua ya utambulisho kutoka chuoni, wasifu wangu (CV) na nakala ya kitambulisho cha mwanafunzi. Asanteni kwa kuzingatia maombi yangu.');

      } else {
        P.push('Kwa heshima na taadhima, naomba kuwasilisha maombi ya kujitolea' + (org ? ' katika ' + org : '') +
          (pos ? ' katika eneo la ' + pos : '') + (when ? ' (' + when + ')' : '') + '.' + edu);
        if (st.length) P.push('Ninaweza kuchangia kupitia:\n' + bullets(st));
        P.push('Ninaamini kujitolea ni njia ya kuchangia jamii na kujenga uzoefu, na niko tayari kufuata maelekezo na kufanya kazi kwa bidii katika kipindi nitakachopangiwa.');
        if (why || orgWhy) P.push(why || orgWhy);
        P.push('Nimeambatisha wasifu wangu (CV) kwa taarifa zaidi. Nitafurahi kupata nafasi ya kuzungumza nanyi. Asanteni kwa kuzingatia maombi yangu.');
      }

    /* ---------------- English ---------------- */
    } else {
      const eduE = qual ? ' My academic background includes ' + qual + (inst ? ' from ' + inst : '') + '.' : '';
      const orgWhyE = org
        ? 'I am drawn to ' + org + ' because of its contribution to the sector, and I believe this opportunity would let me grow professionally while adding value to the organisation.'
        : '';

      if (l.type === 'job') {
        P.push('I am writing to apply for ' + (pos ? 'the position of ' + pos : 'the vacancy') +
          (src ? ', as advertised ' + src : '') + (org ? ' at ' + org : '') + '.' + eduE +
          ' I am eager to use my skills to contribute to the success of ' + (org || 'your organisation') + '.');
        if (st.length) P.push('My key strengths include:\n' + bullets(st));
        P.push(hasExp
          ? 'Most recently, I worked as ' + (x0.role || 'a team member') + (x0.org ? ' at ' + x0.org : '') +
            (x0.period ? ' (' + x0.period + ')' : '') +
            '. This experience built my work discipline, teamwork and practical skills that match this role.'
          : 'As a recent graduate, I have gained practical knowledge and skills through my studies and projects, and I am ready to learn and contribute from the first day.');
        if (why || orgWhyE) P.push(why || orgWhyE);
        P.push((when ? 'I am available to start ' + when + '. ' : '') +
          'I have attached my CV and copies of my certificates. I would welcome an interview to discuss my application in more detail. Thank you for considering it.');

      } else if (l.type === 'attach') {
        P.push('I am writing to apply for a field attachment placement' + (org ? ' at ' + org : '') + (pos ? ' in ' + pos : '') +
          (when ? ' for ' + when : '') + '.' +
          (qual || inst ? ' I am a student' + (qual ? ' of ' + qual : '') + (inst ? ' at ' + inst : '') + '.' : ''));
        P.push('This training is part of my study programme and will let me apply in practice what I have learnt in class.' +
          (st.length ? '\nSkills I bring include:\n' + bullets(st) : ''));
        P.push('I promise to follow your rules and procedures and to be honest, hardworking and disciplined throughout the attachment.');
        if (why || orgWhyE) P.push(why || orgWhyE);
        P.push('I have attached an introduction letter from my university, my CV and a copy of my student ID. Thank you for considering my application.');

      } else {
        P.push('I am writing to apply to volunteer' + (org ? ' at ' + org : '') + (pos ? ' in ' + pos : '') +
          (when ? ' (' + when + ')' : '') + '.' + eduE);
        if (st.length) P.push('I can contribute through:\n' + bullets(st));
        P.push('I believe volunteering is a way to serve the community and build experience, and I am ready to follow guidance and work hard throughout the period assigned to me.');
        if (why || orgWhyE) P.push(why || orgWhyE);
        P.push('I have attached my CV for more information. I would be glad to speak with you. Thank you for considering my application.');
      }
    }

    return P.join('\n\n');
  }

  // keep the body textarea in step with the form, unless the person edited it
  function syncBody() {
    if (state.letter.dirty) return;
    const body = genBody();
    state.letter.body = body;
    const ta = $('#f-body');
    if (ta && ta.value !== body) ta.value = body;
  }

  function suggestSummary() {
    const L = state.lang, c = state.cv, e0 = c.edu[0] || {};
    const qual = (e0.qual || '').trim();
    const inst = (e0.inst || '').trim();
    const role = (c.role || '').trim();
    const skills = splitList(c.skills).slice(0, 4);

    if (L === 'sw') {
      return (role || 'Mtaalamu mchapakazi') + ' mwenye ' +
        (qual ? qual + (inst ? ' kutoka ' + inst : '') : 'msingi imara wa kitaaluma') +
        (skills.length ? ' na ujuzi katika ' + joinList(skills, 'na') : '') +
        '. Mchapakazi, mwenye nidhamu na ari ya kujifunza, na ninaweza kufanya kazi peke yangu au kwa ushirikiano na timu.';
    }
    return (role || 'Motivated professional') + ' with ' +
      (qual ? 'a ' + qual + (inst ? ' from ' + inst : '') : 'a solid academic background') +
      (skills.length ? ', skilled in ' + joinList(skills, 'and') : '') +
      '. Hardworking, disciplined and eager to learn, with the ability to work independently and as part of a team.';
  }

  CVB.letter = { genBody, syncBody, suggestSummary, letterFormat };
})();
