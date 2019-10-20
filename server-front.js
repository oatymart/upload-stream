var fs = require('fs');
var http = require('http');

// Static HTML server
http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(fs.readFileSync('index.html'));
    }
}).listen(3999, () => {
    console.log('FE listening on 3999');
});
