"use client";

// Kết nối đến Adafruit IO MQTT
const AIO_USERNAME = process.env.NEXT_PUBLIC_ADAFRUIT_USERNAME; // Tài khoản Adafruit IO
const AIO_KEY = process.env.NEXT_PUBLIC_ADAFRUIT_KEY; // Lấy từ biến môi trường// Thay bằng AIO Key thực tế của bạn khi triển khai
export const AIO_FEEDS = {
  temperature: "lorce/feeds/yolo-home-temperature",
  humidity: "lorce/feeds/yolo-home-humidity",
  light: "lorce/feeds/yolo-home-light",
  lightSwitch: "lorce/feeds/yolo-home-led",
  fanSpeed: "lorce/feeds/yolo-home-fan"
};

// Khởi tạo kết nối MQTT
let mqttClient = null;

// Object chứa dữ liệu cảm biến hiện tại
const sensorData = {
  temperature: "--",
  humidity: "--",
  light: "--",
  lightState: false,
  fanSpeed: 0
};

// Các callback khi dữ liệu thay đổi
const callbacks = {
  onTemperatureChange: [],
  onHumidityChange: [],
  onLightChange: [],
  onLightStateChange: [],
  onFanSpeedChange: [],
  onConnect: [],
  onDisconnect: []
};

// Hàm kết nối đến Adafruit IO MQTT
export const connectToAdafruit = async () => {
  if (typeof window === 'undefined') return; // Chỉ chạy ở client side

  try {
    // Import MQTT client chỉ ở client side
    const mqtt = (await import('mqtt')).default;

    // Tạo kết nối MQTT
    mqttClient = mqtt.connect("wss://io.adafruit.com:443/mqtt", {
      username: AIO_USERNAME,
      password: AIO_KEY
    });

    // Sự kiện khi kết nối thành công
    mqttClient.on("connect", () => {
      console.log("✅ Kết nối thành công đến Adafruit IO MQTT");

      // Đăng ký nhận dữ liệu từ các feed
      Object.values(AIO_FEEDS).forEach(feed => {
        mqttClient.subscribe(feed);
        // Request giá trị mới nhất cho mỗi feed
        requestLatestValue(feed);
      });

      // Thông báo kết nối thành công
      callbacks.onConnect.forEach(callback => callback());
    });

    // Sự kiện khi nhận được tin nhắn
    mqttClient.on("message", (topic, message) => {
      const value = message.toString();
      console.log(`📩 Nhận dữ liệu từ ${topic}: ${value}`);

      // Cập nhật dữ liệu và gọi callback
      if (topic === AIO_FEEDS.temperature) {
        sensorData.temperature = value;
        callbacks.onTemperatureChange.forEach(callback => callback(value));
      }
      if (topic === AIO_FEEDS.humidity) {
        sensorData.humidity = value;
        callbacks.onHumidityChange.forEach(callback => callback(value));
      }
      if (topic === AIO_FEEDS.light) {
        sensorData.light = value;
        callbacks.onLightChange.forEach(callback => callback(value));
      }
      if (topic === AIO_FEEDS.lightSwitch) {
        sensorData.lightState = value === "1";
        callbacks.onLightStateChange.forEach(callback => callback(value === "1"));
      }
      if (topic === AIO_FEEDS.fanSpeed) {
        sensorData.fanSpeed = parseInt(value, 10);
        callbacks.onFanSpeedChange.forEach(callback => callback(parseInt(value, 10)));
      }
    });

    // Sự kiện khi mất kết nối
    mqttClient.on("close", () => {
      console.log("❌ Mất kết nối đến Adafruit IO MQTT");
      callbacks.onDisconnect.forEach(callback => callback());
    });

    return true;
  } catch (error) {
    console.error("Lỗi khi kết nối đến Adafruit IO MQTT:", error);
    return false;
  }
};

// Hàm yêu cầu giá trị mới nhất từ feed
export const requestLatestValue = (feed) => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(feed + '/get', '');
  }
};

// Hàm gửi dữ liệu đến feed
export const publishToFeed = (feed, value) => {
  if (mqttClient && mqttClient.connected) {
    console.log(`Đang gửi dữ liệu đến ${feed}: ${value}`);
    mqttClient.publish(feed, value.toString());
    return true;
  }
  console.error(`Không thể gửi dữ liệu. MQTT client ${mqttClient ? (mqttClient.connected ? 'đã kết nối' : 'chưa kết nối') : 'chưa khởi tạo'}`);
  return false;
};

// Hàm điều khiển đèn
export const controlLight = (isOn) => {
  const value = isOn ? "1" : "0";
  return publishToFeed(AIO_FEEDS.lightSwitch, value);
};

// Hàm điều khiển quạt
export const controlFan = (speed) => {
  // Đảm bảo tốc độ quạt trong khoảng 0-100
  const validSpeed = Math.min(100, Math.max(0, speed));
  return publishToFeed(AIO_FEEDS.fanSpeed, validSpeed);
};

// Hàm lấy dữ liệu lịch sử từ Adafruit IO
export const fetchHistory = async (feed, limit = 20) => {
  try {
    const feedName = feed.split('/feeds/')[1];
    const response = await fetch(
      `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data?limit=${limit}`,
      {
        headers: {
          'X-AIO-Key': AIO_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Chuyển đổi dữ liệu để dễ sử dụng
    return data.map(item => ({
      value: parseFloat(item.value),
      timestamp: new Date(item.created_at)
    }));
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu lịch sử:', error);
    return [];
  }
};

// Đăng ký callback khi dữ liệu thay đổi
export const onTemperatureChange = (callback) => {
  callbacks.onTemperatureChange.push(callback);
  return () => {
    callbacks.onTemperatureChange = callbacks.onTemperatureChange.filter(cb => cb !== callback);
  };
};

export const onHumidityChange = (callback) => {
  callbacks.onHumidityChange.push(callback);
  return () => {
    callbacks.onHumidityChange = callbacks.onHumidityChange.filter(cb => cb !== callback);
  };
};

export const onLightChange = (callback) => {
  callbacks.onLightChange.push(callback);
  return () => {
    callbacks.onLightChange = callbacks.onLightChange.filter(cb => cb !== callback);
  };
};

export const onLightStateChange = (callback) => {
  callbacks.onLightStateChange.push(callback);
  return () => {
    callbacks.onLightStateChange = callbacks.onLightStateChange.filter(cb => cb !== callback);
  };
};

export const onFanSpeedChange = (callback) => {
  callbacks.onFanSpeedChange.push(callback);
  return () => {
    callbacks.onFanSpeedChange = callbacks.onFanSpeedChange.filter(cb => cb !== callback);
  };
};

export const onConnect = (callback) => {
  callbacks.onConnect.push(callback);
  return () => {
    callbacks.onConnect = callbacks.onConnect.filter(cb => cb !== callback);
  };
};

export const onDisconnect = (callback) => {
  callbacks.onDisconnect.push(callback);
  return () => {
    callbacks.onDisconnect = callbacks.onDisconnect.filter(cb => cb !== callback);
  };
};

// Lấy dữ liệu hiện tại
export const getCurrentData = () => {
  return { ...sensorData };
};

// Kiểm tra trạng thái kết nối
export const isConnected = () => {
  return mqttClient && mqttClient.connected;
};
