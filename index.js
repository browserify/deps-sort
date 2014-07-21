var through = require('through2');
var shasum = require('shasum');
var isarray = require('isarray');

module.exports = function (opts) {
    if (!opts) opts = {};
    var expose = opts.expose || {};
    if (isarray(expose)) {
        expose = expose.reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {});
    }
    
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
            tr.push(row);
        });
    }
    else {
        var dedupeIndex = 0, hashes = {}, hmap = {};
        rows.forEach(function (row, ix) {
            if (opts.dedupe) {
                var h = shasum(row.source);
                if (hashes[h] === true) {
                    hashes[h] = ++ dedupeIndex;
                    rows[hmap[h]].dedupe = hashes[h];
                    row.dedupe = hashes[h];
                }
                else if (hashes[h]) {
                    row.dedupe = hashes[h];
                }
                else {
                    hashes[h] = true;
                    hmap[h] = ix;
                }
            }
            tr.push(row);
        });
    }
    tr.push(null);
};

function cmp (a, b) {
    return a.id + a.hash < b.id + b.hash ? -1 : 1;
}

function has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
