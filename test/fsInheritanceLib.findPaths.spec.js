var chai = require('chai')
var mockFs = require('mock-fs')

var expect = chai.expect
var config, result, paths

var fsInheritanceLib = require('../src/fsInheritanceLib')
describe('fp - findPaths', () => {
  describe('from everywhere', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
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
      result = [
        '../parent/foo/bar/src/client-vars',
        '../neighbour/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/fonts',
        '../../ancestor/foo/bar/src/framework',
        '../../ancestor/foo/bar/src/mixins',
        '../../ancestor/foo/bar/src/module',
        '../parent/foo/bar/src/additional',
        '../neighbour/foo/bar/src/additional'
      ]
      mockFs({
        '../../ancestor/foo/bar/src/client-vars': {},
        '../../ancestor/foo/bar/src/fonts': {},
        '../../ancestor/foo/bar/src/framework': {},
        '../../ancestor/foo/bar/src/mixins': {},
        '../../ancestor/foo/bar/src/module': {},
        '../parent/foo/bar/src/client-vars': {},
        '../parent/foo/bar/src/additional': {},
        '../neighbour/foo/bar/src/client-vars': {},
        '../neighbour/foo/bar/src/additional': {}
      })
    })
    it('should return paths from different origins', () => {
      expect(fsInheritanceLib.findPaths(config, paths)).eql(result)
    })
  })
  describe('from everywhere via wildcard', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src/'
      }
      paths = [
        '**/*'
      ]
      result = [
        '../parent/foo/bar/src/additional',
        '../neighbour/foo/bar/src/additional',
        '../parent/foo/bar/src/client-vars',
        '../neighbour/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/fonts',
        '../../ancestor/foo/bar/src/framework',
        '../../ancestor/foo/bar/src/mixins',
        '../../ancestor/foo/bar/src/module'
      ]
      mockFs({
        '../../ancestor/foo/bar/src/client-vars': {},
        '../../ancestor/foo/bar/src/fonts': {},
        '../../ancestor/foo/bar/src/framework': {},
        '../../ancestor/foo/bar/src/mixins': {},
        '../../ancestor/foo/bar/src/module': {},
        '../parent/foo/bar/src/client-vars': {},
        '../parent/foo/bar/src/additional': {},
        '../neighbour/foo/bar/src/client-vars': {},
        '../neighbour/foo/bar/src/additional': {}
      })
    })
    it('should return paths from different origins', () => {
      expect(fsInheritanceLib.findPaths(config, paths)).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
