module.exports = {
    src: './',
    dest: './build',
    scripts: {
        src: './app/**/.js',
        dest:'./build/js'
    },
    appOpts:{
        entries:'./app.js',
        requires:[],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    },
    vendorOpts: {
        requires:['angular'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    },
    view:{
        src:['tpl/**/*.html']
    }
}