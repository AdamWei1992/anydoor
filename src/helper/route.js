/**
 * 
 */
const fs = require('fs');
const path = require('path');

//解决回调问题
const promisify = require('util').promisify;
const handlebars = require('handlebars');
//获取文件的信息
//不建议在调用 fs.open() 、fs.readFile() 或 fs.writeFile() 之前使用 fs.stat() 检查一个文件是否存在。 作为替代，用户代码应该直接打开/读取/写入文件，当文件无效时再处理错误。
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, '../template/dir.tpl');
//只执行一次，且很小，不会阻塞程序运行
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

module.exports = async function(req, res, filePath, conf) {

    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let rs;
            let { code, start, end } = range(stats.size, req, res);
            if (code == 200) {
                rs = fs.createReadStream(filePath);
            } else {
                code = 206;
                //读取文件的一部分内容
                rs = fs.createReadStream(filePath, { start, end });
            }

            if (filePath.match(conf.compress)) {
                rs = compress(rs, req, res)
            }
            res.writeHead(code, {
                'Content-Type': contentType,
                'Cache-Control': 'max-age=500',
                //'Date': (new Date()).toUTCString(),
            });
            rs.pipe(res);


        } else if (stats.isDirectory()) {

            const files = await readdir(filePath);
            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            //path.relative() 方法返回从 from 到 to 的相对路径
            const dirPath = path.relative(conf.root, filePath);

            const data = {
                title: path.basename(filePath),
                dir: dirPath ? `/${dirPath}` : '',
                files,
            };
            res.end(template(data));

        }
    } catch (err) {
        //如果报错，说明没有这个文件。
        res.writeHead(404, {
            'Content-Type': 'text/plain',
        });
        console.error(err);
        res.end(`${filePath} is not a directory or file`);
    }

};
