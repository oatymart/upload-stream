const fs = require('fs');
const http = require('http');
const { Base64Decode } = require('base64-stream');

// Final endpoint
http.createServer(function (req, res) {
    console.log(req.headers);
    if (req.method === 'POST') {
        // Save request stream to disk
        const destFile = fs.createWriteStream(`./received/${req.headers['x-filename']}`);
        req.pipe(new Base64Decode()).pipe(destFile);
        // file.end();
    }
    res.writeHead(200);
    res.end();

}).listen(4002, function () {
    console.log('BE listening on 4002');
});
