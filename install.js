const R_config = require('./lib/config')

if(true ||!R_config.getGitUser()) {
    console.warn('--------------------------------------------------------------')
    console.warn('for involving in template development please install git first')
    console.warn('--------------------------------------------------------------')
    console.log()
}