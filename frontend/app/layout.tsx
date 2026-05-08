import { Toaster } from 'react-hot-toast';
import './globals.css'; // Nhúng file CSS mặc định của NextJS (nếu có)

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
                {/* Thêm Toaster để cấu hình hiển thị thông báo */}
                <Toaster position='top-right' />
            </body>
        </html>
    );
}