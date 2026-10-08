// Everything the pages show about you lives here. Edit this file to update
// the site - the templates in views/ read from it. (Copied from mccoding.dev.)

module.exports = {
  site: {
    name: 'Matthew Colvig',
    role: 'Software Developer',
    tagline: 'Air Force veteran building full-stack web apps — and games. Open to software roles.',
    location: 'Albuquerque, NM',
    email: 'matthew@mccoding.dev',
    github: 'https://github.com/13Flames',
    linkedin: 'https://www.linkedin.com/in/matthew-colvig/',
    website: 'https://mccoding.dev'
  },
  projects: [
    {
      title: 'VSTDA',
      description: 'A to-do app with Google sign-in, where each user has their own tasks synced in real time through Firestore. Tasks have priorities and filters, and there is a light/dark theme toggle.',
      tags: [
        'React',
        'Firebase',
        'Firestore'
      ],
      link: 'https://vstda-5c058.web.app/',
      repo: 'https://github.com/13Flames/VSTDA'
    },
    {
      title: 'VSTDA API',
      description: 'A REST API for to-do items with full CRUD routes, input validation and sanitization, and error logging to disk.',
      tags: [
        'Node.js',
        'Express',
        'REST'
      ],
      link: '',
      repo: 'https://github.com/13Flames/VSTDA-API'
    },
    {
      title: 'Change Calculator',
      description: 'Works out the change owed on a purchase, broken down into bills and coins. Calculates in cents to avoid floating point rounding errors, and shows how much is still due if not enough was paid.',
      tags: [
        'React',
        'Vite'
      ],
      link: 'https://change-calculator-2.vercel.app/',
      repo: 'https://github.com/13Flames/Change-Calculator-2'
    },
    {
      title: 'Tower Defender',
      description: 'A work in progress game where you build a maze to defend against incoming enemies. Classes, leveling and monsters are built from real D&D 5e SRD data, with an online Firebase leaderboard and a Windows desktop build via Electron.',
      tags: [
        'React',
        'Vite',
        'Electron',
        'Firebase'
      ],
      link: 'https://tower-defense-six-ruby.vercel.app/',
      repo: '',
      featured: true
    },
    {
      title: 'San Diego Top Spots',
      description: 'A React app that fetches the top 30 places to see in San Diego from a remote API and links each one to its location on Google Maps.',
      tags: [
        'React',
        'Axios',
        'Vite'
      ],
      link: 'https://react-top-spots-five.vercel.app/',
      repo: 'https://github.com/13Flames/React-Top-Spots'
    },
    {
      title: 'Mortgage Calculator',
      description: 'Works out the monthly payment for a loan from its balance, interest rate and a 15- or 30-year term.',
      tags: [
        'React',
        'Vite'
      ],
      link: 'https://mortgage-calculator-beta-three.vercel.app/',
      repo: 'https://github.com/13Flames/Mortgage-Calculator'
    },
    {
      title: 'Express Server',
      description: 'An Express server that renders a list of San Diego top spots as HTML and serves the same data as JSON from a /data endpoint.',
      tags: [
        'Node.js',
        'Express'
      ],
      link: '',
      repo: 'https://github.com/13Flames/Express-Server'
    },
    {
      title: 'Log All The Things',
      description: 'Express middleware that logs every request (user agent, time, method, path and status) to a CSV file, with a /logs endpoint that returns the log as JSON.',
      tags: [
        'Node.js',
        'Express',
        'Middleware'
      ],
      link: '',
      repo: 'https://github.com/13Flames/Log-All-The-Things'
    },
    {
      title: 'Astro Weight Calculator',
      description: 'Enter your weight and pick a planet, the Moon or the Sun to see what you would weigh there. The dropdown is generated from the planet data in code.',
      tags: [
        'JavaScript',
        'HTML',
        'CSS'
      ],
      link: 'https://astro-weight-calculator-eta.vercel.app/',
      repo: 'https://github.com/13Flames/Astro-Weight-Calculator'
    },
    {
      title: 'Change Calculator (Vanilla JS)',
      description: 'The original plain JavaScript version of the change calculator, breaking change down into dollars, quarters, dimes, nickels and pennies.',
      tags: [
        'JavaScript',
        'HTML',
        'CSS'
      ],
      link: 'https://change-calculator-kappa.vercel.app/',
      repo: 'https://github.com/13Flames/Change-Calculator'
    },
    {
      title: 'San Diego Top Spots (jQuery)',
      description: 'The original jQuery version of Top Spots, loading places from a JSON file into a table with Google Maps links.',
      tags: [
        'jQuery',
        'JavaScript',
        'HTML'
      ],
      link: 'https://san-diego-top-spots-pi.vercel.app/',
      repo: 'https://github.com/13Flames/San-Diego-Top-Spots'
    }
  ]
}
