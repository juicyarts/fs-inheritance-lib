var chai = require('chai')
var mockFs = require('mock-fs')
var sinon = require('sinon')

var expect = chai.expect
var files, config, result

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('fsf - findSingleFile', () => {
  describe('if no file given', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor']
      }
    })
    it('should throw Type error', () => {
      expect(function () {fsInheritanceLib.findSingleFile(config)}).to.throw(TypeError)
    })
  })
  describe('if file not available', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src',
        loglevel: ['warn']
      }
      files = [
        '/someotherfile.js'
      ]
      mockFs({
        'foo/bar/src/file.js': "console.log('child')"
      })
      sinon.spy(console, 'warn')
    })
    it('should log File not Exisits', done => {
      fsInheritanceLib.findSingleFile(config, files[0])
      expect(console.warn.called).to.be.true
      for (var i = 0; i < config.inheritFrom; i++) {
        expect(console.warn.calledWith(files[0] + "file doesn't exist in:" + config.inheritFrom[i])).to.be.true
      }
      done()
    })
    after(() => {
      console.warn.restore()
    })
    afterEach(() => {
      mockFs.restore()
    })
  })
  describe('if no inheritFrom given', () => {
    before(() => {
      config = {
        inheritFrom: [],
        root: 'foo/bar/src'
      }
      files = [
        'someotherfile.js'
      ]
      mockFs({
        'foo/bar/src/file.js': "console.log('child')"
      })
    })

    it('should log no inheritance', () => {
      expect(function () {fsInheritanceLib.findSingleFile(config, files[0])}).to.throw(ReferenceError)
    })
  })
  describe('if local', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src'
      }
      files = [
        'file.js'
      ]
      result = 'foo/bar/src/file.js'
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')",
        'foo/bar/src/file.js': "console.log('child')"
      })
    })

    it('should return origin & path local', () => {
      expect(fsInheritanceLib.findSingleFile(config, files[0])).eql(result)
    })
  })
  describe('if neighbour', () => {
    before(() => {
      config = {
        inheritFrom: ['./', '../neighbour', '../parent', '../../ancestor'],
        root: 'foo/bar/src/'
      }
      files = [
        'file.js'
      ]
      result = '../neighbour/foo/bar/src/file.js'

      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')"
      })
    })

    it('should return origin & path neighbour', () => {
      expect(fsInheritanceLib.findSingleFile(config, files[0])).eql(result)
    })
  })
  describe('if parent', () => {
    before(() => {
      config = {
        inheritFrom: ['../neighbour', '../parent', '../../ancestor'],
        root: 'foo/bar/src/'
      }
      files = [
        'file.js'
      ]
      result = '../parent/foo/bar/src/file.js'
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')"
      })
    })

    it('should return origin & path parent', () => {
      expect(fsInheritanceLib.findSingleFile(config, files[0])).eql(result)
    })
  })
  describe('if ancestor', () => {
    before(() => {
      config = {
        inheritFrom: ['../neighbour', '../parent', '../../ancestor'],
        root: 'foo/bar/src/'
      }
      files = [
        '/file.js'
      ]
      result = '../../ancestor/foo/bar/src/file.js'
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')"
      })
    })
    it('should return origin & path ancestor', () => {
      expect(fsInheritanceLib.findSingleFile(config, files[0])).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
