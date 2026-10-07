const express = require('express')
const { projects } = require('../data/site')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LENGTH = 100

// Trims the submitted fields and returns { contact, errors }.
function readContactForm(body = {}) {
  const contact = {
    firstName: String(body.firstName || '').trim(),
    lastName: String(body.lastName || '').trim(),
    email: String(body.email || '').trim(),
  }

  const errors = {}
  if (!contact.firstName) errors.firstName = 'Enter your first name.'
  if (!contact.lastName) errors.lastName = 'Enter your last name.'
  if (!contact.email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(contact.email)) errors.email = 'Enter an email address like name@example.com.'

  for (const field of Object.keys(contact)) {
    if (contact[field].length > MAX_LENGTH) errors[field] = `Keep this under ${MAX_LENGTH} characters.`
  }

  return { contact, errors }
}

function createPagesRouter({ saveContact }) {
  const router = express.Router()
  const featured = projects.find((p) => p.featured)
  const highlights = projects.filter((p) => !p.featured && p.link).slice(0, 3)

  router.get('/', (req, res) => {
    res.render('index', { page: 'home', featured, highlights, total: projects.length })
  })

  router.get('/portfolio', (req, res) => {
    res.render('portfolio', { page: 'portfolio', projects })
  })

  router
    .route('/contact')
    .get((req, res) => {
      res.render('contact', { page: 'contact', contact: {}, errors: {}, formError: null })
    })

  // The form posts here. The contact is only thanked once it has been saved;
  // otherwise they stay on the form with a message and their answers kept.
  router.post('/thanks', async (req, res) => {
    const { contact, errors } = readContactForm(req.body)

    if (Object.keys(errors).length > 0) {
      return res.status(400).render('contact', { page: 'contact', contact, errors, formError: null })
    }

    try {
      await saveContact(contact)
    } catch (err) {
      console.error('Could not save contact:', err.message)
      return res.status(502).render('contact', {
        page: 'contact',
        contact,
        errors: {},
        formError: "Your message didn't go through. Please try again in a minute.",
      })
    }

    res.render('thanks', { page: 'thanks', contact })
  })

  return router
}

module.exports = createPagesRouter
module.exports.readContactForm = readContactForm
