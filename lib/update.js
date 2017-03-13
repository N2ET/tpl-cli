const R_ora = require('ora');
const R_download = require('download-git-repo');

const R_logger = require('./logger');
const R_config = require('./config');

exports.getDownloadUrl = function(project) {
    let repo = R_config.repo;
    return `${repo.type}:${repo.owner}/${project || repo.project}`;
};

exports.update = function(project, callback) {
    let spinner = R_ora('downloading template ');
    let url = exports.getDownloadUrl(project);
    let templateDir = R_config.templateSavePath;

    R_logger.debug();
    R_logger.debug('download url: ', url);
    R_logger.debug('download dir: ', templateDir);

    spinner.start();
    R_download(
        url,
        templateDir,
        { clone: false },
        function(err) {
            spinner.stop();
            if(err) {
                R_logger.fatal('Failed to download repo ' + repo + ': ' + err.message.trim());
            }

            if(callback) {
                callback();
            }
        })
};