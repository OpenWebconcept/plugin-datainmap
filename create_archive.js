var fs = require('fs');
var archiver = require('archiver');
var version = require('./package.json').version;
const distDir = __dirname + '/dist';

const removeDir = function (path) {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path)

        if (files.length > 0) {
            files.forEach(function (filename) {
                if (fs.statSync(path + "/" + filename).isDirectory()) {
                    removeDir(path + "/" + filename)
                } else {
                    fs.unlinkSync(path + "/" + filename)
                }
            })
            fs.rmdirSync(path)
        } else {
            fs.rmdirSync(path)
        }
    } else {
        console.log("Directory path not found.")
    }
};

removeDir(distDir);
fs.mkdirSync(distDir);

var output = fs.createWriteStream(__dirname + '/dist/gh-datainmap-latest.zip');
var archive = archiver('zip', {
    zlib: { level: 9 }
});
output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});
output.on('end', function() {
    console.log('Data has been drained');
});
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.error(err);
    } else {
      // throw error
      throw err;
    }
});
archive.on('error', function(err) {
    throw err;
});

archive.directory(__dirname + '/plugins/gh-datainmap/', 'gh-datainmap');
archive.file(__dirname + '/LICENSE.txt', { name: 'gh-datainmap/LICENSE.txt' });
archive.pipe(output);
archive.finalize().then(function() {
    fs.copyFileSync(__dirname + '/dist/gh-datainmap-latest.zip', __dirname + '/dist/gh-datainmap-'+version+'.zip');
    const pluginInfo = {
        "name" : "Data In Map",
        "version" : version,
        "download_url" : "https://bitbucket.org/gemeenteheerenveen/datainmap-plugin/downloads/gh-datainmap-latest.zip",
        "sections" : {
            "description" : "Data In Map is a plugin for displaying maps"
        }
    };
    fs.writeFileSync(__dirname + '/dist/update.json', JSON.stringify(pluginInfo, null, 2)); 
});