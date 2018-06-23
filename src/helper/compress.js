/**
 * 
 */
const { createGzip, createDeflate } = require('zlib');

module.exports = (rs, req, res) => {

    let acceptEncoding = req.headers['accept-encoding'];

    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs;
    } else if (acceptEncoding.match(/\bgzip\b/)) {

        res.setHeader('Content-Encoding', 'gzip');
        return rs.pipe(createGzip());
    } else if (acceptEncoding.match(/\deflate\b/)) {

        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }
}
