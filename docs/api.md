<a name="module_fsInheritanceLib"></a>

## fsInheritanceLib
This Module collects files by given patterns and can create.
Arrays or even Files contianing found files.
You can Also pass Inheritance paths to find a file.


* [fsInheritanceLib](#module_fsInheritanceLib)
    * [~findSingleFile(cfg, file)](#module_fsInheritanceLib..findSingleFile) ⇒ <code>Object</code>
    * [~findSinglePath(cfg, fpath)](#module_fsInheritanceLib..findSinglePath) ⇒ <code>Array</code>
    * [~findFiles(cfg, files)](#module_fsInheritanceLib..findFiles) ⇒ <code>Array</code>
    * [~findPaths(cfg, paths)](#module_fsInheritanceLib..findPaths) ⇒ <code>Array</code>
    * [~findGlobPatterns(cfg, pat)](#module_fsInheritanceLib..findGlobPatterns) ⇒ <code>Array</code>
    * [~findGlobPath(cfg, pat)](#module_fsInheritanceLib..findGlobPath) ⇒ <code>Array</code>
    * [~removeDuplicates(arr)](#module_fsInheritanceLib..removeDuplicates) ⇒ <code>Array</code>
    * [~filterRegex(arr, regex)](#module_fsInheritanceLib..filterRegex) ⇒ <code>Array</code>
    * [~writeAssetLibrary(input, name, dest)](#module_fsInheritanceLib..writeAssetLibrary)
    * [~mkLib(cfg, cb)](#module_fsInheritanceLib..mkLib) ⇒ <code>Object</code> &#124; <code>Array</code> &#124; <code>function</code>
    * [~log(cfg, type, msg)](#module_fsInheritanceLib..log)

<a name="module_fsInheritanceLib..findSingleFile"></a>

### fsInheritanceLib~findSingleFile(cfg, file) ⇒ <code>Object</code>
Takes inherit array and single file to search for the file in given inheritance.
It then selects the first appearance and returns an object containong origin and path of file found

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Object</code> - containing origin and path  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| file | <code>String</code> | filename |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src'
}
var files = 'file.js'
var result = fsIn.findSingleFile(cfg, files)
// returns an object like this, depending on where the file was found.
// local means found in current working directory.
console.log(result)
// {
//  origin: 'local',
//  path: 'foo/bar/src/file.js'
// }
// or
// {
//  origin: 'neighbour',
//  path: 'foo/bar/src/file.js'
// }
```
<a name="module_fsInheritanceLib..findSinglePath"></a>

### fsInheritanceLib~findSinglePath(cfg, fpath) ⇒ <code>Array</code>
This Function returns an array of matching paths for one given pattern

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - containing found paths  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| fpath | <code>String</code> | path |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var cfg = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/baz'
}
var paths = ['client-vars']
var result = fsIn.findSingleFile(conig, paths[1])
console.log(result)
// [
//  '../parent/foo/bar/baz/client-vars',
//  '../neighbour/foo/bar/baz/client-vars'
//  '../ancestor/foo/bar/baz/client-vars'
// ]
```
<a name="module_fsInheritanceLib..findFiles"></a>

### fsInheritanceLib~findFiles(cfg, files) ⇒ <code>Array</code>
Needs a config and an array of files.
The config must contain inheritFrom attribute with an array of folders to inherit from.
The order of this array defines the priority of the folders to be searched in.
First appearance in first inheritance is taken.

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - of files found by given config  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| files | <code>Array</code> |  |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
var files = [
  'file1.js',
  'sub/sub1.js',
  'file2.js',
  'file3.js',
  'file.js',
  'file4.js'
]
var result = fsIn.findSingleFile(cfg, files)
// returns an object like this, depending on where the file was found.
// local means found in current working directory.
console.log(result)
// [
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js'
// ]
```
<a name="module_fsInheritanceLib..findPaths"></a>

### fsInheritanceLib~findPaths(cfg, paths) ⇒ <code>Array</code>
Needs a config and an array of paths.
The config must contain inheritFrom attribute with an array of folders to inherit from.
The order of this array defines the priority of the folders to be searched in.
First appearance in first inheritance is taken.

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - of paths found  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| paths | <code>Array</code> |  |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src/'
}
var paths = [
  'client-vars',
  'fonts',
  'framework',
  'mixins',
  'module',
  'additional'
]
var result = fsIn.fsInheritanceLib.findPaths(config, paths)
console.log(result)
// [
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

### fsInheritanceLib~findGlobPatterns(cfg, pat) ⇒ <code>Array</code>
Find Files that match wildcards

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - of files found via wildcards | duplicates are removed  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| pat | <code>String</code> | pattern |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src',
  loglevel: []
}
var files = [
  '** /*.js' // i had to put the sapce before the backslash because of jsdoc issues
]
var result = fsIn.fsInheritanceLib.findGlobPatterns(config, files[0])
console.log(result)
// [
//  'foo/bar/src/file.js',
//  'foo/bar/src/file4.js',
//  '../parent/foo/bar/src/file2.js',
//  '../neighbour/foo/bar/src/file3.js',
//  '../../ancestor/foo/bar/src/file1.js',
//  '../../ancestor/foo/bar/src/sub/sub1.js'
// ]
```
<a name="module_fsInheritanceLib..findGlobPath"></a>

### fsInheritanceLib~findGlobPath(cfg, pat) ⇒ <code>Array</code>
Find global paths by widlcards

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - of paths found mathing pattern  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| pat | <code>String</code> | pattern |

**Example**  
```js
var fsIn = require('fs-inheritance-lib')
var config = {
  inheritFrom: ['./', '../parent', '../neighbour', '../../ancestor'],
  root: 'foo/bar/src',
  loglevel: []
}
var paths = [
  '*',
]
var result = fsIn.fsInheritanceLib.findGlobPatterns(config, paths[0])
console.log(result)
// [
//  'foo/bar/src/foo',
//  'foo/bar/src/bar',
//  'foo/bar/src/baz',
//  '../parent/foo/bar/src/foo',
//  '../parent/foo/bar/src/bar',
//  '../parent/foo/bar/src/baz',
//  '../neighbour/foo/bar/src/foo',
//  '../neighbour/foo/bar/src/bar',
//  '../neighbour/foo/bar/src/baz',
//  '../../ancestor/foo/bar/src/foo',
//  '../../ancestor/foo/bar/src/bar',
//  '../../ancestor/foo/bar/src/baz',
// ]
```
<a name="module_fsInheritanceLib..removeDuplicates"></a>

### fsInheritanceLib~removeDuplicates(arr) ⇒ <code>Array</code>
remove duplicates in array

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - without duplicates  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | with duplicates |

**Example**  
```js
var result = fsInheritanceLib.removeDuplicates(['foo', 'foo', 'bar', 'bar', 'bar', 'baz'])
console.log(result)
// ['foo', 'bar', 'baz']
```
<a name="module_fsInheritanceLib..filterRegex"></a>

### fsInheritanceLib~filterRegex(arr, regex) ⇒ <code>Array</code>
filter array of strings by matching regex

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Returns**: <code>Array</code> - array without matching regex  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | with matching regex |
| regex | <code>String</code> | that should be used to filter |

**Example**  
```js
var regex = new RegExp('foo', 'g')
var array = ['foofoo', 'barfoo', 'bar', 'baz']
var result = fsInheritanceLib.filterRegex()
console.log(result)
// ['foofoo', 'barfoo']
```
<a name="module_fsInheritanceLib..writeAssetLibrary"></a>

### fsInheritanceLib~writeAssetLibrary(input, name, dest)
write a file

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | string/object/array that should be written |
| name | <code>any</code> | name of the output file (with extension) |
| dest | <code>any</code> | destination of file |

**Example**  
```js
var string = 'someString'
fsInheritanceLib.writeAssetLibrary(string, 'bar.txt', './')
// creates ./bar.txt with content 'someString'
```
<a name="module_fsInheritanceLib..mkLib"></a>

### fsInheritanceLib~mkLib(cfg, cb) ⇒ <code>Object</code> &#124; <code>Array</code> &#124; <code>function</code>
**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  
**Descriptiondescription**: Make Library collects files or paths and writes a file
it can also have a callback function which returns the data found  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | config |
| cb | <code>function</code> | takes optional callback function |

**Example**  
```js
var config = {
  root: 'foo/bar/baz',
  files: ['foo.js', 'bar.js', 'baz.js'],
  outputPath: 'bar/foo',
  outputName: 'baz.json'
}
fsInheritanceLib.writeAssetLibrary(config, function(result){
  console.log('result')
  // ['./foo/bar/baz/foo.js', './foo/bar/baz/bar.js', './foo/bar/baz/baz.js']
  // and a file bar/foo/baz.json is created (if the path exists!)
})
```
<a name="module_fsInheritanceLib..log"></a>

### fsInheritanceLib~log(cfg, type, msg)
small logging utility

**Kind**: inner method of <code>[fsInheritanceLib](#module_fsInheritanceLib)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>Object</code> | module config |
| type | <code>String</code> | log type |
| msg | <code>String</code> | message to be displayed |

**Example**  
```js
var config = {loglevel:['error', 'info', 'warn']}
fsInheritanceLib.log(config, 'info', 'heythere')
// logs info heythere
```
