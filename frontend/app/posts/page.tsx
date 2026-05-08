'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    // Hàm lấy dữ liệu từ Backend
    const fetchPosts = async () => {
        try {
            const res = await api.get('/api/posts');
            setPosts(res.data);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu từ server!');
        }
    };

    // Chạy 1 lần khi component render xong
    useEffect(() => {
        fetchPosts();
    }, []);

    // Hàm xử lý submit form (Tạo bài viết)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Chặn hành vi reload mặc định của form
        try {
            await api.post('/api/posts', { title, content, author });
            
            // Reset form
            setTitle(''); 
            setContent(''); 
            setAuthor('');
            
            toast.success('Đăng bài thành công!');
            fetchPosts(); // Refresh danh sách sau khi đăng
        } catch (err: any) {
            console.error(err.response?.data?.error);
            toast.error('Có lỗi xảy ra khi đăng bài!');
        }
    };

    // Hàm xử lý xoá bài viết
    const handleDelete = async (id: number) => {
        // 1. Xác nhận người dùng
        if (!confirm('Bạn chắc chắn muốn xoá bài viết này?')) return;
        
        try {
            // 2. Gọi API xoá
            await api.delete(`/api/posts/${id}`);
            
            // 3. Optimistic update: Cập nhật state NGAY để giao diện phản hồi tức thì
            setPosts(prev => prev.filter(p => p.id !== id));
            toast.success('Đã xoá bài viết');
        } catch (err) {
            toast.error('Xoá thất bại, thử lại!');
            // 4. Rollback: Đồng bộ lại với server nếu xoá lỗi
            fetchPosts();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý bài viết</h1>
            
            {/* Form tạo bài viết */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8 bg-gray-50 p-4 border rounded">
                <input 
                    className="border p-2 rounded" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder='Tiêu đề' 
                    required 
                />
                <textarea 
                    className="border p-2 rounded" 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder='Nội dung' 
                    required 
                />
                <input 
                    className="border p-2 rounded" 
                    value={author} 
                    onChange={e => setAuthor(e.target.value)} 
                    placeholder='Tác giả' 
                    required 
                />
                <button type='submit' className="bg-blue-600 text-white font-medium p-2 rounded hover:bg-blue-700 transition">
                    Đăng bài
                </button>
            </form>

            {/* Danh sách bài viết */}
            <div className="flex flex-col gap-3">
                {posts.map(p => (
                    <div key={p.id} className='flex justify-between items-center p-3 border rounded shadow-sm'>
                        <div>
                            <h3 className='font-bold text-lg'>{p.title}</h3>
                            <p className='text-sm text-gray-500'>{p.author} - {p.content}</p>
                        </div>
                        <button 
                            onClick={() => handleDelete(p.id)} 
                            className='text-red-500 hover:text-white hover:bg-red-500 border border-red-500 text-sm font-medium px-3 py-1 rounded transition'
                        >
                            Xoá
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}