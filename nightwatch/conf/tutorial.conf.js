/* eslint-disable */
config = require('./nightwatch.conf');

config.nightwatchConfig['src_folders'] = ["nightwatch/tests/tutorial"];

config.initConf();

module.exports = config.nightwatchConfig;