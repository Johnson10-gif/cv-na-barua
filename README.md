# CV na Barua

Zana ya kutengeneza **wasifu (CV)** na **barua ya maombi** (ajira, mafunzo kwa vitendo, kujitolea) kwa Kiswahili au Kiingereza. Ni HTML, CSS na JavaScript ya kawaida: hakuna build, hakuna server, hakuna API ya malipo. Taarifa za mtumiaji zinabaki kwenye kifaa chake (localStorage).

## Jinsi ya kuifungua

1. Fungua `index.html` kwenye browser (double-click inatosha).
2. Au iweke kwenye hosting yoyote ya bure (GitHub Pages, Netlify, Vercel).

### Kuchapisha mabadiliko GitHub Pages

Workflow ya `.github/workflows/pages.yml` huchapisha tovuti upya kila unapofanya `push` kwenda `main` au `master`. Kwenye GitHub, fungua **Settings → Pages** na uchague **GitHub Actions** kama build and deployment source. Baada ya hapo, weka mabadiliko yako kwa `commit` na `push`; mabadiliko ya faili kwenye kompyuta pekee hayaonekani kwa watu wengine mpaka uyasukume GitHub. Hali ya uchapishaji huonekana kwenye kichupo cha **Actions**, na link ya tovuti hupatikana kwenye **Settings → Pages**.

### Google Search na SEO

SEO metadata, `robots.txt` na `sitemap.xml` vimewekwa kwa GitHub Pages. Fuata [SEO_GUIDE.md](SEO_GUIDE.md) kusajili tovuti kwenye Google Search Console, kuthibitisha umiliki, kuwasilisha sitemap na kuomba indexing.

Intaneti inahitajika kupakia fonti za Google na maktaba ya PDF (jsPDF). Kwa matumizi bila intaneti kabisa, pakua `jspdf.umd.min.js` kwenye folder `vendor/` na ubadilishe `src` yake kwenye `index.html`.

## Mpangilio wa folder

```
cv-na-barua/
├── index.html              Muundo wa ukurasa (fomu, preview, vitufe)
├── README.md
├── css/
│   ├── base.css            Rangi (tokens), dark mode, reset, maandishi ya msingi
│   ├── layout.css          Header, tabs, gridi ya pande mbili, kitufe cha simu
│   ├── components.css      Vitufe, fomu, makundi, swatches, toast
│   └── paper.css           Karatasi ya A4 na templates (Classic, Modern)
└── js/
    ├── config.js           Constants: miezi, rangi za accent, key ya localStorage
    ├── utils.js            Vyombo vidogo: esc, lines, slug, hex, todayISO
    ├── i18n.js             Maandishi yote ya Kiswahili na Kiingereza
    ├── examples.js         Mfano wa mtu wa kubuni na fomu tupu
    ├── state.js            Hali ya app (state), kuhifadhi na kusoma localStorage
    ├── models.js           Hubadilisha state kuwa muundo safi wa CV na barua
    ├── letter-generator.js Huandika maandishi ya barua na muhtasari wa CV
    ├── preview.js          Huchora karatasi ya A4 kwenye skrini
    ├── export-text.js      Maandishi matupu kwa kitufe cha "Nakili maandishi"
    ├── export-pdf.js       Hutengeneza PDF kwa jsPDF
    ├── ui.js               Lugha, tabs, orodha (elimu, uzoefu, wadhamini), toast
    ├── actions.js          Vitufe vya "Pakua PDF" na "Nakili maandishi"
    └── main.js             Matukio (kuandika, kubonyeza) na kuanzisha app
```

## Mpangilio wa kupakia scripts

Scripts zinapakiwa kwa mpangilio ulioandikwa kwenye `index.html`. Kila faili linatumia tu mafaili yaliyo juu yake. Zote zinahifadhi kazi zake kwenye object moja, `CVB` (mfano `CVB.models.cvModel`), kwa hiyo hakuna function za global zinazogongana.

```
config → utils → i18n → examples → state → models → letter-generator
       → preview → export-text → export-pdf → ui → actions → main
```

## Mtiririko wa data

```
fomu ──► state ──► models ──┬──► preview (karatasi kwenye skrini)
                            ├──► export-pdf (PDF)
                            └──► export-text (nakili maandishi)
```

CV na barua zote hutoka kwenye `models.js`, kwa hiyo preview, PDF na maandishi yaliyonakiliwa huwa sawa kila wakati.

## Mabadiliko ya kawaida

| Unataka kufanya nini | Badilisha wapi |
|---|---|
| Kubadilisha maneno ya kiolesura | `js/i18n.js` (`T`) |
| Kubadilisha vichwa vya CV au salamu za barua | `js/i18n.js` (`DOC`) |
| Kubadilisha sentensi za barua | `js/letter-generator.js` |
| Kuongeza rangi ya accent | `js/config.js` (`ACCENTS`) |
| Kuongeza template mpya | `css/paper.css` (darasa `.t-jina`), kitufe kwenye `index.html`, na `pdfCv` / `pdfLetter` kwenye `js/export-pdf.js` |
| Kuongeza sehemu mpya ya CV (mfano Miradi) | `js/examples.js`, `js/models.js` (`cvModel`), fomu kwenye `index.html`, na lebo kwenye `js/i18n.js` |
| Kuongeza lugha mpya | `js/i18n.js` (`T` na `DOC`), `js/config.js` (`MONTHS`), kitufe cha lugha kwenye `index.html` |
| Kubadilisha rangi au muonekano | `css/base.css` (tokens) |

## Hali ya sasa

- Ukurasa ukifunguliwa ndani ya Claude, kitufe cha PDF kinatumia ruhusa ya kupakua ya Claude. Kwenye hosting yako mwenyewe, jsPDF huhifadhi faili moja kwa moja.
- Data huhifadhiwa kwa kila browser na kila kifaa. Haihamishwi kati ya vifaa.
