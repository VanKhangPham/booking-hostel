
---

##  Chức năng chính

- Đăng ký / Đăng nhập người dùng
- Tạo / Sửa / Xóa khách sạn
- Tạo / Quản lý đặt phòng
- Giao diện người dùng thân thiện, responsive

---

##  Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, JavaScript
- **Database:** MongoDB (Mongoose)
- **Middleware:** Express-session, Auth middleware

---

## Phân công công việc

| Thành viên | Phụ trách |
|------------|-----------|
| 👤 TV 1 | Thiết kế model: `User`, `Hotel`, `Booking` |
| 👤 TV 2 | Xử lý các route: `auth`, `hotels`, `bookings`, middleware |
| 👤 TV 3 | Giao diện người dùng: EJS views (auth, hotels, bookings) |
| 👤 TV 4 | Giao diện và hiệu ứng: CSS, JS |
| 👤 TV 5 | Tích hợp hệ thống, viết `app.js`, kiểm thử |

---

## ⚙️ Cài đặt & chạy dự án

```bash
# # Clone project
# git clone https://github.com/your-username/hotel-booking-system.git
# cd hotel-booking-system

# Cài đặt thư viện
npm install

# Khởi động server
npm start
