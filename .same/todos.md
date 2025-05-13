# Todos - Tích hợp xác thực khuôn mặt cho YoloHomeV2

## Đã hoàn thành
- [x] Clone repository YoloHomeV2 từ GitHub
- [x] Hiểu cấu trúc và logic ứng dụng hiện tại
- [x] Cài đặt thư viện face-api.js
- [x] Tạo module faceRecognition.js để xử lý nhận diện khuôn mặt
- [x] Tạo component FaceCamera.jsx cho việc chụp và xử lý khuôn mặt
- [x] Cập nhật hàm đăng nhập để hỗ trợ xác thực khuôn mặt
- [x] Cập nhật hàm đăng ký để hỗ trợ lưu dữ liệu khuôn mặt
- [x] Cập nhật UI trang đăng nhập để thêm tùy chọn đăng nhập bằng khuôn mặt
- [x] Cập nhật UI trang đăng ký để thêm tùy chọn đăng ký khuôn mặt
- [x] Viết tài liệu hướng dẫn sử dụng tính năng xác thực khuôn mặt

## Cần làm
- [ ] Cải thiện giao diện người dùng cho camera nhận diện khuôn mặt
- [ ] Thêm animation và hiệu ứng khi xác thực thành công/thất bại
- [ ] Thêm tính năng nhiều góc nhìn khuôn mặt để tăng độ chính xác
- [ ] Cải thiện hiệu suất của thuật toán nhận diện
- [ ] Thêm tính năng xóa dữ liệu khuôn mặt đã lưu
- [ ] Tối ưu hóa cho thiết bị di động

## Bugs đã biết
- [ ] Có thể gặp vấn đề trên trình duyệt không hỗ trợ WebRTC
- [ ] Hiệu suất có thể chậm khi tải lần đầu do phải tải các model
- [ ] Đôi khi camera không phát hiện được khuôn mặt trong điều kiện ánh sáng kém
