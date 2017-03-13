const R_request = require('request')

const R_config = require('./config')
const R_logger = require('./logger')

exports.report = function(meta, done) {

    if(!R_config.reportUrl) {
        R_logger.warning('config.reportUrl is not valid')
        done(new Error('invalid report url'))
        return
    }

    R_request({
        url: R_config.reportUrl,
        headers: R_config.requestConfig.headers,
        formData: {
            user: R_config.gitUser,
            owner: R_config.repo.owner,
            project: R_config.repo.project,
            template: R_config.templatePath
        }
    }, function(err) {
        if(err) {
            R_logger.warning(err.message)
        }

        done(err)
    })

}
