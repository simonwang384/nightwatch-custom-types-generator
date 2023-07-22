import { NightwatchBrowser } from 'nightwatch'
import { BingPage } from '../pageObjects'

describe('Bing', function () {
  let bing: BingPage

  before(function (browser: NightwatchBrowser) {
    bing = browser.page.bingPage()
  })

  it('should find search bar', function () {
    bing.navigate()
    bing.expect.element('@searchBar').to.be.visible
  })
})