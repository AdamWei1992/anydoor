/**
 * 启动时，在浏览器中默认打开
 */

const { exec } = require('child_process');
module.exports = (url) => {
    //返回操作系统的标识
    switch (process.platform) {
        case 'darwin':
            exec(`open ${url}`);
            break;
        case 'win32':
            exec(`start ${url}`);
            break;
        default:
            break;
    }
}
