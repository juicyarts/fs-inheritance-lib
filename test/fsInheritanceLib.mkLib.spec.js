var chai = require('chai')
var path = require('path')
var mockFs = require('mock-fs')
var fs = require('fs')

var expect = chai.expect
var config, result

var fsInheritanceLib = require('../src/fsInheritanceLib')

describe('mkLib - make Library', () => {
  describe('mkLib - make Library', function () {
    before(() => {
      config = {
        root: 'static/gfx/fallback',
        inheritFrom: ['./'],
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
      fsInheritanceLib.mkLib(config)

      expect(fs.existsSync(path.join(config.outputPath, config.outputName))).to.be.true
      var fileContents = JSON.parse(fs.readFileSync(path.join(config.outputPath, config.outputName), 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  describe('mkLib - make Library | removeDuplicatesByFileName | removePatternFromFileName', function () {
    before(() => {
      config = {
        root: 'static/gfx/fallback',
        inheritFrom: ['./'],
        removeDuplicatesByFileName: true,
        removePatternFromFileName: /(\-\d)/,
        getFileByRegEx: true,
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
      fsInheritanceLib.mkLib(config)

      expect(fs.existsSync(path.join(config.outputPath, config.outputName))).to.be.true
      var fileContents = JSON.parse(fs.readFileSync(path.join(config.outputPath, config.outputName), 'utf8'))
      expect(fileContents).eql(result)
    })
  })
  afterEach(() => {
    mockFs.restore()
  })
})
