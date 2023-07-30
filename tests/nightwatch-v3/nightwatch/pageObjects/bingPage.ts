import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const commands = {
};

const bingPage: PageObjectModel = {
  url(this: EnhancedPageObject) {
    return 'https://bing.com'
  },
  commands: [commands],
  elements: {
    searchBar: '#sb_form_q'
  },
};

export default bingPage;

export interface BingPage
  extends EnhancedPageObject<typeof commands,
  typeof bingPage.elements> { }