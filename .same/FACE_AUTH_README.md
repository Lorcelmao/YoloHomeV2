# Hướng dẫn sử dụng tính năng xác thực khuôn mặt trong YoloHomeV2

## Giới thiệu

Tính năng xác thực khuôn mặt (Face Authentication) trong YoloHomeV2 cho phép người dùng đăng ký và đăng nhập bằng khuôn mặt thay vì phải nhớ và nhập mật khẩu. Tính năng này sử dụng thư viện face-api.js để nhận diện khuôn mặt trực tiếp trên trình duyệt, kết hợp với thuật toán K-Nearest Neighbors (KNN) để phân loại và nhận diện người dùng.

## Yêu cầu hệ thống

- Trình duyệt hiện đại hỗ trợ WebRTC (Google Chrome, Firefox, Edge, Safari)
- Webcam hoạt động tốt
- Kết nối internet ổn định (để tải các model nhận diện khuôn mặt khi sử dụng lần đầu)

## Cách đăng ký tài khoản với xác thực khuôn mặt

1. Truy cập trang đăng ký tài khoản (/auth/register)
2. Điền đầy đủ thông tin cá nhân (họ tên, tên đăng nhập, email, mật khẩu)
3. Đánh dấu vào ô "Đăng ký xác thực bằng khuôn mặt"
4. Nhấn nút "Thêm khuôn mặt" hoặc tiếp tục với form đăng ký
5. Khi camera hiển thị, đảm bảo khuôn mặt nằm trong khung hình và ánh sáng đủ tốt
6. Nhấn nút "Lưu khuôn mặt" khi khuôn mặt được phát hiện
7. Hoàn tất đăng ký bằng cách nhấn nút "Đăng ký"

## Cách đăng nhập bằng khuôn mặt

1. Truy cập trang đăng nhập (/auth/login)
2. Chọn nút "Khuôn mặt" ở phần "Hoặc đăng nhập bằng"
3. Khi camera hiển thị, đặt khuôn mặt của bạn trong khung hình
4. Hệ thống sẽ tự động nhận diện khuôn mặt của bạn
5. Nếu nhận diện thành công, bạn sẽ được tự động đăng nhập vào hệ thống

## Các lưu ý quan trọng

- Đảm bảo ánh sáng đủ tốt khi đăng ký và đăng nhập bằng khuôn mặt
- Cố gắng giữ cùng góc nhìn và biểu cảm khi đăng nhập tương tự khi đăng ký
- Trong trường hợp không nhận diện được khuôn mặt, bạn vẫn có thể đăng nhập bằng tên đăng nhập và mật khẩu
- Dữ liệu khuôn mặt được lưu trữ cục bộ trong localStorage của trình duyệt
- Có thể đăng ký nhiều tài khoản với các khuôn mặt khác nhau

## Cách thức hoạt động

1. **Đăng ký khuôn mặt**:
   - Hệ thống sử dụng face-api.js để phát hiện khuôn mặt thông qua webcam
   - Khi phát hiện khuôn mặt, hệ thống tạo một vector đặc trưng mô tả khuôn mặt (face descriptor)
   - Vector này được lưu trữ cùng với ID người dùng trong localStorage

2. **Đăng nhập bằng khuôn mặt**:
   - Hệ thống phát hiện khuôn mặt qua webcam
   - So sánh vector đặc trưng của khuôn mặt hiện tại với các vector đã lưu
   - Sử dụng thuật toán KNN (K-Nearest Neighbors) để tìm vector gần nhất
   - Nếu khoảng cách giữa các vector đủ nhỏ, người dùng được đăng nhập

## Giải quyết sự cố

1. **Không nhận diện được khuôn mặt**:
   - Đảm bảo đủ ánh sáng
   - Điều chỉnh khoảng cách giữa khuôn mặt và webcam
   - Tháo kính, mũ, hoặc các vật che khuôn mặt
   - Đăng ký lại khuôn mặt trong điều kiện ánh sáng tốt hơn

2. **Lỗi camera**:
   - Đảm bảo đã cấp quyền truy cập camera cho trang web
   - Kiểm tra xem camera có đang được sử dụng bởi ứng dụng khác không
   - Refresh trang và thử lại

3. **Performance kém**:
   - Các model nhận diện khuôn mặt có thể tốn thời gian tải lần đầu
   - Đảm bảo thiết bị có đủ tài nguyên để xử lý nhận diện khuôn mặt
   - Sử dụng thiết bị có hiệu năng tốt hơn nếu có thể
