var through = require('through');

module.exports = function () {
    var rows = [];
    return through(write, end);
    
    function write (row) { rows.push(row) }
    
    function end () {
        var tr = this;
        rows.sort(cmp).forEach(function (row) {
            tr.queue(row);
        });
        tr.queue(null);
    }
    
    function cmp (a, b) {
        return a.id < b.id ? -1 : 1;
    }
};
