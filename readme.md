# Veðurspá með gagnvirku korti

## Lýsing

Þetta verkefni er veðurforrit sem sýnir veðurgögn fyrir alla staði. Notendur geta valið fyrirfram skilgreinda staði, leitað að hvaða stað sem er með nafni, eða smellt á gagnvirkt kort til að fá veðurupplýsingar fyrir þann stað. Forritið notar nútíma JavaScript tól og Web API til að veita gagnvirka notendaupplifun.

## JavaScript tól

Verkefnið notar „nútímalegt“ JavaScript tól, Vite, til að stjórna uppsetningarferlinu og hámarka þróunarhraða. 

### Notuð tól og uppsetning þeirra:

- **Build framework**: 
  - **Vite**: Vite er háhraða frontend byggingarverkfæri. Það er sett upp með `npm install` og býður upp á hraða þróunarferli með skipuninni `npm run dev` og framleiðslugerð með `npm run build`.

- **Uppbygging á fyrri verkefnum**:
  - Þetta veðurforrit heldur áfram með virkni frá fyrri verkefnum, eins og verkefni 9, með nánari veðurspá og kortasamskipti, sem nú notar Leaflet.js til að bæta við gagnvirkni.

## Skipanir

- **`npm run dev`**: Ræsir þróunarþjóninn.
- **`npm run build`**: Byggir verkefnið fyrir framleiðslu.
- **`npm run lint`**: Keyrir bæði ESLint og Stylelint til að athuga hvort kóðinn sé réttur.
- **`npm run lint:js`**: Keyrir ESLint á JavaScript skrár.
- **`npm run lint:css`**: Keyrir Stylelint á CSS skrár.

## Notuð Web API

- **Open Meteo API**: Veitir veðurgögn fyrir hvaða stað sem er.
- **Geolocation API**: Nær í staðsetningu notanda með GPS.
- **OpenStreetMap Nominatim API**: Notað til að umbreyta staðarnöfnum í hnit.
- **Leaflet.js**: Sýnir gagnvirk kort og styður við kortasamskipti.

## Útgáfa

Forritið er keyrt á Netlify og er aðgengilegt á eftirfarandi slóð: [Setjið inn Netlify slóð hér].

## Utanaðkomandi hjálp
Gervigreindin ChatGPT var notuð í þessu verkefni til að einfalda störf og gera þau fljótlegri. ChatGPT var nánar tiltekið notað til þess að skrifa upp readme.md, setja upp einfalt útlit í css og hjálpa til með föll þegar þess þurfti. 
