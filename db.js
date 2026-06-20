const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

/**
 * 读取数据库文件
 * @returns {Object} 数据库对象
 */
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        return { users: [], posts: [], comments: [] };
    }
    try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        return { users: [], posts: [], comments: [] };
    }
}

/**
 * 写入数据库文件
 * @param {Object} data - 数据库对象
 */
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
