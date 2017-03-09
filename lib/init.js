const R_path = require('path')
const R_fs = require('fs')

const R_metalsmith = require('metalsmith')

const R_handlebars = require('./handlebars')
const R_ask = require('./ask')
const R_logger = require('./logger')
const R_config = require('./config')
const R_util = require('./util')


exports.init = function(src, dest, done) {
    src = src || R_config.fullTemplatePath
    dest = dest || R_config.templateDestDir
    R_logger.debug('generate src: ', src)
    R_logger.debug('generate dest: ', dest)

    let meta = exports.getMeta(src)

    R_metalsmith(src)
        //.use(askQuestions(meta))
        .use(filterFiles(meta))
        //.use(render(meta))
        .clean(false)
        .source('.')
        .destination(dest)
        .build(function(err, files) {
         
        })

}

exports.getMeta = function(dir) {
    let meta = {}
    let path = R_path.join(dir, 'meta.js')
    try {
        if(R_fs.existsSync(path)) {
            meta = require(require.resolve(path))
        } else {
            path = R_path.join(dir, 'meta.json')
            meta = require(path)
        }   
    } catch(e) {
        R_logger.warning('meta file missing or file is invalid!')
    }

    if(meta.helpers) {
        Object.keys(meta.helpers).forEach(function(key) {
            R_handlebars.registerHelper(key, meta.helpers[key])
        })
    }

    //R_logger.debug('getMeta meta: ', meta)

    return meta || {}
}

function askQuestions(meta) {
    return function(files, metalsmith, done) {
        //R_logger.debug('askQuestions meta: ', meta.prompts)
        //R_logger.debug('askQuestions files: ', files)
        R_ask(meta.prompts, metalsmith.metadata(), done)    
    }
}

function filterFiles(meta) {
    return function(files, metalsmith, done) {
        let filters = meta.filters
        let filtered = []
        if(!filters) {
            return done()
        } 
        
        let fileNames = Object.keys(files)

console.log('fileNames: ', fileNames)
console.log('filters: ', filters)

        Object.keys(filters).forEach(function(glob) {

R_logger.log('filters glob: ', glob)

            fileNames.forEach(function(fileName) {

                console.log('----file name: ', fileName)

                if(R_minimatch(fileName, glob, {dot: true})) {
                    let condition = filters[glob]

R_logger.debug('condition: ', condition)

                    if(!R_util.evaluate(condition, meta)) {
                        filtered.push(fileName)
                        delete files[fileName]
                    }
                }
            })
        })

        console.log('filterFiles: ', filtered)
        done()
    }
}

function render(meta) {
    return function() {

    }
}