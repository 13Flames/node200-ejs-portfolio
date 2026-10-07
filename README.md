# EJS Portfolio

A personal portfolio built with Express and EJS templates. Visitors can browse
my projects and send their contact details, which are saved straight to a
Google Sheet. The Thank You page greets them by name.

## Pages

| Route         | What it does                                                      |
| ------------- | ----------------------------------------------------------------- |
| `/`           | Home: intro, links to GitHub, featured project and highlights     |
| `/portfolio`  | Every project, rendered from `data/site.js`                        |
| `/contact`    | Contact form (first name, last name, email)                       |
| `POST /thanks`| Validates the form, saves it to Google Sheets, then thanks the contact by name |
| anything else | 404 page                                                          |

If a field is missing or the email looks wrong, the form is shown again with a
message under each field and the visitor's answers kept. If Google Sheets
can't be reached, the visitor stays on the form with a "try again" message -
they're only thanked once their details are actually saved.

## How it's built

```
server.js              starts the server
app.js                 builds the Express app (EJS, static files, form parsing, 404)
routes/pages.js        page routes (Express Router) and form validation
lib/sheets.js          saves a contact as a new row in Google Sheets
data/site.js           my details and projects - edit this to update the site
views/
  index.ejs, portfolio.ejs, contact.ejs, thanks.ejs, 404.ejs
  partials/            header, footer, project card, and the function-style headings
public/                styles.css and the tab icon
test/app.spec.js       Mocha + Chai + Supertest tests
.circleci/config.yml   runs the tests on every push
```

The header and footer are EJS partials, so no HTML is repeated between pages.
EJS escapes everything printed with `<%= %>`, so a name like
`<script>` shows as text instead of running.

## Running it locally

```bash
npm install
npm run dev     # http://localhost:3000, restarts when files change
npm test
```

Until Google Sheets is set up, the form still works locally: submitted
contacts are printed in the terminal instead of saved. (In production -
`NODE_ENV=production`, which Render sets - a missing setup is an error, so
contacts are never silently lost.)

## Connecting Google Sheets

This uses a Google Cloud **service account**: a robot account with its own key
that the server signs in with automatically. (The workshop's OAuth flow asks
you to paste a code into the terminal, which can't work on Render.)

1. **Create the sheet.** In Google Sheets, make a new spreadsheet. In row 1 of
   `Sheet1`, add the headings `Timestamp`, `First name`, `Last name`, `Email`.
   Copy the sheet's ID from its URL - the long part between `/d/` and `/edit`.
2. **Create a Google Cloud project** at <https://console.cloud.google.com>
   (any name), then go to **APIs & Services → Library**, search for
   **Google Sheets API** and click **Enable**.
3. **Create the service account.** Go to **IAM & Admin → Service Accounts →
   Create service account**. Give it a name (e.g. `portfolio-contact-form`)
   and click **Done** - it doesn't need any roles.
4. **Make a key.** Open the service account, go to **Keys → Add key → Create
   new key → JSON**. A `.json` file downloads. Keep it private - never commit
   it (`.gitignore` already blocks the usual names).
5. **Share the sheet** with the service account's email (it looks like
   `portfolio-contact-form@your-project.iam.gserviceaccount.com`), as an
   **Editor**.
6. **Add the settings.** Copy `.env.example` to `.env` and fill in:
   - `GOOGLE_SHEET_ID` - the ID from step 1
   - `GOOGLE_CLIENT_EMAIL` - `client_email` from the JSON key
   - `GOOGLE_PRIVATE_KEY` - `private_key` from the JSON key, in quotes, as one
     line with the `\n`s left in

Run `npm run dev`, submit the form, and a new row appears in the sheet.

## Deploying to Render

1. On <https://render.com>, click **New → Web Service** and connect this
   GitHub repo.
2. Settings: **Runtime** Node, **Build command** `npm install`, **Start
   command** `npm start`. The free instance type is fine.
3. Under **Environment**, add `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL` and
   `GOOGLE_PRIVATE_KEY` with the same values as your `.env`, plus
   `NODE_ENV` = `production`.
4. Click **Create Web Service**. Render redeploys on every push to `main`.

The free tier sleeps when idle, so the first visit after a while can take up
to a minute to load.

## Continuous integration (CircleCI)

`.circleci/config.yml` installs dependencies and runs `npm test` on every
push. To turn it on, sign in to <https://circleci.com> with GitHub, find this
repo under **Projects** and click **Set Up Project**, choosing the existing
config on the `main` branch.
