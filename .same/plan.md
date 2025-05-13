# Kế hoạch chỉnh sửa dự án Yolo:Home

## Cấu trúc thư mục mới
```
yolo/
├── app/
│   ├── layout.tsx           # Layout chung cho toàn bộ ứng dụng
│   ├── page.tsx             # Trang chủ (Hiển thị dữ liệu)
│   ├── charts/              # Trang biểu đồ
│   │   └── page.tsx
│   ├── controls/            # Trang điều khiển thiết bị
│   │   └── page.tsx
│   ├── components/          # Các component dùng chung
│   │   ├── Navigation.jsx   # Thanh điều hướng
│   │   ├── SensorCard.jsx   # Card hiển thị thông tin cảm biến
│   │   ├── Charts.jsx       # Component biểu đồ
│   │   └── Controls.jsx     # Component điều khiển
│   ├── utils/
│   │   └── adafruit.js      # Kết nối và xử lý dữ liệu Adafruit MQTT
│   ├── globals.css          # CSS toàn cục
│   └── public/              # Tài nguyên công khai (hình ảnh, font, icon)
├── .same/                   # Thư mục ghi chú và kế hoạch
```

## Kế hoạch thực hiện

### Phần 1: Cấu trúc dự án
1. Loại bỏ các file không cần thiết (liên quan đến project cũ)
2. Đổi tên trang web thành Yolo:Home
3. Cập nhật cấu trúc thư mục theo mô hình mới

### Phần 2: Xây dựng các component
1. Tạo component Navigation.jsx - thanh điều hướng chính
2. Tạo component SensorCard.jsx - hiển thị thông tin từ cảm biến
3. Tạo component Charts.jsx - hiển thị biểu đồ
4. Tạo component Controls.jsx - giao diện điều khiển thiết bị

### Phần 3: Tạo các trang chính
1. Trang chủ (page.tsx) - hiển thị tóm tắt dữ liệu từ các cảm biến
2. Trang biểu đồ (charts/page.tsx) - hiển thị biểu đồ chi tiết
3. Trang điều khiển (controls/page.tsx) - điều khiển thiết bị

### Phần 4: Kết nối dữ liệu
1. Kết nối với Adafruit MQTT
2. Xử lý và hiển thị dữ liệu
3. Gửi lệnh điều khiển qua MQTT

### Phần 5: Tối ưu giao diện
1. Cập nhật CSS toàn cục
2. Điều chỉnh giao diện responsive
3. Cải thiện trải nghiệm người dùng

## Mô tả chi tiết về các trang

### Trang chủ (Dashboard)
- Hiển thị dữ liệu hiện tại của các cảm biến:
  - Nhiệt độ
  - Độ ẩm
  - Cường độ ánh sáng
- Không hiển thị điện năng tiêu thụ

### Trang biểu đồ
- Hiển thị biểu đồ lịch sử của các cảm biến
- Cho phép lọc theo thời gian
- Cho phép chọn loại dữ liệu hiển thị

### Trang điều khiển thiết bị
- Điều khiển đèn (bật/tắt, không thay đổi màu)
- Điều khiển quạt (tốc độ)
- Giao diện trực quan cho người dùng
