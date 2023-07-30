import { NightwatchBrowser } from 'nightwatch'
import { ImageLandingPage, LandingPage } from '../page-objects'

describe('Google', function () {
  let landingPage: LandingPage
  let imageLandingPage: ImageLandingPage

  before(function (browser: NightwatchBrowser) {
    landingPage = browser.page.google.landingPage()
    imageLandingPage = browser.page.google.image.imageLandingPage()
  })

  it('should find landing search bar', function () {
    landingPage.navigate()
    landingPage.expect.element('@searchBar').to.be.visible
  })

  it('should find image landing search bar', function () {
    imageLandingPage.navigate()
    imageLandingPage.expect.element('@searchBar').to.be.visible
  })
})