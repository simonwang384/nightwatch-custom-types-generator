import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const commands = {
};

const landingPage: PageObjectModel = {
  url(this: EnhancedPageObject) {
    return 'https://google.com'
  },
  commands: [commands],
  elements: {
    searchBar: '.gLFyf'
  },
};

export default landingPage;

export interface LandingPage
  extends EnhancedPageObject<typeof commands,
  typeof landingPage.elements> { }