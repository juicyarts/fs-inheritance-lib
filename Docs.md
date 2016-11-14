<a name="module_fsInheritanceLib"></a>

## fsInheritanceLib
This Module collects files by given patterns and can create
Arrays or even Files contianing found files
You can Also pass Inheritance paths to find a file


* [fsInheritanceLib](#module_fsInheritanceLib)
    * [~findSingleFile(Config, File)](#module_fsInheritanceLib..findSingleFile) ⇒ <code>Object</code>
    * [~findSinglePath(Config, Path)](#module_fsInheritanceLib..findSinglePath)
    * [~findFiles(Config, Array)](#module_fsInheritanceLib..findFiles) ⇒ <code>Array</code>
    * [~findPaths(Config, Paths)](#module_fsInheritanceLib..findPaths) ⇒ <code>Array</code>
    * [~findGlobPatterns(cfg, pat)](#module_fsInheritanceLib..findGlobPatterns) ⇒ <code>array</code>
    * [~removeDuplicates(arr)](#module_fsInheritanceLib..removeDuplicates) ⇒ <code>array</code>
    * [~filterRegex(arr, regex)](#module_fsInheritanceLib..filterRegex) ⇒ <code>array</code>
    * [~writeAssetLibrary(input, name, dest)](#module_fsInheritanceLib..writeAssetLibrary)
    * [~mkLib(cfg, cb)](#module_fsInheritanceLib..mkLib) ⇒ <code>Object</code> &#124; <code>Array</code>

<a name="module_fsInheritanceLib..findSingleFile"></a>

### fsInheritanceLib~findSingleFile(Config, File) ⇒ <code>Object</code>
Takes inherit array and single file
searches for the file in given inheritance
selects first appearance and returns an object
containong origin and path

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Object</code> - containing origin and path  

| Param | Type |
| --- | --- |
| Config | <code>Object</code> | 
| File | <code>String</code> | 

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src'
}
files = 'file.js'
fsIn.findSingleFile(cfg, files)
// returns an Object like this, depending on where the file was found
// local means found in current working directory
// result = {
//  origin: 'local',
//  path: 'foo/bar/src/file.js'
// }
// result = {
//  origin: 'neighbour',
//  path: 'foo/bar/src/file.js'
// }
```
<a name="module_fsInheritanceLib..findSinglePath"></a>

### fsInheritanceLib~findSinglePath(Config, Path)
This Function returns an array of matching paths for one given pattern

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  

| Param | Type |
| --- | --- |
| Config | <code>Object</code> | 
| Path | <code>String</code> | 

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
cfg = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/baz'
}
paths = ['client-vars']
fsIn.findSingleFile(conig, paths[1])
// result = [
//   '../parent/foo/bar/baz/client-vars',
//   '../neighbour/foo/bar/baz/client-vars'
//   '../ancestor/foo/bar/baz/client-vars'
// ]
```
<a name="module_fsInheritanceLib..findFiles"></a>

### fsInheritanceLib~findFiles(Config, Array) ⇒ <code>Array</code>
needs a config and an array of files
config must contain inheritFrom attribute with an
array of folders to inherit from.
The Order of this array defines the priority of
the folders to be searched in.
First appearance in first inheritance is taken

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - of files found by given patterns  

| Param | Type | Description |
| --- | --- | --- |
| Config | <code>Object</code> |  |
| Array | <code>Array</code> | Of Patterns/Files |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
files = [
  'file1.js',
  'sub/sub1.js',
  'file2.js',
  'file3.js',
  'file.js',
  'file4.js'
]
fsIn.findSingleFile(cfg, files)
// returns an Object like this, depending on where the file was found
// local means found in current working directory
// result = [
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js'
//]
```
<a name="module_fsInheritanceLib..findPaths"></a>

### fsInheritanceLib~findPaths(Config, Paths) ⇒ <code>Array</code>
needs a config and an array of Paths
config must contain inheritFrom attribute with an
array of folders to inherit from.
The Order of this array defines the priority of
the folders to be searched in.
First appearance in first inheritance is taken

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - Of Paths Found  

| Param | Type |
| --- | --- |
| Config | <code>Object</code> | 
| Paths | <code>Array</code> | 

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
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
fsIn.fsInheritanceLib.findPaths(config, paths)
// result = [
//  '../parent/foo/bar/src/client-vars',
//  '../neighbour/foo/bar/src/client-vars',
//  '../../ancestor/foo/bar/src/client-vars',
//  '../../ancestor/foo/bar/src/fonts',
//  '../../ancestor/foo/bar/src/framework',
//  '../../ancestor/foo/bar/src/mixins',
//  '../../ancestor/foo/bar/src/module',
//  '../parent/foo/bar/src/additional',
//  '../neighbour/foo/bar/src/additional'
// ]
```
<a name="module_fsInheritanceLib..findGlobPatterns"></a>

### fsInheritanceLib~findGlobPatterns(cfg, pat) ⇒ <code>array</code>
find patterns that include * wildcards

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>array</code> - of files found via wildcards | duplicates are removed  

| Param | Type |
| --- | --- |
| cfg | <code>any</code> | 
| pat | <code>any</code> | 

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
config = {
    inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
    root: 'foo/bar/src',
    loglevel: []
  }
  files = [
    '** /*.js' // i had to put the sapce before the backslash because of jsdoc issues 
  ]
  fsIn.fsInheritanceLib.findGlobPatterns(config, files[0])
  result = [
    'foo/bar/src/file.js',
    'foo/bar/src/file4.js',
    '../parent/foo/bar/src/file2.js',
    '../neighbour/foo/bar/src/file3.js',
    '../../ancestor/foo/bar/src/file1.js',
    '../../ancestor/foo/bar/src/sub/sub1.js'
  ]
```
<a name="module_fsInheritanceLib..removeDuplicates"></a>

### fsInheritanceLib~removeDuplicates(arr) ⇒ <code>array</code>
remove duplicates in array

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>array</code> - with duplicates removed  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>any</code> | containong duplicates |

<a name="module_fsInheritanceLib..filterRegex"></a>

### fsInheritanceLib~filterRegex(arr, regex) ⇒ <code>array</code>
filter array of strings by matching regex

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>array</code> - filtered  

| Param | Type |
| --- | --- |
| arr | <code>any</code> | 
| regex | <code>any</code> | 

<a name="module_fsInheritanceLib..writeAssetLibrary"></a>

### fsInheritanceLib~writeAssetLibrary(input, name, dest)
write a file

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  

| Param | Type |
| --- | --- |
| input | <code>any</code> | 
| name | <code>any</code> | 
| dest | <code>any</code> | 

<a name="module_fsInheritanceLib..mkLib"></a>

### fsInheritanceLib~mkLib(cfg, cb) ⇒ <code>Object</code> &#124; <code>Array</code>
Make Library makes a library json file from the given config

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | [description] |
| cb | <code>function</code> | takes optional callback function |

