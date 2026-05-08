const express = require('express');
const cors = require('cors');
const app = express();

// Thiết lập CORS chỉ cho phép Frontend ở port 3000 truy cập
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware để parse body định dạng JSON
app.use(express.json());

// Mảng dữ liệu giả lập
let posts = [
    { id: 1, title: 'Bài viết đầu tiên', content: 'Nội dung bài 1', author: 'Admin' },
    { id: 2, title: 'Hướng dẫn NextJS', content: 'Nội dung bài 2', author: 'Admin' }
];

// 1. API Lấy danh sách bài viết 
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// 2. API Thêm bài viết mới 
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    
    // Validation đơn giản
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Thiếu dữ liệu' });
    }
    
    const newPost = {
        id: Date.now(),
        title,
        content,
        author,
        createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    res.status(201).json(newPost);
});

// 3. API Xoá bài viết 
app.delete('/api/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
    
    posts.splice(index, 1);
    res.json({ message: 'Đã xoá thành công' });
});

app.listen(5000, () => {
    console.log('Backend đang chạy tại port: 5000');
});