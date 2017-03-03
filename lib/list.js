const R_path = require('path')

const R_metalsmith = require('metalsmith')
const R_request = require('request')
const R_chalk = require('chalk')

const R_logger = require('./logger')
const R_config = require('./config')

exports.getAllProjectsListUrl = function () {
    let repo = R_config.repo
    return `${repo.protocol}://${repo.apiDomain}/users/${repo.owner}/repos`
}

exports.listAllProjects = function () {
    let url = exports.getAllProjectsListUrl()
    R_logger.debug('listAllTopProjects: ', url)

    R_request({
        url: url,
        headers: R_config.requestConfig.headers
    }, function (err, res, body) {
        if (err) {
            R_logger.fatal(err)
        }

        let requestBody = JSON.parse(body)
        if (Array.isArray(requestBody)) {
            console.log('Available template projects:')
            console.log()
            requestBody.forEach(function (repo) {
                console.log(
                    ' ' + R_chalk.yellow('★') +
                    ' ' + repo.name +
                    R_chalk.gray(' - ' + repo.description))
            })
            return
        }

        R_logger.error(requestBody.message)
    })
}

exports.listProjectTemplates = function () {
    let repo = R_config.repo
    R_logger.debug('listProjectTemplates: ', R_config.fullTemplatePath)
    console.log('Available project templates:')
    console.log(
        ' ' + R_chalk.yellow('★') +
        ' ' + R_chalk.blue(repo.project)
    )

    R_metalsmith(R_config.fullTemplatePath)
        .use(filterMetaFiles)
        .source('.')
        .process(function (err, files) {
            if (err) {
                R_logger.error('no available templates, please update project first. path: ', err.path);
            }
        })
}

function filterMetaFiles(files, R_metalsmith, done) {
    let metaData
    Object.keys(files).forEach(function (file) {
        if (file.match(/meta\.(js|json)$/)) {
            R_logger.debug('match: ', file)

            // perf!
            try {
                metaData = require(
                    R_path.join(R_config.fullTemplatePath, file)
                )
                //R_logger.debug(metaData)
                console.log(
                    ' ',
                    metaData.name || R_chalk.yellow('[no name]'),
                    R_chalk.gray(' - ' + (filePathToTemplate(file) || '[root]'))
                )
            } catch (e) {
                console.error(e)
            }
        }
    });
    done()
}

function filePathToTemplate(path) {
    path = path || '';
    return path.replace(/\\/g, '/').replace(/\/?[^\/]+\..+$/, '')
}