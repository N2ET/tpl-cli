const R_path = require('path')
const R_home = require('user-home')

const CLIENT = 'tpl-cli'

let config = {
  client: CLIENT,

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

module.exports.update =  function(override) {
  return extend(config, override);
};

function extend(target, override) {
    Object.keys(override).forEach(function(key) {
        // shallow copy
        target[key] = override[key];
    });
    return target;
}