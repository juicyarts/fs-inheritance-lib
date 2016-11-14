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

describe('wal - writeAssetLibrary', () => {
  beforeEach(() => {
    logger.configure({
      levels: [],
      selectors: ['mocha', 'test']
    })
  })
   describe('wal - writeAssetLibrary', () => {
    before(() => {
      config = {
        inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
        root: 'foo/bar/src'
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
        'tmpl/': {}
      })
    })
    it('should write a file containing input', () => {
      assetLib.writeAssetLibrary(result, 'result.json', 'tmpl/')
      expect(fs.existsSync('tmpl/result.json')).to.be.true
      var fileContents = JSON.parse(fs.readFileSync('tmpl/result.json', 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
