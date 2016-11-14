import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiFs from 'chai-fs'
import sinon from 'sinon'
import path from 'path'
import spies from 'chai-spies'
import mockFs from 'mock-fs'
import fs from 'fs'

chai.use(chaiFs)
chai.use(sinonChai)
chai.use(spies)

let expect = chai.expect
let files, config, result, paths

import * as assetLib from '../../lib/common/assets'
import * as logger from '../../lib/logger'

describe('fsf - findSingleFile', () => {
  beforeEach(() => {
    logger.configure({
      levels: [],
      selectors: ['mocha', 'test']
    })
  })
  describe('if no file given', () => {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor']
      }
      logger.configure({
        levels: ['error'],
        selectors: ['mocha', 'test']
      })
      sinon.spy(logger, 'error')
    })
    it('should log Type error', () => {
      assetLib.findSingleFile(config)
      expect(logger.error.called).to.be.true
    })
    after(() => {
      logger.error.restore()
    })
  })
  describe('if file not available', () => {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src'
      }
      files = [
        '/someotherfile.js'
      ]
      logger.configure({
        levels: ['warn'],
        selectors: ['mocha', 'test']
      })
      mockFs({
        'foo/bar/src/file.js': "console.log('child')"
      })
      sinon.spy(logger, 'warn')
    })
    it('should log File not Exisits', done => {
      assetLib.findSingleFile(config, files[0])
      expect(logger.warn.called).to.be.true
      for (var i = 0; i < config.inheritFrom; i++) {
        expect(logger.warn.calledWith(files[0] + "file doesn't exist in:" + config.inheritFrom[i])).to.be.true
      }
      done()
    })
    after(() => {
      logger.warn.restore()
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
      logger.configure({
        levels: ['warn'],
        selectors: ['mocha', 'test']
      })

      sinon.spy(logger, 'warn')
    })

    it('should log File not Exisits', () => {
      assetLib.findSingleFile(config, files[0])
      expect(logger.warn.called).to.be.true
    })
    after(() => {
      logger.warn.restore()
    })
  })
  describe('if local', () => {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src'
      }
      files = [
        'file.js'
      ]
      result = {
        origin: 'local',
        path: 'foo/bar/src/file.js'
      }
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')",
        'foo/bar/src/file.js': "console.log('child')"
      })
    })

    it('should return origin & path local', () => {
      expect(assetLib.findSingleFile(config, files[0])).eql(result)
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
      result = {
        origin: 'neighbour',
        path: '../neighbour/foo/bar/src/file.js'
      }
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')",
        '../neighbour/foo/bar/src/file.js': "console.log('parent')"
      })
    })

    it('should return origin & path neighbour', () => {
      expect(assetLib.findSingleFile(config, files[0])).eql(result)
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
      result = {
        origin: 'parent',
        path: '../parent/foo/bar/src/file.js'
      }
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')",
        '../parent/foo/bar/src/file.js': "console.log('parent')"
      })
    })

    it('should return origin & path parent', () => {
      expect(assetLib.findSingleFile(config, files[0])).eql(result)
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
      result = {
        origin: 'ancestor',
        path: '../../ancestor/foo/bar/src/file.js'
      }
      mockFs({
        '../../ancestor/foo/bar/src/file.js': "console.log('ancestor')"
      })
    })
    it('should return origin & path ancestor', () => {
      expect(assetLib.findSingleFile(config, files[0])).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})