# fs-inheritance-lib [![Build Status](https://travis-ci.org/juicyarts/fs-inheritance-lib.svg?branch=master)](https://travis-ci.org/juicyarts/fs-inheritance-lib) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
.. is a module i built to manage dependencies in complex projects where files can be spread over different folders.

## Whats the purpose
At my company we write applications that heavliy depend on inheritance.
So most of the Time i may have sctructures like this:

```
+-- CoreProject
+-- ChildProjectA
+-- ChildProjectB
    +-- ChildProjectBCore
    +-- ChildProjectBChildA
        +-- ChildProjectBChildACore
        +-- ChildProjectBChildAChild
    +-- ChildProjectBChildB
..
``` 

Each Project may or may not inherit from its parent or neighbour project.
It Also may or my not have sources that also are available in parent or neighbour projects.
We have technologies that supply functionality for templates and other resource inheritance on the server side.

But i needed something that allows me to collect sources needed for css and javascript builds which i do inside my environment 
or on build servers.

----

Lets assume we have this kind of Structure for some applications that should inherit from each other:
```
+-- CoreProject
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
+-- ChildProjectA
    +-- js
        +-- presets
    +-- css
        +-- variables.css
        +-- default.css
+-- ChildProjectB
    +-- js
        +-- presets
        +-- src
            +-- moduleC
    +-- css
        +-- lib
        +-- src
            +-- moduleA
``` 
So the Core Project serves as a Library Project.
The Child Projects should have a minimum of the application logic as long as they dont want to override a module.
The Only thing they should provide is something like configuration for the Library Project (represented by the folder 'presets')

So given something like this , how can we collect our files without going crazy?

---

# fs-inheritance-lib ftw! 

## Installation
```
npm install fsInheritanceLib --save-dev
````

## Usage
They are not yet at 100% but:
* Go To The [DOCS](Docs.md)

## Contribute
* Use Js standard Style
* Write Tests!

## Release History

* 0.1.0 Initial release