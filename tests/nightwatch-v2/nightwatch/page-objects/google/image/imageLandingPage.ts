import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const commands = {
};

const imageLandingPage: PageObjectModel = {
  url(this: EnhancedPageObject) {
    return 'https://google.com/imghp'
  },
  commands: [commands],
  elements: {
    searchBar: '.gLFyf'
  },
};

export default imageLandingPage;

export interface ImageLandingPage
  extends EnhancedPageObject<typeof commands,
  typeof imageLandingPage.elements> { }