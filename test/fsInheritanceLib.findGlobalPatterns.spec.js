var chai = require('chai')
var mockFs = require('mock-fs')

var expect = chai.expect
var files, config, result

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('fgp - findGlobalPaths', () => {
  describe('fgp findGlobalPatterns | deep wildcard', function () {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src',
        loglevel: []
      }
      files = [
        '**/*.js'
      ]
      result = [
        'foo/bar/src/file.js',
        'foo/bar/src/file4.js',
        '../parent/foo/bar/src/file2.js',
        '../neighbour/foo/bar/src/file3.js',
        '../../ancestor/foo/bar/src/file1.js',
        '../../ancestor/foo/bar/src/sub/sub1.js'
      ]
      mockFs({
        '../../ancestor/foo/bar/lib/vendor/lib/sub1.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/lib/vendor/lib/sub2.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/lib/vendor/lib/sub3.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/file1.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/sub/sub1.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../parent/foo/bar/src/file2.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file3.js': "console.log('parent')",
        'foo/bar/src/file.js': "console.log('child')",
        'foo/bar/src/file4.js': "console.log('child')"
      })
    })

    it('should return array of files without doubles | deep', () => {
      expect(fsInheritanceLib.findGlobPatterns(config, files[0])).eql(result)
    })
  })
  describe('fgp findGlobalPatterns | flat wildcard', function () {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src',
        loglevel: []
      }
      files = [
        '*.js'
      ]
      result = [
        'foo/bar/src/file.js',
        'foo/bar/src/file4.js',
        '../parent/foo/bar/src/file2.js',
        '../neighbour/foo/bar/src/file3.js',
        '../../ancestor/foo/bar/src/file1.js'
      ]
      mockFs({
        '../../ancestor/foo/bar/lib/vendor/lib/sub1.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/lib/vendor/lib/sub2.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/lib/vendor/lib/sub3.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/file1.js': "console.log('ancestor')",
        '../../ancestor/foo/bar/src/sub/sub1.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../parent/foo/bar/src/file2.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file3.js': "console.log('parent')",
        'foo/bar/src/file.js': "console.log('child')",
        'foo/bar/src/file4.js': "console.log('child')"
      })
    })

    it('should return array of files without doubles | flat', () => {
      expect(fsInheritanceLib.findGlobPatterns(config, files[0])).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
