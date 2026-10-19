# Mwongozo wa SEO na Google Search Console

Tovuti: <https://johnson10-gif.github.io/cv-na-barua/>

## Vilivyowekwa kwenye mradi

- `index.html`: title, maelezo ya ukurasa, canonical URL, robots directive, Open Graph/Twitter metadata na JSON-LD ya `WebApplication`.
- `robots.txt`: inaruhusu crawlers kutembelea tovuti na inaelekeza sitemap.
- `sitemap.xml`: inatangaza URL kuu ya tovuti.
- `.github/workflows/pages.yml`: inachapisha faili hizi pamoja na app kila unapopush kwenye `main` au `master`.

## Hatua za kusajili tovuti Google

1. Hakikisha commit ya mwisho imefika GitHub. Fungua kichupo cha **Actions** kwenye repository `Johnson10-gif/cv-na-barua` na uhakikishe workflow ya **Deploy to GitHub Pages** imekamilika kwa hali ya `Success`.
2. Fungua [Google Search Console](https://search.google.com/search-console/) na uingie kwa akaunti ya Google unayotaka kusimamia tovuti.
3. Bonyeza **Add property**. Chagua **URL prefix**, kisha weka `https://johnson10-gif.github.io/cv-na-barua/` kama ilivyo.
4. Chagua njia ya uthibitishaji ya **HTML tag**. Google itatoa tag yenye `name="google-site-verification"` na token ya kipekee.
5. Nakili tag hiyo na uiongeze ndani ya `<head>` katika `index.html`, karibu na meta tags zilizopo. Usitumie token ya mfano; tumia ile uliyopewa na akaunti yako ya Search Console.
6. Commit na push mabadiliko hayo kwenda `main`, kisha subiri GitHub Actions imalize deployment.
7. Rudi Search Console na ubonyeze **Verify**. Ikiwa haijafaulu, hakikisha ukurasa wa live una tag hiyo kwenye source ya HTML, kisha subiri dakika chache ujaribu tena.
8. Kwenye Search Console, fungua **Sitemaps**, andika `sitemap.xml` kwenye sehemu ya kuongeza sitemap, kisha bonyeza **Submit**. Anwani kamili ni `https://johnson10-gif.github.io/cv-na-barua/sitemap.xml`.
9. Fungua **URL inspection**, weka `https://johnson10-gif.github.io/cv-na-barua/`, bonyeza **Test live URL**, halafu **Request indexing** ikiwa Google inaweza kuifikia.
10. Angalia ripoti za **Pages/Indexing** na **Sitemaps** baada ya siku kadhaa. Search Console inaweza kuonyesha changamoto, lakini haiahidi tarehe ya kuingizwa kwenye matokeo.

## Kila unapobadilisha tovuti

1. Fanya commit na push kwenda `main`.
2. Hakikisha workflow ya GitHub Actions imefanikiwa.
3. Kwa mabadiliko ya maudhui muhimu, tumia **URL inspection → Request indexing** tena. Si lazima kuwasilisha sitemap upya kila push kwa kuwa URL kuu haijabadilika.

## Mambo muhimu kuhusu SEO

- Kuongeza sitemap kwenye Search Console ni ombi la kutambaa, si dhamana ya kuonekana au kupewa nafasi fulani. Google huamua yenyewe kama na lini ita-index ukurasa.
- Site hii kwa sasa ni app ya ukurasa mmoja. Ili iwe rahisi kupatikana kwa utafutaji wa maneno maalum, ongeza maudhui ya msaada yaliyoandikwa vizuri na yanayoonekana kwenye ukurasa, kwa mfano mwongozo wa kutengeneza CV, kuandika barua ya maombi, na FAQ ya Kiswahili/English. Metadata pekee haiwezi kuchukua nafasi ya maudhui yenye manufaa.
- Tumia maneno ya utafutaji kwa kawaida kwenye title, heading na maelezo; usijaze maneno yanayojirudia bila sababu.
- Hakikisha tovuti inafunguka kwenye simu, HTTPS inafanya kazi, links hazivunjiki, na maandishi yanaeleweka bila kutegemea picha pekee.
- Google Search Console itahitaji akaunti yako kuthibitisha umiliki. Usichapishe token ya uthibitishaji kwenye mazungumzo; ongeza tag uliyopewa moja kwa moja kwenye `index.html`.
