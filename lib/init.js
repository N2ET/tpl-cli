const R_path = require('path')
const R_fs = require('fs')

const R_metalsmith = require('metalsmith')
const R_minimatch = require('minimatch')

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

    return meta || {}
}

function askQuestions(meta) {
    return function(files, metalsmith, done) {
        R_ask(meta.prompts, metalsmith.metadata(), done)    
    }
}

function filterFiles(meta) {
    return function(files, metalsmith, done) {
        let filters = meta.filters
        let filteredFiles = []
        if(!filters) {
            return done()
        } 
        
        let fileNames = Object.keys(files)
        Object.keys(filters).forEach(function(glob) {

            fileNames.forEach(function(fileName) {
                if(R_minimatch(fileName, glob, { dot: true})) {
                    let condition = filters[glob]
                   
                    // 表达式或函数，返回true则不过滤
                    if(!R_util.evaluate(condition, meta)) {
                        filteredFiles.push(fileName)
                        delete files[fileName]
                    }
                }
            })
        })

        R_logger.debug('filterFiles: ', filteredFiles)
        done()
    }
}

function render(meta) {
    return function() {

    }
}