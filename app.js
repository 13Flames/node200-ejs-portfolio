const path = require('path')
const express = require('express')
const morgan = require('morgan')
const createPagesRouter = require('./routes/pages')
const { saveContact } = require('./lib/sheets')
const { site } = require('./data/site')

// Builds the Express app. `saveContact` can be swapped out (the tests pass a
// fake one) so nothing touches Google Sheets unless it's meant to.
function createApp(options = {}) {
  const app = express()

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  if (options.logRequests !== false) app.use(morgan('dev'))
  app.use(express.static(path.join(__dirname, 'public')))
  // HTML forms post url-encoded data (body-parser is built into Express now)
  app.use(express.urlencoded({ extended: false }))

  // available in every template, e.g. the header and footer partials
  app.locals.site = site
  app.locals.year = new Date().getFullYear()

  app.use('/', createPagesRouter({ saveContact: options.saveContact || saveContact }))

  // anything else
  app.use((req, res) => {
    res.status(404).render('404', { page: '404' })
  })

  return app
}

module.exports = createApp
