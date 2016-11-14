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

describe('mkLib - make Library', () => {
  beforeEach(() => {
    logger.configure({
      levels: [],
      selectors: ['mocha', 'test']
    })
  })
  describe('mkLib - make Library', function () {
    before(() => {
      config = {
        root: 'static/gfx/fallback',
        getFileByRegEx: true,
        files: [/(\d){1,4}(x)(\d){1,4}(\-\d)?(\.).*/],
        outputPath: 'tmpl/ov',
        outputName: 'fbSizes.json'
      }
      result = [
        'static/gfx/fallback/deAT/bonus/1000x1000-0.gif',
        'static/gfx/fallback/deAT/bonus/1000x1000-1.gif',
        'static/gfx/fallback/deAT/bonus/1000x1000.gif',
        'static/gfx/fallback/deAT/bonus/300x250-0.gif',
        'static/gfx/fallback/deAT/bonus/300x250-1.gif',
        'static/gfx/fallback/deAT/bonus/300x250.gif',
        'static/gfx/fallback/deAT/bonus/50x50-0.gif',
        'static/gfx/fallback/deAT/bonus/50x50-1.gif',
        'static/gfx/fallback/deAT/bonus/50x50.gif',
        'static/gfx/fallback/deAT/default/1000x1000-0.gif',
        'static/gfx/fallback/deAT/default/1000x1000-1.gif',
        'static/gfx/fallback/deAT/default/1000x1000.gif',
        'static/gfx/fallback/deAT/default/300x250-0.gif',
        'static/gfx/fallback/deAT/default/300x250-1.gif',
        'static/gfx/fallback/deAT/default/300x250.gif',
        'static/gfx/fallback/deAT/default/50x50-0.gif',
        'static/gfx/fallback/deAT/default/50x50-1.gif',
        'static/gfx/fallback/deAT/default/50x50.gif',
        'static/gfx/fallback/deDE/bonus/1000x1000-0.gif',
        'static/gfx/fallback/deDE/bonus/1000x1000-1.gif',
        'static/gfx/fallback/deDE/bonus/1000x1000.gif',
        'static/gfx/fallback/deDE/bonus/300x250-0.gif',
        'static/gfx/fallback/deDE/bonus/300x250-1.gif',
        'static/gfx/fallback/deDE/bonus/300x250.gif',
        'static/gfx/fallback/deDE/bonus/50x50-0.gif',
        'static/gfx/fallback/deDE/bonus/50x50-1.gif',
        'static/gfx/fallback/deDE/bonus/50x50.gif',
        'static/gfx/fallback/deDE/default/1000x1000-0.gif',
        'static/gfx/fallback/deDE/default/1000x1000-1.gif',
        'static/gfx/fallback/deDE/default/1000x1000.gif',
        'static/gfx/fallback/deDE/default/300x250-0.gif',
        'static/gfx/fallback/deDE/default/300x250-1.gif',
        'static/gfx/fallback/deDE/default/300x250.gif',
        'static/gfx/fallback/deDE/default/50x50-0.gif',
        'static/gfx/fallback/deDE/default/50x50-1.gif',
        'static/gfx/fallback/deDE/default/50x50.gif'
      ]
      mockFs({
        'tmpl/ov': {},
        'static/gfx/fallback/deAT/bonus/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deAT/default/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/bonus/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/1000x1000-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/1000x1000-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/1000x1000.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/300x250-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/300x250-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/300x250.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/50x50-0.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/50x50-1.gif': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'static/gfx/fallback/deDE/default/50x50.gif': new Buffer([8, 6, 7, 5, 3, 0, 9])
      })
    })
    it('should write a file containing input', () => {
      assetLib.mkLib(config)

      expect(fs.existsSync(path.join(config.outputPath, config.outputName))).to.be.true
      var fileContents = JSON.parse(fs.readFileSync(path.join(config.outputPath, config.outputName), 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  xdescribe('mkLib - make Library | removeDuplicatesByFileName | removePatternFromFileName', function () {
    before(() => {
      config = {
        root: 'static/gfx/fallback',
        removeDuplicatesByFileName: true,
        removePatternFromFileName: /(\-\d)/,
        getFileByRegEx: true,
        files: [/(\d){1,4}(x)(\d){1,4}(\-\d)?(\.).*/],
        outputPath: 'tmpl/ov',
        outputName: 'fbSizes.json'
      }
      result = [
        'static/gfx/fallback/deAT/bonus/1000x1000-0.gif',
        'static/gfx/fallback/deAT/bonus/1000x1000-1.gif',
        'static/gfx/fallback/deAT/bonus/1000x1000.gif',
        'static/gfx/fallback/deAT/bonus/300x250-0.gif',
        'static/gfx/fallback/deAT/bonus/300x250-1.gif',
        'static/gfx/fallback/deAT/bonus/300x250.gif',
        'static/gfx/fallback/deAT/bonus/50x50-0.gif',
        'static/gfx/fallback/deAT/bonus/50x50-1.gif',
        'static/gfx/fallback/deAT/bonus/50x50.gif'
      ]
      mockFs({
        'tmpl/ov': {},
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
    it('should write a file containing input', () => {
      assetLib.mkLib(config)

      expect(fs.existsSync(path.join(config.outputPath, config.outputName))).to.be.true
      var fileContents = JSON.parse(fs.readFileSync(path.join(config.outputPath, config.outputName), 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
