# upload-stream

Self-contained proof-of-concept for uploading a file from a web form and streaming it to a storage server.

## `npm install`

Install dependencies.

## `npm start`

Run all 3 servers. Open the web frontend on http://localhost:4000

### `node server-front.js`

http-server  on localhost:4000 which just serves the static assets.

### `node server-middle.js`

http-server on localhost:4001, using [busboy](https://github.com/mscdex/busboy) to receive multipart form payload, add headers, base64 encode and stream it out.

### `node server-back.js`

http-server on localhost:4002 which receives a stream, base64 decodes and saves it to disk in a `received` folder.

## TODO

- Handle errors!
