const R_chalk = require('chalk');

const R_config = require('./config');

const LOG_PREFIX = '[' + R_config.client + '] ';
const SHOW_PREFIX = true;

exports.log = function(msg, prefix) { 
    msg = (SHOW_PREFIX && prefix === false? '': R_chalk.white(LOG_PREFIX)) + msg;
    console.log(msg);
};

exports.debug = function(msg, prefix) {
    if(!R_config.debug) {
        return;
    }

    msg = (SHOW_PREFIX && prefix === false? '': R_chalk.blue(LOG_PREFIX)) + msg;
    console.log(msg);
};

exports.success = function(msg, prefix) {
    msg = (SHOW_PREFIX && prefix === false? '': R_chalk.green(LOG_PREFIX)) + msg;
    console.log(msg);
};

exports.warning = function(msg, prefix) {
    msg = (SHOW_PREFIX && prefix === false? '': R_chalk.yellow(LOG_PREFIX)) + msg;
    console.log(msg);
};

exports.error = function(msg, prefix) {
    msg = (SHOW_PREFIX && prefix === false? '': R_chalk.red(LOG_PREFIX)) + msg;
    console.log(msg);
};

exports.fatal = function() {
    exports.error.apply(this, arguments);
    process.exit(1);
};

