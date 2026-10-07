const { expect } = require('chai')
const request = require('supertest')
const createApp = require('../app')
const { readContactForm } = require('../routes/pages')
const { projects, site } = require('../data/site')

// A stand-in for Google Sheets that records what it was asked to save.
function fakeSheets({ fail = false } = {}) {
  const saved = []
  const saveContact = async (contact) => {
    if (fail) throw new Error('Sheets is down')
    saved.push(contact)
  }
  return { saved, saveContact }
}

const sarah = { firstName: 'Sarah', lastName: 'Person', email: 'sarah_person@work.com' }

describe('Pages', () => {
  const app = createApp({ logRequests: false, saveContact: fakeSheets().saveContact })

  it('GET / shows my name, a GitHub link and links to projects', async () => {
    const res = await request(app).get('/').expect(200)
    expect(res.text).to.include(site.name)
    expect(res.text).to.include(site.github)
    expect(res.text).to.include('href="/portfolio"')
    expect(res.text).to.include(projects.find((p) => p.featured).title)
  })

  it('GET /portfolio lists every project from the data file', async () => {
    const res = await request(app).get('/portfolio').expect(200)
    for (const project of projects) {
      expect(res.text).to.include(`<h3>${project.title}</h3>`)
      if (project.link) expect(res.text).to.include(project.link)
    }
  })

  it('GET /contact shows a form with first name, last name and email', async () => {
    const res = await request(app).get('/contact').expect(200)
    expect(res.text).to.include('action="/thanks"')
    expect(res.text).to.match(/method="POST"/i)
    for (const field of ['firstName', 'lastName', 'email']) {
      expect(res.text).to.include(`name="${field}"`)
    }
  })

  it('every page shares the header and footer partials', async () => {
    for (const path of ['/', '/portfolio', '/contact']) {
      const res = await request(app).get(path)
      expect(res.text).to.include('class="header"')
      expect(res.text).to.include('class="footer"')
    }
  })

  it('marks the current page in the navigation', async () => {
    const res = await request(app).get('/portfolio')
    expect(res.text).to.match(/href="\/portfolio"\s+aria-current="page"/)
  })

  it('unknown pages get a 404 page', async () => {
    const res = await request(app).get('/nope').expect(404)
    expect(res.text).to.include("That page doesn't exist.")
  })
})

describe('Contact form', () => {
  it('saves the contact and thanks them by name', async () => {
    const sheets = fakeSheets()
    const app = createApp({ logRequests: false, saveContact: sheets.saveContact })

    const res = await request(app).post('/thanks').type('form').send(sarah).expect(200)

    expect(res.text).to.include('Thank you, Sarah Person!')
    expect(res.text).to.include('sarah_person@work.com')
    expect(sheets.saved).to.deep.equal([sarah])
  })

  it('trims extra spaces before saving', async () => {
    const sheets = fakeSheets()
    const app = createApp({ logRequests: false, saveContact: sheets.saveContact })

    await request(app).post('/thanks').type('form')
      .send({ firstName: '  Sarah ', lastName: ' Person', email: ' sarah_person@work.com  ' })
      .expect(200)

    expect(sheets.saved[0]).to.deep.equal(sarah)
  })

  it('keeps them on the form with messages when fields are missing or invalid', async () => {
    const sheets = fakeSheets()
    const app = createApp({ logRequests: false, saveContact: sheets.saveContact })

    const res = await request(app).post('/thanks').type('form')
      .send({ firstName: 'Sarah', lastName: '', email: 'not-an-email' })
      .expect(400)

    expect(res.text).to.include('Enter your last name.')
    expect(res.text).to.include('Enter an email address like name@example.com.')
    expect(res.text).to.include('value="Sarah"') // what they typed is kept
    expect(sheets.saved).to.have.length(0)
  })

  it('does not thank them if saving fails, and shows a retry message', async () => {
    const app = createApp({ logRequests: false, saveContact: fakeSheets({ fail: true }).saveContact })
    const originalError = console.error
    console.error = () => {} // keep the expected error out of the test output

    try {
      const res = await request(app).post('/thanks').type('form').send(sarah).expect(502)
      expect(res.text).to.include("Your message didn&#39;t go through.")
      expect(res.text).to.not.include('Thank you, Sarah')
      expect(res.text).to.include('value="sarah_person@work.com"')
    } finally {
      console.error = originalError
    }
  })

  it('escapes HTML in names so it cannot be injected into the page', async () => {
    const app = createApp({ logRequests: false, saveContact: fakeSheets().saveContact })

    const res = await request(app).post('/thanks').type('form')
      .send({ ...sarah, firstName: '<script>alert(1)</script>' })
      .expect(200)

    expect(res.text).to.not.include('<script>alert(1)</script>')
    expect(res.text).to.include('&lt;script&gt;')
  })
})

describe('readContactForm', () => {
  it('rejects values over 100 characters', () => {
    const { errors } = readContactForm({ ...sarah, lastName: 'x'.repeat(101) })
    expect(errors.lastName).to.include('100 characters')
  })

  it('accepts a valid contact', () => {
    const { errors } = readContactForm(sarah)
    expect(errors).to.deep.equal({})
  })
})
