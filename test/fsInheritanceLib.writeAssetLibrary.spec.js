var chai = require('chai')
var mockFs = require('mock-fs')
var fs = require('fs')

var expect = chai.expect
var result

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('wal - writeAssetLibrary', () => {
  describe('wal - writeAssetLibrary', () => {
    before(() => {
      result = [
        'foo/bar/src/file.js',
        'foo/bar/src/file4.js',
        '../parent/foo/bar/src/file2.js',
        '../neighbour/foo/bar/src/file3.js',
        '../../ancestor/foo/bar/src/file1.js'
      ]
      mockFs({
        'tmpl/': {}
      })
    })
    it('should write a file containing input', () => {
      fsInheritanceLib.writeAssetLibrary(result, 'result.json', 'tmpl/')
      expect(fs.existsSync('tmpl/result.json')).to.be.true
      var fileContents = JSON.parse(fs.readFileSync('tmpl/result.json', 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
