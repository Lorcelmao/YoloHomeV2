"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import SensorChart from "../components/Charts";
import { connectToAdafruit } from "@/app/utils/adafruit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, isAuthenticated } from "@/app/utils/auth";

const CHART_COLORS = {
  temperature: "#FF6384", // đỏ
  humidity: "#36A2EB",    // xanh dương
  light: "#FFCE56"        // vàng
};

function Charts() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [timeRange, setTimeRange] = useState(1); // 1 ngày mặc định
  const [activeTab, setActiveTab] = useState("all"); // Hiển thị tất cả các biểu đồ
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Kết nối đến Adafruit khi component được mount
  useEffect(() => {
    const initConnection = async () => {
      const connected = await connectToAdafruit();
      setConnectionStatus(connected);
    };

    initConnection();
  }, []);

  // Thêm useEffect để lấy thông tin người dùng
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Thêm useEffect để xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.profile-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Hàm xử lý đăng xuất và hiển thị menu
  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/auth/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };

  // Hiển thị biểu đồ dựa trên tab đang active
  const renderCharts = () => {
    if (activeTab === "all" || activeTab === "temperature") {
      return (
        <SensorChart
          sensorType="temperature"
          title="Biểu đồ nhiệt độ"
          timeRange={timeRange}
          color={CHART_COLORS.temperature}
        />
      );
    }
    return null;
  };

  const renderHumidityChart = () => {
    if (activeTab === "all" || activeTab === "humidity") {
      return (
        <SensorChart
          sensorType="humidity"
          title="Biểu đồ độ ẩm"
          timeRange={timeRange}
          color={CHART_COLORS.humidity}
        />
      );
    }
    return null;
  };

  const renderLightChart = () => {
    if (activeTab === "all" || activeTab === "light") {
      return (
        <SensorChart
          sensorType="light"
          title="Biểu đồ cường độ ánh sáng"
          timeRange={timeRange}
          color={CHART_COLORS.light}
        />
      );
    }
    return null;
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-[#2E59BE] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="w-10 md:w-24"></div>
          <h1 className="text-3xl font-poppins-bold">Biểu đồ</h1>
          
          {/* Profile button */}
          {user ? (
            <div className="relative profile-menu">
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={toggleUserMenu}
              >
                <span className="hidden sm:inline">{user.name}</span>
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium border-2 border-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* User menu dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-48 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-poppins-medium text-gray-800">{user?.name || "Khách"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                  <ul>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <div className="flex items-center gap-2 text-white hover:text-blue-100">
                <span className="hidden sm:inline">Đăng nhập</span>
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white">
                  <span>?</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Trạng thái kết nối */}
        <div className="mb-4">
          <p className="text-sm">
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
        </div>

        {!connectionStatus && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-700">
              Chưa kết nối đến Adafruit IO. Biểu đồ có thể không hiển thị đúng dữ liệu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Tải lại trang
            </button>
          </div>
        )}

        {/* Chọn loại biểu đồ */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-poppins-medium">Hiển thị:</span>
            <div className="flex bg-white rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 ${
                  activeTab === "all"
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab("temperature")}
                className={`px-4 py-2 ${
                  activeTab === "temperature"
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Nhiệt độ
              </button>
              <button
                onClick={() => setActiveTab("humidity")}
                className={`px-4 py-2 ${
                  activeTab === "humidity"
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Độ ẩm
              </button>
              <button
                onClick={() => setActiveTab("light")}
                className={`px-4 py-2 ${
                  activeTab === "light"
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Ánh sáng
              </button>
            </div>
          </div>

          {/* Chọn khoảng thời gian */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-poppins-medium">Thời gian:</span>
            <div className="flex bg-white rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setTimeRange(1)}
                className={`px-4 py-2 ${
                  timeRange === 1
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                1 ngày
              </button>
              <button
                onClick={() => setTimeRange(7)}
                className={`px-4 py-2 ${
                  timeRange === 7
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                7 ngày
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-4 py-2 ${
                  timeRange === 30
                    ? "bg-[#2E59BE] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                30 ngày
              </button>
            </div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="space-y-6">
          {renderCharts()}
          {renderHumidityChart()}
          {renderLightChart()}
        </div>
      </div>

      <Navigation />
    </main>
  );
};

// Wrap Charts component với AuthProtector để đảm bảo người dùng đã đăng nhập
import AuthProtector from "../components/AuthProtector";
export default function ProtectedCharts() {
  return (
    <AuthProtector>
      <Charts />
    </AuthProtector>
  );
}
