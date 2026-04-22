# Retningslinjer for bloggartikkel-gjennomgang

Dette dokumentet er en sjekkliste for å gjennomgå bloggartikler i `src/content/blog/`, spesielt artikler importert automatisk fra Soro via `.github/workflows/soro-rss-sync.yml`. Bruk listen før artikler merges til master.

> **Merk:** Dette er et arbeidsdokument, ikke en publisert artikkel. Filen er ekskludert fra bloggens content collection via glob-mønster i `src/content.config.ts`.

## Faktasjekk mot produkt og regelverk

### Per-båt-rapportering er feil

Fiskeridirektoratet sin API (swagger: `turistfiskeapi-test.fiskeridir.no/swagger/v1/swagger.json`) har ingen felt for båt/fartøy. Rapporteringen er strukturert slik:

```
Company → Camp (hytte) → CompanyStay (opphold) → Trip → Catch
```

- Bruk "per opphold" eller "per fiskeperiode", ikke "per båt" eller "per fartøy".
- FAQ-en på `src/pages/index.astro:800` bekrefter: all fangst rapporteres samlet for virksomheten, uavhengig av båt eller hytte.
- Båt-referanser som farge ("flere båter ute samtidig" som illustrasjon på manuelt kaos) er greit — det er kun konkrete påstander om at rapportering må knyttes til bestemt båt som er feil.

### Utførselsdokumentasjon er ikke daglig gated

- Utførselsdokumentasjon utstedes når utleier godkjenner hele fiskeperioden etter at gjesten har avsluttet den.
- Daglig rapportering er påkrevd av regelverket, men det er periode-lukking + godkjenning som utløser dokumentet.
- Ikke skriv som om hver enkelt dagsrapport direkte låser opp utførselsdokumentet.

### Gjestens tilgangsflyt

Faktisk flyt:
1. Utleier deler subdomene-lenke eller QR-kode (se `/qr`)
2. Turisten oppretter fiskeperiode og oppgir e-post
3. Turisten får unik lenke til dashbord via e-post
4. Turisten registrerer fangst via dashbordet

- Ikke beskriv som ren "åpne en lenke" uten e-post-steget.
- "Passordløs lenke" er upresist.

### Regelverksdatoer krever kilde

- Daglig rapporteringsplikt stammer fra forskrift 2017-07-05-1141 (2017).
- Påstander som "Fra 1. august 2025..." krever dokumentert kilde, ellers reformuler til "Regelverket krever..." uten datoanker.
- Soro-sjekklisten i `.github/workflows/soro-rss-sync.yml:67` flagger dette eksplisitt.

### Generelle statistikker må dempes eller tilskrives

Påstander som "over halvparten av gjestene er tyskspråklige" er ikke verifiserbare på tvers av alle utleiere. Bruk "en stor andel" eller knytt til spesifikk aktør.

## CTA og URL-konvensjoner

### Kanonisk registreringsadresse

**`https://eksportfiske.no/registrer/`** er kanonisk URL for CTA-er i bloggartikler og på bloggsider.

- Både Soro-sjekklisten (`.github/workflows/soro-rss-sync.yml`) og blog-templaten (`src/pages/blogg/[...slug].astro`) skal peke til `/registrer/`.
- `/registrer/ny-kunde/` brukes ikke — bruk alltid `/registrer/`.

### "Gratis" er misvisende alene

- Produktet har én måned gratis prøveperiode (`src/pages/index.astro:725`), ikke permanent gratis.
- Skriv "gratis prøveperiode" eller "gratis i én måned", aldri bare "gratis".

### Ankertekst må matche destinasjonen

- Ikke fest lenker på tangentiale ord ("regulert verdikjede" → registreringsside gir ingen mening).
- Enten bruk et naturlig verb/uttrykk, eller la ordet stå som ren tekst og plasser CTA-en et annet sted.

### Ikke legg til egen CTA-seksjon i artikler

Bloggmalen (`src/pages/blogg/[...slug].astro`) rendrer automatisk en "Klar til å komme i gang?"-seksjon med knapper til `/registrer/` og `/registrering` på alle bloggsider. Egne `## Kom i gang...`-seksjoner i artikkelen blir derfor dobbel CTA — ikke legg dem til.

Brand-omtaler i brødteksten kan fortsatt lenkes der det flyter naturlig (f.eks. "det er akkurat det [eksportfiske.no](https://eksportfiske.no/registrer/) er bygget for"). Det er den avsluttende malsseksjonen som er konverteringsankeret.

## Redaksjonell konsistens

- **Varenavn:** Bruk alltid `eksportfiske.no` med liten e. Ikke `Eksportfiske.no`.
- **Stemme:** Første person, kollektiv ("Vi har selv stått i dette", "Vi mener"). Skribent håndhever denne stilen.
- **Kryssreferanser:** De tre eksisterende artiklene bør referere til hverandre på naturlige tematiske punkter. Bruk interne stier (`/blogg/<slug>/`), ikke absolutte URL-er.

## Gjennomgangsprosess

- Soro RSS-importer kommer som PR-er med en sjekkliste i PR-body (se `.github/workflows/soro-rss-sync.yml:61-69`). Verifiser hver avkrysningsboks før merge.
- Delegér innholdsgjennomgang til Skribent, build-validering til DeployBot, SEO til Søk. Skipper koordinerer.
