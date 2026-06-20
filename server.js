const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { readDB, writeDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'untilbeef-secret-key-2026';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================== 工具函数 ====================

/**
 * 生成下一个自增 ID
 * @param {Array} items - 数据数组
 * @returns {number}
 */
function nextId(items) {
    if (items.length === 0) return 1;
    return Math.max(...items.map(i => i.id)) + 1;
}

/**
 * JWT 认证中间件
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '未提供 Token' });
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Token 无效或已过期' });
    }
}

/**
 * 获取数据库中所有标签及其计数
 * @param {Object} db
 * @returns {Array}
 */
function getTags(db) {
    const tagMap = {};
    db.posts.forEach(post => {
        (post.tags || []).forEach(tag => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    });
    return Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

// ==================== 认证 API ====================

// 注册
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: '用户名长度需在 3-20 之间' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少 6 位' });
    }

    const db = readDB();
    if (db.users.find(u => u.username === username)) {
        return res.status(409).json({ error: '用户名已存在' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: nextId(db.users),
        username,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        role: 'user',
        createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, username: newUser.username, avatar: newUser.avatar, role: newUser.role } });
});

// 登录
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, avatar: user.avatar, role: user.role } });
});

// 获取当前用户信息
app.get('/api/auth/me', authMiddleware, (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ id: user.id, username: user.username, avatar: user.avatar, role: user.role });
});

// ==================== 帖子 API ====================

// 获取帖子列表
app.get('/api/posts', (req, res) => {
    const { category, tag, search, page = 1, limit = 10 } = req.query;
    const db = readDB();
    let posts = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (category) {
        posts = posts.filter(p => p.category === category);
    }
    if (tag) {
        posts = posts.filter(p => (p.tags || []).includes(tag));
    }
    if (search) {
        const kw = search.toLowerCase();
        posts = posts.filter(p => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw));
    }

    const total = posts.length;
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const pagePosts = posts.slice(start, end);

    // 补充作者信息并脱敏
    const result = pagePosts.map(post => {
        const author = db.users.find(u => u.id === post.authorId);
        return {
            ...post,
            author: author ? { id: author.id, username: author.username, avatar: author.avatar } : null,
            likedBy: undefined // 不返回点赞用户列表
        };
    });

    res.json({ posts: result, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
});

// 获取帖子详情
app.get('/api/posts/:id', (req, res) => {
    const db = readDB();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '帖子不存在' });

    // 浏览量 +1
    post.views = (post.views || 0) + 1;
    writeDB(db);

    const author = db.users.find(u => u.id === post.authorId);
    const comments = db.comments.filter(c => c.postId === post.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(c => {
            const u = db.users.find(x => x.id === c.authorId);
            return { ...c, author: u ? { id: u.id, username: u.username, avatar: u.avatar } : null };
        });

    res.json({
        post: {
            ...post,
            author: author ? { id: author.id, username: author.username, avatar: author.avatar } : null
        },
        comments
    });
});

// 创建帖子
app.post('/api/posts', authMiddleware, (req, res) => {
    const { title, content, category, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: '标题和内容不能为空' });
    }

    const db = readDB();
    const newPost = {
        id: nextId(db.posts),
        title,
        content,
        authorId: req.user.id,
        category: category || 'general',
        tags: tags || [],
        views: 0,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.posts.push(newPost);
    writeDB(db);

    const author = db.users.find(u => u.id === req.user.id);
    res.status(201).json({
        ...newPost,
        author: author ? { id: author.id, username: author.username, avatar: author.avatar } : null
    });
});

// 更新帖子
app.put('/api/posts/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '帖子不存在' });
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: '无权修改此帖子' });
    }

    const { title, content, category, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    post.updatedAt = new Date().toISOString();

    writeDB(db);
    res.json(post);
});

// 删除帖子
app.delete('/api/posts/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const idx = db.posts.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: '帖子不存在' });
    if (db.posts[idx].authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: '无权删除此帖子' });
    }

    db.posts.splice(idx, 1);
    // 同时删除相关评论
    db.comments = db.comments.filter(c => c.postId !== parseInt(req.params.id));
    writeDB(db);
    res.json({ message: '删除成功' });
});

// 点赞 / 取消点赞
app.post('/api/posts/:id/like', authMiddleware, (req, res) => {
    const db = readDB();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '帖子不存在' });

    const userId = req.user.id;
    const liked = post.likedBy.includes(userId);

    if (liked) {
        post.likedBy = post.likedBy.filter(id => id !== userId);
        post.likes = Math.max(0, (post.likes || 0) - 1);
    } else {
        post.likedBy.push(userId);
        post.likes = (post.likes || 0) + 1;
    }

    writeDB(db);
    res.json({ liked: !liked, likes: post.likes });
});

// ==================== 评论 API ====================

// 获取评论（已内联在帖子详情中，此处提供独立接口）
app.get('/api/posts/:id/comments', (req, res) => {
    const db = readDB();
    const comments = db.comments.filter(c => c.postId === parseInt(req.params.id))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(c => {
            const u = db.users.find(x => x.id === c.authorId);
            return { ...c, author: u ? { id: u.id, username: u.username, avatar: u.avatar } : null };
        });
    res.json(comments);
});

// 发表评论
app.post('/api/posts/:id/comments', authMiddleware, (req, res) => {
    const { content } = req.body;
    if (!content || !content.trim()) {
        return res.status(400).json({ error: '评论内容不能为空' });
    }

    const db = readDB();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '帖子不存在' });

    const newComment = {
        id: nextId(db.comments),
        postId: post.id,
        authorId: req.user.id,
        content: content.trim(),
        createdAt: new Date().toISOString()
    };

    db.comments.push(newComment);
    writeDB(db);

    const author = db.users.find(u => u.id === req.user.id);
    res.status(201).json({ ...newComment, author: { id: author.id, username: author.username, avatar: author.avatar } });
});

// ==================== 标签 & 统计 API ====================

app.get('/api/tags', (req, res) => {
    const db = readDB();
    res.json(getTags(db));
});

app.get('/api/stats', (req, res) => {
    const db = readDB();
    res.json({
        posts: db.posts.length,
        users: db.users.length,
        comments: db.comments.length,
        tags: getTags(db).length
    });
});

// ==================== 用户公开信息 ====================
app.get('/api/users/:id', (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ id: user.id, username: user.username, avatar: user.avatar, role: user.role, createdAt: user.createdAt });
});

// ==================== 初始化数据 ====================
function initData() {
    const db = readDB();
    if (db.users.length === 0 && db.posts.length === 0) {
        // 创建管理员账号
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const adminUser = {
            id: 1,
            username: 'UntilBeef',
            password: adminPassword,
            avatar: 'UntilBeef.jpg',
            role: 'admin',
            createdAt: new Date('2023-01-01').toISOString()
        };
        db.users.push(adminUser);

        // 初始帖子
        const posts = [
            {
                id: 1,
                title: '👋 大家好，我是 INeedToBeef',
                content: '别名 UntilBeef，是一名 Roblox 开发者 & 玩家。主要使用 Roblox Studio 进行游戏开发，也关注各种 Roblox 相关工具和客户端。欢迎交流！\n\n大卫你牛大了 我恨你',
                authorId: 1,
                category: 'pinned',
                tags: ['自我介绍', 'Roblox'],
                views: 8200,
                likes: 342,
                likedBy: [],
                createdAt: new Date('2023-01-15').toISOString(),
                updatedAt: new Date('2023-01-15').toISOString()
            },
            {
                id: 2,
                title: 'Froststrap 有很多原版没有的功能',
                content: '所以 Froststrap 牛逼。对比原版 Roblox 客户端，Froststrap 提供了大量额外的功能和自定义选项，极大提升了使用体验。\n\n[ froststrap.png ] Froststrap',
                authorId: 1,
                category: 'tool',
                tags: ['Froststrap', '工具', 'Roblox'],
                views: 5600,
                likes: 521,
                likedBy: [],
                createdAt: new Date('2024-06-18').toISOString(),
                updatedAt: new Date('2024-06-18').toISOString()
            },
            {
                id: 3,
                title: 'Roblox Player 乐乐',
                content: '在 Roblox Player 上体验各种有趣的游戏，从生存到模拟经营，玩法丰富。偶尔也会记录一些有趣的游戏瞬间。\n\n[ RobloxPlayer.ico ] Roblox Player',
                authorId: 1,
                category: 'game',
                tags: ['Roblox', '游戏推荐'],
                views: 3100,
                likes: 198,
                likedBy: [],
                createdAt: new Date('2024-05-22').toISOString(),
                updatedAt: new Date('2024-05-22').toISOString()
            },
            {
                id: 4,
                title: 'Roblox Studio 开发日志',
                content: '使用 Roblox Studio 进行游戏开发与创作，编写 Lua 脚本、搭建场景、设计玩法机制。记录一些开发过程中的踩坑与心得，希望能帮到其他 Roblox 开发者。',
                authorId: 1,
                category: 'dev',
                tags: ['Roblox Studio', 'Lua', '开发日志'],
                views: 4800,
                likes: 415,
                likedBy: [],
                createdAt: new Date('2024-03-10').toISOString(),
                updatedAt: new Date('2024-03-10').toISOString()
            }
        ];

        db.posts.push(...posts);
        writeDB(db);
        console.log('[Init] 已创建初始数据和管理员账号 UntilBeef / admin123');
    }
}

initData();

// ==================== 启动 ====================
app.listen(PORT, () => {
    console.log(`UntilBeef 论坛博客后端已启动: http://localhost:${PORT}`);
});
