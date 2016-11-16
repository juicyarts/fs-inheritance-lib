var fs = require('fs')
var path = require('path')
var glob = require('glob')

/**
 * @module fsInheritanceLib
 * @description
 * This Module collects files by given patterns and can create.
 * Arrays or even Files contianing found files.
 * You can Also pass Inheritance paths to find a file.
 */
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
 * @description
 * Takes inherit array and single file to search for the file in given inheritance.
 * It then selects the first appearance and returns an object containong origin and path of file found
 * @param {Object} cfg config
 * @param {String} file filename
 * @returns {Object} containing origin and path
 * @example
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src'
}
var files = 'file.js'
var result = fsIn.findSingleFile(cfg, files)
// returns an object like this, depending on where the file was found.
// local means found in current working directory.
console.log(result)
// {
//  origin: 'local',
//  path: 'foo/bar/src/file.js'
// }
// or
// {
//  origin: 'neighbour',
//  path: 'foo/bar/src/file.js'
// }
 */
function findSingleFile (cfg, file) {
  if (!cfg.inheritFrom || cfg.inheritFrom.length <= 0) throw new ReferenceError('No paths given to inherit from given')
  for (var i = 0; i < cfg.inheritFrom.length; i++) {
    var src = path.join(cfg.inheritFrom[i], cfg.root, file)
    if (!fs.existsSync(src)) {
      log(cfg, 'warn', file, 'doesnt exist in', cfg.root, 'of', cfg.inheritFrom[i])
      continue
    }
    return src
  }
}

/**
 * @description
 * This Function returns an array of matching paths for one given pattern
 * @param {Object} cfg config
 * @param {String} fpath path
 * @returns {Array} containing found paths
 * @example
var fsIn = require('fs-inheritance-lib')
var cfg = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/baz'
}
var paths = ['client-vars']
var result = fsIn.findSingleFile(conig, paths[1])
console.log(result)
// [
//  '../parent/foo/bar/baz/client-vars',
//  '../neighbour/foo/bar/baz/client-vars'
//  '../ancestor/foo/bar/baz/client-vars'
// ]
 */
function findSinglePath (cfg, fpath) {
  if (!cfg.inheritFrom || cfg.inheritFrom.length <= 0) throw new ReferenceError('No paths given to inherit from given')
  var results = []
  for (var i = 0; i < cfg.inheritFrom.length; i++) {
    var src = path.join(cfg.inheritFrom[i], cfg.root ? cfg.root : '', fpath)
    if (!fs.existsSync(src)) {
      log(cfg, 'warn', fpath + ' doesnt exist in: ' + cfg.root + 'of' + cfg.inheritFrom[i])
      continue
    }
    results.push(src)
  }
  return results
}

/**
 * @description
 * Needs a config and an array of files.
 * The config must contain inheritFrom attribute with an array of folders to inherit from.
 * The order of this array defines the priority of the folders to be searched in.
 * First appearance in first inheritance is taken.
 * @param {Object} cfg config
 * @param {Array} files
 * @returns {Array} of files found by given config
 * @example
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
var files = [
  'file1.js',
  'sub/sub1.js',
  'file2.js',
  'file3.js',
  'file.js',
  'file4.js'
]
var result = fsIn.findSingleFile(cfg, files)
// returns an object like this, depending on where the file was found.
// local means found in current working directory.
console.log(result)
// [
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js'
// ]
 */
function findFiles (cfg, files) {
  var file = false
  var result = []
  var pat
  for (var f = 0; f < files.length; f++) {
    if (cfg.getFileByRegEx || files[f].match(/\*/)) {
      pat = findGlobPatterns(cfg, files[f])
      result = result.concat(pat)
      continue
    }
    file = findSingleFile(cfg, files[f])
    if (cfg.removePatternFromFileName) {
      file = file.replace(cfg.removePatternFromFileName, '')
    }
    if (cfg.removePath) {
      file = file.split('/').pop()
    }
    result.push(file)
  }
  return removeDuplicates(result)
}

/**
 * @description
 * Needs a config and an array of paths.
 * The config must contain inheritFrom attribute with an array of folders to inherit from.
 * The order of this array defines the priority of the folders to be searched in.
 * First appearance in first inheritance is taken.
 * @param {Object} cfg config
 * @param {Array} paths
 * @returns {Array} of paths found
 * @example
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
var paths = [
  'client-vars',
  'fonts',
  'framework',
  'mixins',
  'module',
  'additional'
]
var result = fsIn.fsInheritanceLib.findPaths(config, paths)
console.log(result)
// [
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
 * Find Files that match wildcards
 * @param {Object} cfg config
 * @param {String} pat pattern
 * @returns {Array} of files found via wildcards | duplicates are removed
 * @example
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src',
  loglevel: []
}
var files = [
  '** /*.js' // i had to put the sapce before the backslash because of jsdoc issues
]
var result = fsIn.fsInheritanceLib.findGlobPatterns(config, files[0])
console.log(result)
// [
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js'
// ]
 */
function findGlobPatterns (cfg, pat) {
  var result = []
  var pattern, file
  var re = new RegExp('(.+?)?(' + cfg.root + ')(/)?')

  for (var i = 0; i < cfg.inheritFrom.length; i++) {
    if (cfg.getFileByRegEx) {
      pattern = glob.sync(path.join(cfg.inheritFrom[i], cfg.root, '**/*.*'))
      pattern = filterRegex(pattern, pat)
    } else {
      pattern = glob.sync(path.join(cfg.inheritFrom[i], cfg.root, pat))
    }

    for (var p = 0; p < pattern.length; p++) {
      file = pattern[p].replace(re, '')
      file = findSingleFile(cfg, file).replace(cfg.removePatternFromFileName, '')

      if (cfg.removePath) {
        file = file.split('/').pop()
      }
      result.push(file)
    }
  }
  return removeDuplicates(result)
}

/**
 * @description
 * Find global paths by widlcards
 * @param {Object} cfg config
 * @param {String} pat pattern
 * @returns {Array} of paths found mathing pattern
 * @example
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src',
  loglevel: []
}
var paths = [
  '*',
]
var result = fsIn.fsInheritanceLib.findGlobPatterns(config, paths[0])
console.log(result)
// [
//  'foo/bar/src/foo',
//  'foo/bar/src/bar',
//  'foo/bar/src/baz',
//  '../parent/foo/bar/src/foo',
//  '../parent/foo/bar/src/bar',
//  '../parent/foo/bar/src/baz',
//  '../neighbour/foo/bar/src/foo',
//  '../neighbour/foo/bar/src/bar',
//  '../neighbour/foo/bar/src/baz',
//  '../../ancestor/foo/bar/src/foo',
//  '../../ancestor/foo/bar/src/bar',
//  '../../ancestor/foo/bar/src/baz',
// ]
 */
function findGlobPath (cfg, pat) {
  var results = []
  var result, pattern
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
 * @description
 * remove duplicates in array
 * @param {Array} arr with duplicates
 * @returns {Array} without duplicates
 * @example
var result = fsInheritanceLib.removeDuplicates(['foo', 'foo', 'bar', 'bar', 'bar', 'baz'])
console.log(result)
// ['foo', 'bar', 'baz']
 */
function removeDuplicates (arr) {
  if (arr.length <= 1) return arr
  var set = new Set(arr)
  var values = set.values()
  return Array.from(values)
}

/**
 * @description
 * filter array of strings by matching regex
 *
 * @param {Array} arr with matching regex
 * @param {String} regex  that should be used to filter
 * @returns {Array} array without matching regex
 * @example
var regex = new RegExp('foo', 'g')
var array = ['foofoo', 'barfoo', 'bar', 'baz']
var result = fsInheritanceLib.filterRegex()
console.log(result)
// ['foofoo', 'barfoo']
 */
function filterRegex (arr, regex) {
  var filtered = arr.filter(function (i) {
    return regex.test(i)
  })
  return filtered
}

/**
 * @description
 * write a file
 *
 * @param {any} input string/object/array that should be written
 * @param {any} name name of the output file (with extension)
 * @param {any} dest destination of file
 * @example
var string = 'someString'
fsInheritanceLib.writeAssetLibrary(string, 'bar.txt', './')
// creates ./bar.txt with content 'someString'
 */
function writeAssetLibrary (input, name, dest) {
  var lib = JSON.stringify(input)
  try {
    fs.writeFileSync(path.join(dest, name), lib)
  } catch (err) {
    log(false, 'error', err)
  }
}

/**
 * @descriptiondescription
 * Make Library collects files or paths and writes a file
 * it can also have a callback function which returns the data found
 *
 * @param {Object} cfg config
 * @param {Function} cb  takes optional callback function
 * @return {Object|Array|Function}
 * @example
 var config = {
  root: 'foo/bar/baz',
  files: ['foo.js', 'bar.js', 'baz.js'],
  outputPath: 'bar/foo',
  outputName: 'baz.json'
}
fsInheritanceLib.writeAssetLibrary(config, function(result){
  console.log('result')
  // ['./foo/bar/baz/foo.js', './foo/bar/baz/bar.js', './foo/bar/baz/baz.js']
  // and a file bar/foo/baz.json is created (if the path exists!)
})
 */
function mkLib (cfg, cb) {
  var result = findFiles(cfg, cfg.files)
  writeAssetLibrary(result, cfg.outputName, cfg.outputPath)
  if (cb) return cb(result)
}

/**
 * @description
 * small logging utility
 * @param {Object} cfg module config
 * @param {String} type log type
 * @param {String} msg message to be displayed
 * @example
 * var config = {loglevel:['error', 'info', 'warn']}
 * fsInheritanceLib.log(config, 'info', 'heythere')
 * // logs info heythere
 */
function log (cfg, type, msg) {
  if (cfg.loglevel && cfg.loglevel.indexOf(type) > -1) {
    console[type](msg)
  }
}
