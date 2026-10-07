const { auth, sheets } = require('@googleapis/sheets')

// Saves each contact as a new row in a Google Sheet, using a Google Cloud
// service account. A service account signs in on its own with a key, so it
// works on Render - unlike the OAuth "paste the code into the terminal" flow.
//
// Needs three environment variables (see README.md for how to get them):
//   GOOGLE_SHEET_ID              the long id in the sheet's URL
//   GOOGLE_CLIENT_EMAIL          the service account's email
//   GOOGLE_PRIVATE_KEY           the service account's private key
// and the sheet must be shared with GOOGLE_CLIENT_EMAIL as an Editor.

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const RANGE = 'Sheet1!A:D' // Timestamp | First name | Last name | Email

function isConfigured() {
  return Boolean(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
}

let client
function getClient() {
  if (!client) {
    const googleAuth = new auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // keys pasted into a dashboard often have literal "\n" instead of line breaks
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: SCOPES,
    })
    client = sheets({ version: 'v4', auth: googleAuth })
  }
  return client
}

async function saveContact(contact) {
  if (!isConfigured()) {
    // lets the site run locally before Google is set up - but never in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Google Sheets is not configured')
    }
    console.warn('Google Sheets is not configured, so this contact was not saved:', contact)
    return
  }

  // append adds a row after the last one with data, so there's no need to
  // look up how many rows the sheet already has first
  await getClient().spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW', // store exactly what was typed (no formulas)
    requestBody: {
      values: [[new Date().toISOString(), contact.firstName, contact.lastName, contact.email]],
    },
  })
}

module.exports = { saveContact, isConfigured }
