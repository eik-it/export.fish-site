# IndexNow

The site implements the [IndexNow](https://www.indexnow.org/) protocol so Bing
(and participating search engines) get notified the moment new content is
deployed, instead of waiting for the next crawl.

## How it works

1. **Key file** — `public/24fe6003d5a54402911dd3abb4d27cb0.txt` is served at
   `https://eksportfiske.no/24fe6003d5a54402911dd3abb4d27cb0.txt`. Its body is
   the key itself. This proves we own the host.
2. **Post-deploy ping** — the `indexnow` job in
   `.github/workflows/deploy.yml` runs after a successful Pages deploy on
   pushes to `master`/`main`. It fetches `sitemap-0.xml`, builds an
   `urlList` payload, and `POST`s it to `https://api.indexnow.org/IndexNow`.

A 200 or 202 from IndexNow is success; the step is `continue-on-error: true`
so a transient ping failure never blocks a deploy.

## Rotating the key

If the key needs to be rotated:

1. Generate a new UUID v4 (without dashes): `uuidgen | tr -d '-' | tr 'A-Z' 'a-z'`.
2. Rename `public/<old>.txt` → `public/<new>.txt` and update the file body to
   the new key.
3. Update `INDEXNOW_KEY` in `.github/workflows/deploy.yml`.
4. Commit and deploy. IndexNow will pick up the new key on the next ping.

## References

- [IndexNow protocol](https://www.indexnow.org/documentation)
- [Bing announcement](https://blogs.bing.com/webmaster/october-2021/IndexNow-Instantly-Index-your-web-content-in-Search-Engines)
