R_logger = require('./logger')

exports.evaluate = function (exp, data) {
    /* eslint-disable no-new-func */
    let fn
    if (typeof(exp) === 'function') {
        fn = exp
    } else {
        fn = new Function('data', 'with (data) { return ' + exp + '}')
    }

    try {
        return fn(data)
    } catch (e) {
        R_logger.error('Error when evaluating filter condition: ' + exp)
    }
}