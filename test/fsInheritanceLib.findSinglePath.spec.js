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

describe('fsp - findSinglePath', () => {
  beforeEach(() => {
    logger.configure({
      levels: [],
      selectors: ['mocha', 'test']
    })
  })
  describe('if path is not given', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor']
      }
      sinon.spy(logger, 'error')
    })
    it('should return empty array and call error', () => {
      expect(assetLib.findSinglePath(config)).eql(result)
      expect(logger.error.called).to.be.true
    })
    afterEach(() => {
      logger.error.restore()
    })
  })
  describe('if Path is not available', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz'
      }
      paths = [
        'client-vars'
      ]
      result = []
      sinon.spy(logger, 'warn')
    })
    it('should return an empty array', () => {
      expect(assetLib.findSinglePath(config, paths[0])).eql(result)
      expect(logger.warn.called).to.be.true
    })
    afterEach(() => {
      logger.warn.restore()
    })
  })
  describe('if Path is available in parent only', () => {
    beforeEach(() => {
      logger.configure({
        levels: ['debug'],
        selectors: ['mocha', 'test']
      })
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/baz'
      }
      paths = ['client-vars']
      result = [
        '../parent/foo/bar/baz/client-vars'
      ]
      mockFs({
        '../parent/foo/bar/baz/client-vars': {}
      })
      sinon.spy(logger, 'debug')
    })
    it('should return array of one file', () => {
      expect(assetLib.findSinglePath(config, paths[0])).eql(result)
      expect(logger.debug.called).to.be.true
    })
    afterEach(() => {
      logger.debug.restore()
    })
  })
  describe('if Path is available in parent and neighbour only', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
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
      expect(assetLib.findSinglePath(config, paths[0])).eql(result)
    })
  })
  describe('if Path is available in parent, neighbour and ancestor', () => {
    beforeEach(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
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
      expect(assetLib.findSinglePath(config, paths[0])).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
