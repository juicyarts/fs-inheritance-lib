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

describe('fp - findPaths', () => {
  beforeEach(() => {
    logger.configure({
      levels: [],
      selectors: ['mocha', 'test']
    })
  })
  describe('from everywhere', () => {
    before(() => {
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
      result = [
        '../parent/foo/bar/src/client-vars',
        '../neighbour/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/client-vars',
        '../../ancestor/foo/bar/src/fonts',
        '../../ancestor/foo/bar/src/framework',
        '../../ancestor/foo/bar/src/mixins',
        '../../ancestor/foo/bar/src/module',
        '../parent/foo/bar/src/additional',
        '../neighbour/foo/bar/src/additional',
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
      expect(assetLib.findPaths(config, paths)).eql(result)
    })
  })
  describe('from everywhere via wildcard', () => {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src/'
      }
      paths = [
        '**/*',
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
      expect(assetLib.findPaths(config, paths)).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})