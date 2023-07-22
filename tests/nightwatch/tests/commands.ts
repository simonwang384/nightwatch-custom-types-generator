import { NightwatchBrowser } from "nightwatch"

describe('Commands', function () {
  const baseUrl = 'https://restful-booker.herokuapp.com'

  afterEach(function(browser: NightwatchBrowser) {
    browser.endSauce()
  })
  
  it('should respond with code 201', async function () {
    await browser.supertest
      .request(baseUrl)
      .get('/ping')
      .disableTLSCerts()
      .expect(201)
  })
})