"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Controls from "../components/Controls";
import { connectToAdafruit } from "@/app/utils/adafruit";

function ControlsPage() {
  const [connectionStatus, setConnectionStatus] = useState(false);

  // Kết nối đến Adafruit khi component được mount
  useEffect(() => {
    const initConnection = async () => {
      const connected = await connectToAdafruit();
      setConnectionStatus(connected);
    };

    initConnection();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-[#2E59BE] text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-poppins-bold text-center">Điều khiển thiết bị</h1>
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
