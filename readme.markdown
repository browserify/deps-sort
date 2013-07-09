# deps-sort

sort [module-deps](https://npmjs.org/package/module-deps) output for deterministic
browserify bundles

# example

## command-line

```
$ for((i=0;i<5;i++)); do module-deps main.js | deps-sort | browser-pack | md5sum; done
e9e630de2c62953140357db0444c3c3a  -
e9e630de2c62953140357db0444c3c3a  -
e9e630de2c62953140357db0444c3c3a  -
e9e630de2c62953140357db0444c3c3a  -
e9e630de2c62953140357db0444c3c3a  -
```

or using `browserify --deps` on a [voxeljs](http://voxeljs.com/) project:

```
$ for((i=0;i<5;i++)); do browserify --deps browser.js | deps-sort | browser-pack | md5sum; done
fb418c74b53ba2e4cef7d01808b848e6  -
fb418c74b53ba2e4cef7d01808b848e6  -
fb418c74b53ba2e4cef7d01808b848e6  -
fb418c74b53ba2e4cef7d01808b848e6  -
fb418c74b53ba2e4cef7d01808b848e6  -
```

## api

To use this module programmatically, write streaming object data and read
streaming object data:

``` js
var sort = require('../')();
var JSONStream = require('JSONStream');
var parse = JSONStream.parse([ true ]);
var stringify = JSONStream.stringify();

process.stdin.pipe(parse).pipe(sort).pipe(stringify).pipe(process.stdout);
```

# methods

``` js
var depsSort = require('deps-sort');
```

## var stream = depsSort()

Return a new through `stream` that should get written
[module-deps](https://npmjs.org/package/module-deps) objects and will output
sorted objects.

# install

With [npm](https://npmjs.org) do:

```
npm install deps-sort
```

# license

MIT
