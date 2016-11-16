var chai = require('chai')
var mockFs = require('mock-fs')

var expect = chai.expect
var files, config, result

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('ff - findFiles', () => {
  describe('from everywhere', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src/',
        loglevel: []
      }
      files = [
        'file1.js',
        'sub/sub1.js',
        'file2.js',
        'file3.js',
        'file.js',
        'file4.js'
      ]
      result = [
        '../../ancestor/foo/bar/src/file1.js',
        '../../ancestor/foo/bar/src/sub/sub1.js',
        '../parent/foo/bar/src/file2.js',
        '../neighbour/foo/bar/src/file3.js',
        'foo/bar/src/file.js',
        'foo/bar/src/file4.js'
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
    it('should return files from different origins with matching paths', () => {
      expect(fsInheritanceLib.findFiles(config, files)).eql(result)
    })
  })
  describe('from everywhere via wildcard | single wildcard', function () {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
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
    it('should return files from different origins with matching paths | from subfolders', () => {
      expect(fsInheritanceLib.findFiles(config, files)).eql(result)
    })
  })
  describe('from everywhere via wildcard | multiple wildcards | subfolders in subfolders', function () {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/',
        loglevel: []
      }
      files = [
        'src/**/*.js',
        'lib/**/*.js'
      ]
      result = [
        'foo/bar/src/file.js',
        'foo/bar/src/file4.js',
        '../parent/foo/bar/src/file2.js',
        '../neighbour/foo/bar/src/file3.js',
        '../../ancestor/foo/bar/src/file1.js',
        '../../ancestor/foo/bar/src/sub/sub1.js',
        '../../ancestor/foo/bar/lib/vendor/lib/sub1.js',
        '../../ancestor/foo/bar/lib/vendor/lib/sub2.js',
        '../../ancestor/foo/bar/lib/vendor/lib/sub3.js'
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
    it('should return files from different origins with matching paths from subfolders and their subfolders', () => {
      expect(fsInheritanceLib.findFiles(config, files)).eql(result)
    })
  })
  describe('from everywhere | removePatternFromFileName ', () => {
    beforeEach(() => {
      config = {
        root: 'static/gfx/fallback',
        inheritFrom: ['./'],
        removeDuplicatesByFileName: true,
        removePatternFromFileName: /(\-\d)/,
        getFileByRegEx: false,
        loglevel: [],
        files: [
          'deAT/bonus/1000x1000-0.gif',
          'deAT/bonus/1000x1000-1.gif',
          'deAT/bonus/1000x1000.gif',
          'deAT/bonus/300x250-0.gif',
          'deAT/bonus/300x250-1.gif',
          'deAT/bonus/300x250.gif',
          'deAT/bonus/50x50-0.gif',
          'deAT/bonus/50x50-1.gif',
          'deAT/bonus/50x50.gif'
        ],
        outputPath: 'tmpl/ov',
        outputName: 'fbSizes.json'
      }
      result = [
        'static/gfx/fallback/deAT/bonus/1000x1000.gif',
        'static/gfx/fallback/deAT/bonus/300x250.gif',
        'static/gfx/fallback/deAT/bonus/50x50.gif'
      ]
      mockFs({
        'static/gfx/fallback/deAT/bonus/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9])
      })
    })
    it('should return paths with regex removed', () => {
      expect(fsInheritanceLib.findFiles(config, config.files)).eql(result)
    })
  })
  describe('from everywhere via RegEx | removePatternFromFileName', () => {
    beforeEach(() => {
      config = {
        root: 'static/gfx/fallback',
        inheritFrom: ['./'],
        removeDuplicatesByFileName: true,
        removePatternFromFileName: /(\-\d)/,
        getFileByRegEx: true,
        loglevel: [],
        files: [/(\d){1,4}(x)(\d){1,4}(\-\d)?(\.).*/],
        outputPath: 'tmpl/ov',
        outputName: 'fbSizes.json'
      }
      result = [
        'static/gfx/fallback/deAT/bonus/1000x1000.gif',
        'static/gfx/fallback/deAT/bonus/300x250.gif',
        'static/gfx/fallback/deAT/bonus/50x50.gif'
      ]
      mockFs({
        'static/gfx/fallback/deAT/bonus/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9])
      })
    })
    it('should return paths with regex removed', () => {
      expect(fsInheritanceLib.findFiles(config, config.files)).eql(result)
    })
  })
  describe('from everywhere via RegEx | removePatternFromFileName | removeDuplicatesByFileName', () => {
    beforeEach(() => {
      config = {
        root: 'static/gfx/fallback',
        removePath: true,
        inheritFrom: ['./'],
        removePatternFromFileName: /(\-\d)/,
        getFileByRegEx: true,
        files: [/(\d){1,4}(x)(\d){1,4}(\-\d)?(\.).*/],
        outputPath: 'tmpl/ov',
        loglevel: [],
        outputName: 'fbSizes.json'
      }
      result = [
        '1000x1000.gif',
        '300x250.gif',
        '50x50.gif'
      ]
      mockFs({
        'static/gfx/fallback/deAT/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9])
      })
    })
    it('should return paths with regex removed', () => {
      expect(fsInheritanceLib.findFiles(config, config.files)).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
