# Yolo:Home - Smart Home Dashboard

Yolo:Home là một ứng dụng web hiện đại để giám sát và điều khiển thiết bị thông minh trong nhà, tập trung vào tính dễ sử dụng và thiết kế trực quan.

![Yolo:Home Dashboard](https://img.shields.io/badge/Yolo-Home-blue)

## Tính năng chính

- **Dashboard:** Hiển thị thông tin thời tiết và dữ liệu cảm biến theo thời gian thực
- **Biểu đồ:** Phân tích dữ liệu theo nhiệt độ, độ ẩm và ánh sáng với nhiều khung thời gian
- **Điều khiển thiết bị:** Điều khiển đèn và quạt từ xa
- **Hệ thống xác thực:** Đăng nhập/đăng ký người dùng để bảo vệ dữ liệu

## Công nghệ sử dụng

- **Next.js:** Framework React cho ứng dụng web hiện đại
- **Tailwind CSS:** Thiết kế responsive và thẩm mỹ
- **MQTT:** Kết nối với Adafruit IO để điều khiển thiết bị và nhận dữ liệu
- **Chart.js:** Hiển thị biểu đồ dữ liệu

## Hướng dẫn sử dụng

1. **Đăng nhập/Đăng ký:**
   - Tài khoản demo: `demo123` (mật khẩu bất kỳ)
   - Hoặc đăng ký tài khoản mới

2. **Dashboard:**
   - Xem thông tin thời tiết hiện tại
   - Theo dõi nhiệt độ, độ ẩm và cường độ ánh sáng

3. **Biểu đồ:**
   - Phân tích dữ liệu trong 1, 7 hoặc 30 ngày
   - Lọc theo loại dữ liệu (nhiệt độ, độ ẩm, ánh sáng)

4. **Điều khiển thiết bị:**
   - Bật/tắt đèn
   - Điều chỉnh tốc độ quạt

## Cài đặt và chạy dự án

```bash
# Clone dự án
git clone https://github.com/Lorcelmao/YoloHomeV2.git

# Di chuyển vào thư mục dự án
cd YoloHomeV2

# Cài đặt phụ thuộc
npm install

# Chạy ứng dụng
npm run dev
```

## API Credentials

Dự án kết nối với Adafruit MQTT với các thông tin sau:
- Username: lorce
- Feeds:
  - Nhiệt độ: lorce/feeds/yolo-home-temperature
  - Độ ẩm: lorce/feeds/yolo-home-humidity
  - Ánh sáng: lorce/feeds/yolo-home-light
  - Đèn: lorce/feeds/yolo-home-led
  - Quạt: lorce/feeds/yolo-home-fan

## Đóng góp

Mọi đóng góp đều được đánh giá cao. Cảm ơn bạn đã quan tâm đến dự án Yolo:Home!
