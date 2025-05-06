const fs = require("fs");
const archiver = require("archiver");
const args = process.argv;

const datetime = args[2]

console.log( datetime );
const output = fs.createWriteStream(`./seller-staging-${datetime}.zip`);
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function () {
    console.log(`Archivo seller-staging-${datetime}.zip ha sido creado con ${archive.pointer()} total bytes`);
    console.log("Zip creado");
});

archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);
archive.directory("dist/", false)
// Finaliza el proceso de archivado
archive.finalize();
