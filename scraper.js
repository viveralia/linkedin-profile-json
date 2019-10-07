const axios = require('axios')
const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const util = require('util')

// Change this 👇
const linkedInProfile = 'https://www.linkedin.com/in/vidaldom%C3%ADnguez/'

const config = {
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    Connection: 'keep-alive',
    Host: 'www.linkedin.com',
    Referer: 'http://linkedin.com',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
  }
}

const getHTML = async url => {
  const { data: html } = await axios.get(url, config)
  return html
}

const getData = async html => {
  const $ = cheerio.load(html)
  jsonframe($)
  const frame = {
    linkedIn: {
      name: '.top-card-layout__title',
      headline: '.top-card-layout__headline',
      location: '.top-card-layout__first-subline .top-card__subline-item:first-child',
      about: '.summary p',
      experience: {
        _s: '.result-card.experience-item',
        _d: [
          {
            position: 'h3',
            company: 'h4',
            date_range: {
              start: '.date-range__start-date',
              end: '.date-range__end-date'
            }
          }
        ]
      },
      education: {
        _s: '.education__list .result-card',
        _d: [
          {
            school: 'h3',
            studies: 'h4',
            date_range: {
              start: '.date-range__start-date',
              end: '.date-range__end-date'
            }
          }
        ]
      }
    }
  }
  const data = $('body').scrape(frame)
  return data
}

const go = async () => {
  const data = await getData(await getHTML(linkedInProfile))
  console.log(util.inspect(data, false, null, true))
}

go()
