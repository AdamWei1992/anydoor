/**
 * 请求文件的一部分
 * 可以用curl工具模拟请求
 * curl -r 0-100 -i http://127.0.0.1:9527/src/app.js
 * 该命令意思请求app.js文件，从0到100字节的数据
 */
module.exports = (totalSize, req, res) => {
    const range = req.headers['range'];
    if (!range) {
        return { code: 200 };
    }
    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;

    if (start > end || start < 0 || end > totalSize) {
        return { code: 200 };
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Ranges', `bytes ${start}-${end}/${totalSize}`);
    res.setHeader('Content-length', end - start);

    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end),
    };
}