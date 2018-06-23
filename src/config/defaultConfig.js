/**
 * 
 */
module.exports = {
    hostname: '127.0.0.1',
    port: 9527,
    //Node.js 进程当前工作的目录
    root: process.cwd(),
    compress: /\.(html|css|js|md)/,
    cache: {
        maxAge: 600,
        cacheControl: true,
        lastModified: true,
        etag: true,
    },
};
