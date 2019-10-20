const fs = require('fs');
const http = require('http');
const inspect = require('util').inspect;
const Busboy = require('busboy');
const through2 = require('through2');
const { Transform } = require('stream');
const { Base64Encode } = require('base64-stream');

const createRequest = (extraOptions) => {
    const options = {
        hostname: 'localhost',
        port: 4002,
        method: 'POST'
    };
    const req = http.request(
        Object.assign({}, options, extraOptions),
        // end callback:
        (res) => {
            console.log(`statusCode from 4002: ${res.statusCode}`);
        }
    );
    return req;
};

// File processor endpoint
http.createServer((req, res) => {
    if (req.method === 'POST') {
        //console.log('h1', req.headers);
        var busboy = new Busboy({
            headers: req.headers
        });

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            console.log(file);

            const outgoingRequest = createRequest({
                headers: {
                    'x-filename': filename,
                    'x-encoding': encoding,
                    'x-mimetype': mimetype
                }
            });

            const throughOpts = { "decodeStrings": false, "encoding": "utf8" };

            const streamer = (chunk, enc, next) => {
                next(null, chunk); // shorthand for this.push(chunk); next();
            };
            const suffixer = (done) => {
                done(null, filename);
            };

            file
                //.pipe(through2(throughOpts, streamer, suffixer))
                .pipe(new Base64Encode())
                .pipe(outgoingRequest);

            file.on('data', (data) => {
                console.log(`File [${fieldname}] got ${data.length} bytes`);
            });
            file.on('end', () => {
                console.log(`File [${fieldname}] Finished`);
            });
        });

        busboy.on('finish', () => {
            console.log('Done parsing form!');
            res.writeHead(303, {
                Connection: 'close',
                Location: '/'
            });
            res.end();
        });

        // Begin
        req.pipe(busboy);
    }
    else if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(fs.readFileSync('index.html'));
    }
}).listen(4001, () => {
    console.log('MM listening on 4001');
});
