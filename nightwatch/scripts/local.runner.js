#!/usr/bin/env node
require('dotenv').config();
const Nightwatch = require('nightwatch');
const browserstack = require('browserstack-local');

try {
  process.mainModule.filename = "./node_modules/.bin/nightwatch"

  // Code to start browserstack local before start of test
  console.log("Connecting local");
  Nightwatch.bsLocal =new browserstack.Local();
  const { bsLocal } =  Nightwatch;
  bsLocal.start({ 'key': process.env.BROWSERSTACK_ACCESS_KEY }, (error) => {
    if (error) throw error;

    console.log('Connected. Now testing...');

    Nightwatch.cli((argv) => {
      Nightwatch.CliRunner(argv)
      .setup(null, () => {
          process.kill(bsLocal.pid);
      })
      .runTests(() => {
        process.kill(bsLocal.pid);
      });
    });
  });
}
catch (ex) {
  console.log('There was an error while starting the test runner:\n\n');
  process.stderr.write(`${ex.stack}\n`);
  process.exit(2);
}