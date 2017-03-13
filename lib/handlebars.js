const R_handlebars = require('handlebars')


R_handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
        ? opts.fn(this)
        : opts.inverse(this)
})

R_handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
        ? opts.inverse(this)
        : opts.fn(this)
})

module.exports = R_handlebars