var fs = require('fs')
var path = require('path')
var glob = require('glob')

module.exports = {
  findSingleFile: findSingleFile,
  findSinglePath: findSinglePath,
  findFiles: findFiles,
  findPaths: findPaths,
  findGlobPatterns: findGlobPatterns,
  findGlobPath: findGlobPath,
  writeAssetLibrary: writeAssetLibrary,
  mkLib: mkLib
}

/**
 * @module fsInheritanceLib
 * @description
 * This Module collects files by given patterns and can create
 * Arrays or even Files contianing found files
 * You can Also pass Inheritance paths to find a file
 */

/**
 * @description
 * Takes inherit array and single file
 * searches for the file in given inheritance
 * selects first appearance and returns an object
 * containong origin and path
 *
 * @param {Object} Config
 * @param {String} File
 * @returns {Object} containing origin and path
 * @example
var fsIn = require('fs-inheritance-lib')
config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src'
}
files = 'file.js'
fsIn.findSingleFile(cfg, files)
// returns an Object like this, depending on where the file was found
// local means found in current working directory
// result = {
//  origin: 'local',
//  path: 'foo/bar/src/file.js'
// }
// result = {
//  origin: 'neighbour',
//  path: 'foo/bar/src/file.js'
// }
 */
function findSingleFile (cfg, file) {
  try {
    var result = {}

    // prepend base path
    if (!cfg.inheritFrom || cfg.inheritFrom.length <= 0) {
      cfg.inheritFrom = ['./']
    } else {
      if (cfg.inheritFrom.indexOf('./') < 0) {
        cfg.inheritFrom.unshift('./')
      }
    }

    for (var i = 0; i < cfg.inheritFrom.length; i++) {
      var src = path.join(cfg.inheritFrom[i], cfg.root, file)
      if (fs.existsSync(src)) {
        result = {
          origin: cfg.inheritFrom[i] === './' ? 'local' : cfg.inheritFrom[i].replace(/^(((\.){1,2}\/){1,})/, ''),
          path: src
        }
        if (cfg.loglevel && cfg.loglevel.indexOf('info') > -1) {
          console.info(path.join(cfg.root, file) + ' found in: ' + cfg.inheritFrom[i])
        }
        return result
      } else {
        if (cfg.loglevel && cfg.loglevel.indexOf('warn') > -1) {
          console.warn(path.join(cfg.root, file) + " doesn't exist in: " + cfg.inheritFrom[i])
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * This Function returns an array of matching paths for one given pattern
 * @example
var fsIn = require('fs-inheritance-lib')
cfg = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/baz'
}
paths = ['client-vars']
fsIn.findSingleFile(conig, paths[1])
// result = [
//   '../parent/foo/bar/baz/client-vars',
//   '../neighbour/foo/bar/baz/client-vars'
//   '../ancestor/foo/bar/baz/client-vars'
// ]
 * @param {Object} Config
 * @param {String} Path
 */
function findSinglePath (cfg, fpath) {
  try {
    var results = []
    for (var i = 0; i < cfg.inheritFrom.length; i++) {
      var src = path.join(cfg.inheritFrom[i], cfg.root ? cfg.root : '', fpath)
      if (fs.existsSync(src)) {
        if (cfg.loglevel && cfg.loglevel.indexOf('info') > -1) {
          console.info(path.join(cfg.root ? cfg.root : '', fpath) + ' found in: ' + cfg.inheritFrom[i])
        }
        results.push(src)
      } else {
        if (cfg.loglevel && cfg.loglevel.indexOf('warn') > -1) {
          console.warn(path.join(cfg.root ? cfg.root : '', fpath) + " doesn't exist in: " + cfg.inheritFrom[i])
        }
      }
    }
    return results
  } catch (err) {
    console.error(err)
  }
}

/**
 * needs a config and an array of files
 * config must contain inheritFrom attribute with an
 * array of folders to inherit from.
 * The Order of this array defines the priority of
 * the folders to be searched in.
 * First appearance in first inheritance is taken
 *
 * @param {Object} Config
 * @param {Array} Array Of Patterns/Files
 * @returns {Array} of files found by given patterns
 *
 * @example
var fsIn = require('fs-inheritance-lib')
config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
files = [
  'file1.js',
  'sub/sub1.js',
  'file2.js',
  'file3.js',
  'file.js',
  'file4.js'
]
fsIn.findSingleFile(cfg, files)
// returns an Object like this, depending on where the file was found
// local means found in current working directory
// result = [
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js'
//]
 *
 */
function findFiles (cfg, files) {
  var file = false
  var result = []
  for (var f = 0; f < files.length; f++) {
    if (cfg.getFileByRegEx || files[f].match(/\*/)) {
      var pat = findGlobPatterns(cfg, files[f])
      if (result.length === 0) {
        result = pat
      } else {
        result = result.concat(pat)
      }
    } else {
      if (cfg.removePatternFromFileName !== undefined && findSingleFile(cfg, files[f]).path.match(cfg.removePatternFromFileName)) {
        file = findSingleFile(cfg, files[f]) ? findSingleFile(cfg, files[f]).path.replace(cfg.removePatternFromFileName, '') : false
      } else {
        file = findSingleFile(cfg, files[f]) ? findSingleFile(cfg, files[f]).path : false
      }
      if (file) {
        if (cfg.removePath) {
          file = file.split('/').pop()
        }
        result.push(file)
      }
    }
  }

  result = removeDuplicates(result)
  return result
}

/**
 * needs a config and an array of Paths
 * config must contain inheritFrom attribute with an
 * array of folders to inherit from.
 * The Order of this array defines the priority of
 * the folders to be searched in.
 * First appearance in first inheritance is taken
 * @example
var fsIn = require('fs-inheritance-lib')
config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
paths = [
  'client-vars',
  'fonts',
  'framework',
  'mixins',
  'module',
  'additional'
]
fsIn.fsInheritanceLib.findPaths(config, paths)
// result = [
//  '../parent/foo/bar/src/client-vars',
//  '../neighbour/foo/bar/src/client-vars',
//  '../../ancestor/foo/bar/src/client-vars',
//  '../../ancestor/foo/bar/src/fonts',
//  '../../ancestor/foo/bar/src/framework',
//  '../../ancestor/foo/bar/src/mixins',
//  '../../ancestor/foo/bar/src/module',
//  '../parent/foo/bar/src/additional',
//  '../neighbour/foo/bar/src/additional'
// ]
 * @param {Object} Config
 * @param {Array} Paths
 * @returns {Array} Of Paths Found
 */
function findPaths (cfg, paths) {
  var result = ''
  var results = []
  for (var p = 0; p < paths.length; p++) {
    if (paths[p].match(/\*/)) {
      results = findGlobPath(cfg, paths[p])
    } else {
      result = findSinglePath(cfg, paths[p])
      results = results.concat(result)
    }
  }
  return results
}

/**
 * find patterns that include * wildcards
 * @example
 * var fsIn = require('fs-inheritance-lib')
config = {
    inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
    root: 'foo/bar/src',
    loglevel: []
  }
  files = [
    '** /*.js' // i had to put the sapce before the backslash because of jsdoc issues
  ]
  fsIn.fsInheritanceLib.findGlobPatterns(config, files[0])
  result = [
    'foo/bar/src/file.js',
    'foo/bar/src/file4.js',
    '../parent/foo/bar/src/file2.js',
    '../neighbour/foo/bar/src/file3.js',
    '../../ancestor/foo/bar/src/file1.js',
    '../../ancestor/foo/bar/src/sub/sub1.js'
  ]
 * @param {any} cfg
 * @param {any} pat
 * @returns {array} of files found via wildcards | duplicates are removed
 */
function findGlobPatterns (cfg, pat) {
  var result = []
  var pattern
  var re = new RegExp('(.+?)?(' + cfg.root + ')(/)?')

  // prepend base path

  if (!cfg.inheritFrom || cfg.inheritFrom.length <= 0) {
    cfg.inheritFrom = ['./']
  } else {
    if (cfg.inheritFrom.indexOf('./') < 0) {
      cfg.inheritFrom.unshift('./')
    }
  }

  for (var i = 0; i < cfg.inheritFrom.length; i++) {
    if (cfg.getFileByRegEx) {
      pattern = glob.sync(path.join(cfg.inheritFrom[i], cfg.root, '**/*.*'))
      pattern = filterRegex(pattern, pat)
    } else {
      pattern = glob.sync(path.join(cfg.inheritFrom[i], cfg.root, pat))
    }

    for (var p = 0; p < pattern.length; p++) {
      var file = pattern[p].replace(re, '')
      if (findSingleFile(cfg, file).path.match(cfg.removePatternFromFileName)) {
        file = findSingleFile(cfg, file).path.replace(cfg.removePatternFromFileName, '')
      } else {
        file = findSingleFile(cfg, file).path
      }
      if (cfg.removePath) {
        file = file.split('/').pop()
      }
      result.push(file)
    }
  }
  return removeDuplicates(result)
}

function findGlobPath (cfg, pat) {
  var results = []
  var result
  var pattern
  for (var i = 0; i < cfg.inheritFrom.length; i++) {
    pattern = glob.sync(path.join(cfg.inheritFrom[i], cfg.root, pat))
    for (var p = 0; p < pattern.length; p++) {
      var fPath = pattern[p].split('/').pop()
      result = findSinglePath(cfg, fPath)
      results = results.concat(result)
    }
  }
  return removeDuplicates(results)
}

/**
 * remove duplicates in array
 *
 * @param {any} arr containong duplicates
 * @returns {array} with duplicates removed
 */
function removeDuplicates (arr) {
  var s = new Set(arr)
  var it = s.values()
  return Array.from(it)
}

/**
 * filter array of strings by matching regex
 *
 * @param {any} arr
 * @param {any} regex
 * @returns {array} filtered
 */
function filterRegex (arr, regex) {
  var filtered = arr.filter(function (i) {
    return regex.test(i)
  })
  return filtered
}

/**
 * write a file
 *
 * @param {any} input
 * @param {any} name
 * @param {any} dest
 */
function writeAssetLibrary (input, name, dest) {
  var lib = JSON.stringify(input)
  try {
    fs.writeFileSync(path.join(dest, name), lib)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Make Library makes a library json file from the given config
 *
 * @param  {Object}   cfg [description]
 * @param  {Function} cb  takes optional callback function
 * @return {Object|Array}
 */
function mkLib (cfg, cb) {
  var result = findFiles(cfg, cfg.files)
  writeAssetLibrary(result, cfg.outputName, cfg.outputPath)
  if (cb) {
    cb()
  }
}
