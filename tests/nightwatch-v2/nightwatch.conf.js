// Refer to the online docs for more details:
// https://nightwatchjs.org/gettingstarted/configuration/
//

//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ['nightwatch/tests'],

  // See https://nightwatchjs.org/guide/concepts/page-object-model.html
  page_objects_path: ['nightwatch/page-objects', 'nightwatch/pageObjects'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
  custom_commands_path: ['nightwatch/commands'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
  custom_assertions_path: [],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: ['@nightwatch/apitesting', 'nightwatch-saucelabs-endsauce'],
  
  // See https://nightwatchjs.org/guide/concepts/test-globals.html
  globals_path: '',
  
  webdriver: {},

  test_workers: {
    enabled: true
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'https://google.com',

      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },

      desiredCapabilities: {
        browserName: 'chrome'
      },
      
      webdriver: {
        start_process: true,
        server_path: ''
      },
    },
    
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        'goog:chromeOptions': {
          w3c: true,
          args: [
          ],
        }
      },

      webdriver: {
        start_process: true,
        server_path: '',
      }
    },

    chrome_ci: {
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        'goog:chromeOptions': {
          w3c: true,
          args: [
            'no-sandbox',
            'ignore-certificate-errors',
            'allow-insecure-localhost',
            'headless'
          ],
        }
      },

      webdriver: {
        start_process: true,
        server_path: '',
      }
    }
  },
};
