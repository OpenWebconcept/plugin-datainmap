var fs = require('fs');
var archiver = require('archiver');
var output = fs.createWriteStream(__dirname + '/gh-datainmap.zip');
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
archive.finalize();