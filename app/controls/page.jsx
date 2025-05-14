"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Controls from "../components/Controls";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { connectToAdafruit } from "@/app/utils/adafruit";
import { getCurrentUser, logout, isAuthenticated } from "@/app/utils/auth";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ControlsPage() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState(false);
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

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-[#2E59BE] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="w-10 md:w-24"></div>
          <h1 className="text-3xl font-poppins-bold">Điều khiển thiết bị</h1>
          
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
              Chưa kết nối đến Adafruit IO. Vui lòng kiểm tra kết nối mạng và tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Tải lại trang
            </button>
          </div>
        )}

        {/* Component điều khiển */}
        <Controls />
      </div>

      <Navigation />
    </main>
  );
};

// Wrap ControlsPage component với AuthProtector để đảm bảo người dùng đã đăng nhập
import AuthProtector from "../components/AuthProtector";
export default function ProtectedControlsPage() {
  return (
    <AuthProtector>
      <ControlsPage />
    </AuthProtector>
  );
}
