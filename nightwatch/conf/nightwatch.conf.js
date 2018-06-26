require('dotenv').config();

const config = {
  "nightwatchConfig": {
    "page_objects_path": "nightwatch/pageObjects",

    "selenium": {
      "start_process": false,
      "host": "hub-cloud.browserstack.com",
      "port": 80
    },

    "common_capabilities": {
      'browserstack.user': process.env.BROWSERSTACK_USERNAME,
      'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
      'browserstack.debug': true,
      'browserstack.local': true,
      'resolution': '1920x1080'
    },

    "test_settings": {
      "default": {},
      "chrome": {
        "desiredCapabilities": {
          "browser": "chrome",
          "browser_version": '67.0'
        }
      },
      "firefox": {
        "desiredCapabilities": {
          "browser": "firefox",
          "browser_version": '59.0'
        }
      },
      "safari": {
        "desiredCapabilities": {
          "browser": "safari",
          "browser_version": '11.1'
        }
      },
      "ie": {
        "desiredCapabilities": {
          "browser": "internet explorer",
          "browser_version": '11.0'
        }
      },
      "edge": {
        "desiredCapabilities": {
          "browser": 'Edge',
          "browser_version": '17.0',
        }
      },
      "iPhone7": {
        "desiredCapabilities": {
          'device': 'iPhone 7',
          'realMobile': 'true',
          'os_version': '10.3'
        }
      },
      "galaxyS8": {
        "desiredCapabilities": {
          'device': 'Samsung Galaxy S8',
          'realMobile': 'true',
          'os_version': '7.0'
        }
      },
      "pixel": {
        "desiredCapabilities": {
          'device': 'Google Pixel',
          'realMobile': 'true',
          'os_version': '7.1'
        }
      }
    }
  },

  /* eslint-disable */
  initConf() {
    // Code to copy seleniumhost/port into test settings
    for (const i in this.nightwatchConfig.test_settings) {
      const settings = this.nightwatchConfig.test_settings[i];
      settings['selenium_host'] = this.nightwatchConfig.selenium.host;
      settings['selenium_port'] = this.nightwatchConfig.selenium.port;
      settings['desiredCapabilities'] = settings['desiredCapabilities'] || {};
      for (let j in this.nightwatchConfig.common_capabilities) {
        settings['desiredCapabilities'][j] = settings['desiredCapabilities'][j] || this.nightwatchConfig.common_capabilities[j];
      }
    }
  }
}

module.exports = config;