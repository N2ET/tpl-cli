const R_chalk = require('chalk');

const R_config = require('./config');

const LOG_PREFIX = '[' + R_config.client + '] ';

exports.log = function() { 
    console.log(
        R_chalk.white(LOG_PREFIX),
        R_chalk.white(
            format.apply(this, arguments)
        )
    );
};

exports.debug = function() {
    if(!R_config.debug) {
        return;
    }

    console.log(
        R_chalk.blue(LOG_PREFIX),
        R_chalk.blue(
            format.apply(this, arguments)
        )
    );
};

exports.success = function() {
    console.log(
        R_chalk.green(LOG_PREFIX),
        R_chalk.green(
            format.apply(this, arguments)
        )
    );
};

exports.warning = function() {
    console.log(
        R_chalk.yellow(LOG_PREFIX),
        R_chalk.yellow(
            format.apply(this, arguments)
        )
    );
};

exports.error = function() {
    console.log(
        R_chalk.red(LOG_PREFIX),
        R_chalk.red(
            format.apply(this, arguments)
        )
    );
};

exports.fatal = function() {
    exports.error.apply(this, arguments);
    process.exit(1);
};

function format() {
    var ret = [];
    [].forEach.call(arguments, function(item) {
        if(typeof(item) === 'object') {
            ret.push('\n');
            ret.push(JSON.stringify(item));
            return;
        }
        ret.push(item);
    });
    return ret.join('');
}