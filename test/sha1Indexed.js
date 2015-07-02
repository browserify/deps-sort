var sort = require('../');
var test = require('tap').test;
var through = require('through2');
var shasum = require('shasum');

test('sha1 indexed', function (t) {
    t.plan(1);
    var s = sort({ index: 'sha1' });
    var rows = [];
    function write (row, enc, next) { rows.push(row); next() }
    function end () {
        t.deepEqual(rows, [
            {
                id: '/bar.js',
                deps: {},
                index: index('THREE'),
                indexDeps: {},
                source: 'THREE'
            },
            {
                id: '/foo.js',
                deps: { './bar': '/bar.js' },
                index: index('TWO'),
                indexDeps: { './bar': index('THREE') },
                source: 'TWO'
            },
            {
                id: '/main.js',
                deps: { './foo': '/foo.js' },
                index: index('ONE'),
                indexDeps: { './foo': index('TWO') },
                source: 'ONE'
            },
        ]);
    }
    s.pipe(through.obj(write, end));

    s.write({ id: '/main.js', deps: { './foo': '/foo.js' }, source: 'ONE' });
    s.write({ id: '/foo.js', deps: { './bar': '/bar.js' }, source: 'TWO' });
    s.write({ id: '/bar.js', deps: {}, source: 'THREE' });
    s.end();
});

function index(s) {
    return shasum(s).slice(0, 7);
}
