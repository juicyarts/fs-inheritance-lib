# fs-inheritance-lib [![Build Status](https://travis-ci.org/juicyarts/fs-inheritance-lib.svg?branch=master)](https://travis-ci.org/juicyarts/fs-inheritance-lib) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
.. is a module i built to manage dependencies in complex projects where files can be spread over different folders.

## Whats the purpose
At my company we write applications that heavliy depend on inheritance.
So most of the time i may have a structure like this:

```
+-- coreProject
+-- childProjectA
+-- childProjectB
    +-- childProjectBCore
    +-- childProjectBChildA
        +-- childProjectBChildACore
        +-- childProjectBChildAChild
    +-- childProjectBChildB
..
``` 

Each project may or may not inherit from its parent or neighbour project.
It also may or my not have sources that also are available in parent or neighbour projects.

What i needed was something that allows me to collect sources the projects might depend on for css and javascript builds which i do locally 
or on build environments.

----

Lets assume we have this kind of structure for some applications that should inherit from each other:
```
+-- coreProject
    +-- js
        +-- lib
        +-- src
            +-- moduleA
            +-- moduleB
    +-- css
        +-- lib
        +-- src
            +-- moduleA
            +-- moduleB
+-- childProjectA
    +-- js
        +-- presets
    +-- css
        +-- variables.css
        +-- default.css
+-- childProjectB
    +-- js
        +-- presets
        +-- src
            +-- moduleC
    +-- css
        +-- lib
        +-- src
            +-- moduleA
``` 
So the core project on the top leve serves as the core library. Each client project can also have a core project that its descendants
depend on.
In the end the child projects should have a minimum of the application logic as long as they dont want to override something.
The only thing they provide in my case is something like configuration for the libraries they depend on (represented by the folder 'presets' here)

So given something like this , how can we collect our files without throwing up?

---

# fs-inheritance-lib ftw!

## Installation
Currently you need to clone this repository. Im planning on publishing it on npm when im done with the things i think are missing.
Until then
```
$ git clone https://github.com/juicyarts/fs-inheritance-lib 
```
<!--## Installation via Npm (not possible yet)
```
npm install fsInheritanceLib --save-dev
````-->

## Usage
They are not yet at 100% but:
* [Api Documentation](docs/api.md)

## Contribute
* Use [js standard style](http://standardjs.com/)
* Write tests!

## Dependencies
* [fs](https://nodejs.org/api/fs.html)
* [glob](https://www.npmjs.com/package/glob)

## Release History

* 0.1.0 Initial release
