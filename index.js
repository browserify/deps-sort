var through = require('through2');

module.exports = function (opts) {
    if (!opts) opts = {};
    
    var rows = [];
    return through.obj(write, end);
    
    function write (row, enc, next) { rows.push(row); next() }
    
    function end () {
        var tr = this;
        rows.sort(cmp);
        
        if (opts.index) {
            var index = {};
            rows.forEach(function (row, ix) {
                row.index = ix + 1;
                index[row.id] = ix + 1;
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
            rows.forEach(function (row) {
                tr.push(row);
            });
        }
        tr.push(null);
    }
    
    function cmp (a, b) {
        return a.id + a.hash < b.id + b.hash ? -1 : 1;
    }
};
