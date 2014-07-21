var through = require('through2');
var shasum = require('shasum');
var isarray = require('isarray');

module.exports = function (opts) {
    if (!opts) opts = {};
    var rows = [];
    return through.obj(write, end);
    
    function write (row, enc, next) { rows.push(row); next() }
    
    function end () {
        var tr = this;
        rows.sort(cmp);
        sorter(rows, tr, opts);
    }
};

function sorter (rows, tr, opts) {
    var expose = opts.expose || {};
    if (isarray(expose)) {
        expose = expose.reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {});
    }
    
    var hashes = {};
    if (opts.dedupe) {
        rows.forEach(function (row, ix) {
            var h = shasum(row.source);
            if (hashes[h]) {
                row.dedupe = hashes[h];
            }
            else {
                hashes[h] = row.id;
            }
        });
    }
    
    if (opts.index) {
        var index = {};
        var offset = 0;
        rows.forEach(function (row, ix) {
            if (has(expose, row.id)) {
                row.index = row.id;
                offset ++;
                if (expose[row.id] !== true) {
                    index[expose[row.id]] = row.index;
                }
            }
            else {
                row.index = ix + 1 - offset;
            }
            index[row.id] = row.index;
        });
        rows.forEach(function (row) {
            row.indexDeps = {};
            Object.keys(row.deps).forEach(function (key) {
                row.indexDeps[key] = index[row.deps[key]];
            });
            if (row.dedupe) {
                row.dedupeIndex = index[row.dedupe];
            }
            tr.push(row);
        });
    }
    else {
        rows.forEach(function (row) { tr.push(row) });
    }
    tr.push(null);
};

function cmp (a, b) {
    return a.id + a.hash < b.id + b.hash ? -1 : 1;
}

function has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
