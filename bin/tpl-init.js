const R_program = require('commander')

const R_logger = require('../lib/logger')
const R_config = require('../lib/config')
const R_init = require('../lib/init')

R_program
  .usage('[owner] [project-name]')
  .option('--debug', 'log debug info')

R_program.parse(process.argv)

console.log()
process.on('exit', function () {
  console.log()
})

R_config.parse(R_program)
R_init.updateAndInit()
//R_init.init()
