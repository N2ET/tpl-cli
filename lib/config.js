const R_path = require('path')
const R_home = require('user-home')

const CLIENT = 'tpl-cli'

let config = {
  client: CLIENT,
  loggerPrefix: '·',

  repos: {
    default: {
      type: 'github',
      owner: 'vuejs-templates',
      project: '',
      protocol: 'https',
      domain: 'github.com',
      apiDomain: 'api.github.com'
    }
  },
  repo: 'default',

  templateDir: R_path.join(R_home, '.tpl-templates'),
  templatePath: '',
  fullTemplatePath: '',

  requestConfig: {
    headers: {
      'User-Agent': CLIENT
    }
  },

  debug: false

}

config.repo = config.repos[config.repo]

module.exports = config;

module.exports.update = function (override) {
  return extend(config, override);
};

module.exports.parse = function (program) {
  let args = program.args
  let repo = config.repo
  let owner = args[0]
  let project = args[1]

  config.debug = program.debug
  config.workingDir = process.cwd()
  config.relativeWorkingDir = R_path.relative('../', config.workingDir)

  if (args.length === 1) {
    owner = config.repo.owner
    project = args[0]
  }

  project = parseProjectInfo(project)

  repo.owner = owner || repo.owner
  repo.project = project.project
  config.templatePath = project.path

  config.fullTemplatePath = R_path.join(
    config.templateDir,
    repo.owner,
    repo.project,
    config.templatePath
  )

  config.templateDestDir = config.workingDir
};

function extend(target, override) {
  Object.keys(override).forEach(function (key) {
    // shallow copy
    target[key] = override[key];
  });
  return target;
}

function parseProjectInfo(project) {
  let info = (project || '').match('([^\/]+)\/?(.+)?') || []
  return {
    project: info[1] || '',
    path: info[2] || ''
  }
}