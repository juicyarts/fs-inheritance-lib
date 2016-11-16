var chai = require('chai')
var mockFs = require('mock-fs')
var sinon = require('sinon')

var expect = chai.expect
var config, result, paths

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('fsp - findSinglePath', () => {
  describe('if path is not given', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor']
      }
    })
    it('should throw a Type error', () => {
      expect(function () {fsInheritanceLib.findSinglePath(config)}).to.throw(TypeError)
    })
  })
  describe('if Path is not available', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz',
        loglevel: ['warn']
      }
      paths = [
        'client-vars'
      ]
      result = []
      sinon.spy(console, 'warn')
    })
    it('should return an empty array', () => {
      expect(fsInheritanceLib.findSinglePath(config, paths[0])).eql(result)
      expect(console.warn.called).to.be.true
    })
    afterEach(() => {
      console.warn.restore()
    })
  })
  describe('if Path is available in parent only', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz',
        loglevel: ['warn']
      }
      paths = ['client-vars']
      result = [
        '../parent/foo/bar/baz/client-vars'
      ]
      mockFs({
        '../parent/foo/bar/baz/client-vars': {}
      })
      sinon.spy(console, 'warn')
    })
    it('should return array of one file', () => {
      expect(fsInheritanceLib.findSinglePath(config, paths[0])).eql(result)
      expect(console.warn.called).to.be.true
    })
    afterEach(() => {
      console.warn.restore()
    })
  })
  describe('if Path is available in parent and neighbour only', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz'
      }
      paths = ['client-vars']
      result = [
        '../parent/foo/bar/baz/client-vars',
        '../neighbour/foo/bar/baz/client-vars'
      ]
      mockFs({
        '../parent/foo/bar/baz/client-vars': {},
        '../neighbour/foo/bar/baz/client-vars': {}
      })
    })
    it('should return array of one file', () => {
      expect(fsInheritanceLib.findSinglePath(config, paths[0])).eql(result)
    })
  })
  describe('if Path is available in parent, neighbour and ancestor', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz'
      }
      paths = ['client-vars']
      result = [
        '../parent/foo/bar/baz/client-vars',
        '../neighbour/foo/bar/baz/client-vars',
        '../../ancestor/foo/bar/baz/client-vars'
      ]
      mockFs({
        '../parent/foo/bar/baz/client-vars': {},
        '../neighbour/foo/bar/baz/client-vars': {},
        '../../ancestor/foo/bar/baz/client-vars': {}
      })
    })
    it('should return array of one file', () => {
      expect(fsInheritanceLib.findSinglePath(config, paths[0])).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
