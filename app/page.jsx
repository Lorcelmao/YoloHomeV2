"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SensorCard from "./components/SensorCard";
import Navigation from "./components/Navigation";
import Temperature from "./public/icons/temperature.svg";
import Light from "./public/icons/light.svg";
import Water from "./public/icons/water.svg";
import Weather from "./public/icons/weather.svg";
import { connectToAdafruit, onTemperatureChange, onHumidityChange, onLightChange, getCurrentData } from "./utils/adafruit";
import { getCurrentUser } from "./utils/auth";
// Hàm lấy ngày hiện tại
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Weather API
const fetchWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return {
      temp: `${Math.round(data.current_weather.temperature)}°C`,
      description: getWeatherDescription(data.current_weather.weathercode)
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return { temp: "N/A", description: "Unable to fetch weather" };
  }
};

// Chuyển mã thời tiết thành mô tả
const getWeatherDescription = (code) => {
  const weatherDescriptions = {
    0: "Trời quang đãng",
    1: "Trời nắng nhẹ",
    2: "Trời hơi nhiều mây",
    3: "Trời nhiều mây",
    45: "Sương mù",
    48: "Sương mù dày đặc",
    51: "Mưa phùn nhẹ",
    53: "Mưa phùn vừa",
    55: "Mưa phùn nặng",
    61: "Mưa nhẹ",
    63: "Mưa vừa",
    65: "Mưa to",
    71: "Tuyết rơi nhẹ",
    73: "Tuyết rơi vừa",
    75: "Tuyết rơi nhiều",
    80: "Mưa rào nhẹ",
    81: "Mưa rào vừa",
    82: "Mưa rào mạnh",
    95: "Giông bão nhẹ",
    96: "Giông bão vừa",
    99: "Giông bão mạnh",
  };
  return weatherDescriptions[code] || "Không rõ thời tiết";
};

function Home() {
  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState({ temp: "...", description: "Đang tải" });
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    light: "--"
  });
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [user, setUser] = useState(null);
  // Kết nối đến Adafruit và lắng nghe dữ liệu
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const initConnection = async () => {
      const connected = await connectToAdafruit();
      setConnectionStatus(connected);

      if (connected) {
        // Lấy dữ liệu hiện tại
        const currentData = getCurrentData();
        setSensorData({
          temperature: currentData.temperature,
          humidity: currentData.humidity,
          light: currentData.light
        });
      }
    };

    initConnection();
  }, []);

  // Lắng nghe sự thay đổi của dữ liệu cảm biến
  useEffect(() => {
    const tempUnsub = onTemperatureChange((value) => {
      setSensorData(prev => ({ ...prev, temperature: value }));
    });

    const humidityUnsub = onHumidityChange((value) => {
      setSensorData(prev => ({ ...prev, humidity: value }));
    });

    const lightUnsub = onLightChange((value) => {
      setSensorData(prev => ({ ...prev, light: value }));
    });

    return () => {
      tempUnsub();
      humidityUnsub();
      lightUnsub();
    };
  }, []);

  // Lấy vị trí và thông tin thời tiết hiện tại
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Lấy tên địa điểm
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.address.city || data.address.town || "Không xác định");
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation("Không thể lấy tên địa điểm");
          }

          // Lấy thông tin thời tiết
          const weatherData = await fetchWeather(latitude, longitude);
          setWeather(weatherData);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Không thể lấy vị trí");
          setWeather({ temp: "--", description: "Không có dữ liệu" });
        }
      );
    } else {
      setLocation("Trình duyệt không hỗ trợ định vị");
    }
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-[#2E59BE] text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-poppins-bold text-center">Yolo:Home</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Weather Card */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-poppins-semi-bold">
                {user ? `Xin chào, ${user.name}!` : 'Xin chào!'}
              </h2>
              <p className="text-gray-600">{getCurrentDate()}</p>
              <p className="text-gray-600">{location}</p>
              <p className="mt-2 text-sm">
                {connectionStatus ? (
                  <span className="text-green-500 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Đã kết nối đến Adafruit IO
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Chưa kết nối đến Adafruit IO
                  </span>
                )}
              </p>

              {!connectionStatus && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Tải lại trang
                </button>
              )}
            </div>

            <div className="flex items-center">
              <div className="text-right mr-4">
                <p className="text-4xl font-poppins-bold">{weather.temp}</p>
                <p className="text-gray-600">{weather.description}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Image
                  src={Weather}
                  alt="Weather"
                  width={50}
                  height={50}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <h2 className="text-2xl font-poppins-semi-bold mb-4">Dữ liệu cảm biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SensorCard
            icon={Temperature}
            value={sensorData.temperature}
            title="Nhiệt độ"
            unit="°C"
            bgColorClass={
              sensorData.temperature < 20
                ? "bg-blue-50"
                : sensorData.temperature < 30
                ? "bg-green-50"
                : "bg-red-50"
            }
            iconColorClass={
              sensorData.temperature < 20
                ? "bg-blue-100"
                : sensorData.temperature < 30
                ? "bg-green-100"
                : "bg-red-100"
            }
          />

          <SensorCard
            icon={Water}
            value={sensorData.humidity}
            title="Độ ẩm"
            unit="%"
            bgColorClass={
              sensorData.humidity < 40
                ? "bg-yellow-50"
                : sensorData.humidity < 70
                ? "bg-blue-50"
                : "bg-blue-100"
            }
            iconColorClass={
              sensorData.humidity < 40
                ? "bg-yellow-100"
                : sensorData.humidity < 70
                ? "bg-blue-100"
                : "bg-blue-200"
            }
          />

          <SensorCard
            icon={Light}
            value={sensorData.light}
            title="Ánh sáng"
            unit="lux"
            bgColorClass={
              sensorData.light < 30
                ? "bg-gray-50"
                : sensorData.light < 70
                ? "bg-yellow-50"
                : "bg-yellow-100"
            }
            iconColorClass={
              sensorData.light < 30
                ? "bg-gray-200"
                : sensorData.light < 70
                ? "bg-yellow-100"
                : "bg-yellow-200"
            }
          />
        </div>
      </div>

      <Navigation />
    </main>
  );
}

// Wrap Home component với AuthProtector để đảm bảo người dùng đã đăng nhập
import AuthProtector from "./components/AuthProtector";
export default function ProtectedHome() {
  return (
    <AuthProtector>
      <Home />
    </AuthProtector>
  );
}
