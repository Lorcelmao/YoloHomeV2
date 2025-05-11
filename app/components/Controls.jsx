"use client";

import React, { useState, useEffect } from "react";
import { controlLight, controlFan, onLightStateChange, onFanSpeedChange } from "@/app/utils/adafruit";

const Controls = () => {
  const [lightState, setLightState] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Lắng nghe sự thay đổi từ Adafruit
  useEffect(() => {
    const lightUnsub = onLightStateChange((state) => {
      setLightState(state);
    });

    const fanUnsub = onFanSpeedChange((speed) => {
      setFanSpeed(speed);
    });

    return () => {
      lightUnsub();
      fanUnsub();
    };
  }, []);

  // Xử lý bật/tắt đèn
  const handleLightToggle = async () => {
    setIsSending(true);
    setFeedbackMessage("Đang gửi lệnh...");

    try {
      const newState = !lightState;
      const success = await controlLight(newState);

      if (success) {
        setLightState(newState);
        setFeedbackMessage(`Đèn đã ${newState ? "BẬT" : "TẮT"}`);
      } else {
        setFeedbackMessage("Lỗi kết nối! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển đèn:", error);
      setFeedbackMessage("Đã xảy ra lỗi!");
    } finally {
      setTimeout(() => {
        setIsSending(false);
        setTimeout(() => setFeedbackMessage(""), 3000);
      }, 500);
    }
  };

  // Xử lý thay đổi tốc độ quạt
  const handleFanSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    setFanSpeed(newSpeed);
  };

  // Gửi lệnh điều khiển quạt
  const applyFanSpeed = async () => {
    setIsSending(true);
    setFeedbackMessage("Đang gửi lệnh...");

    try {
      const success = await controlFan(fanSpeed);

      if (success) {
        setFeedbackMessage(`Đã đặt tốc độ quạt: ${fanSpeed}%`);
      } else {
        setFeedbackMessage("Lỗi kết nối! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển quạt:", error);
      setFeedbackMessage("Đã xảy ra lỗi!");
    } finally {
      setTimeout(() => {
        setIsSending(false);
        setTimeout(() => setFeedbackMessage(""), 3000);
      }, 500);
    }
  };

  // Cài đặt nhanh tốc độ quạt
  const handleFanPreset = async (speed) => {
    setIsSending(true);
    setFeedbackMessage("Đang gửi lệnh...");

    try {
      // Đặt giá trị trong state
      setFanSpeed(speed);

      // Gửi trực tiếp đến Adafruit thay vì đợi state cập nhật
      const success = await controlFan(speed);

      if (success) {
        setFeedbackMessage(`Đã đặt tốc độ quạt: ${speed}%`);
      } else {
        setFeedbackMessage("Lỗi kết nối! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi điều khiển quạt:", error);
      setFeedbackMessage("Đã xảy ra lỗi!");
    } finally {
      setTimeout(() => {
        setIsSending(false);
        setTimeout(() => setFeedbackMessage(""), 3000);
      }, 500);
    }
  };

  // Cập nhật hiển thị thanh trượt
  const getSliderBackground = () => {
    const percentage = (fanSpeed / 100) * 100;
    return `linear-gradient(to right, #2E59BE ${percentage}%, #e5e7eb ${percentage}%)`;
  };

  return (
    <div className="space-y-8">
      {/* Thông báo phản hồi */}
      {feedbackMessage && (
        <div className="relative px-4 py-3 bg-blue-100 text-blue-700 rounded-lg mb-4 text-center animate-fadeIn">
          {isSending ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              {feedbackMessage}
            </div>
          ) : (
            <>{feedbackMessage}</>
          )}
        </div>
      )}

      {/* Điều khiển đèn */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-poppins-semi-bold mb-4">Điều khiển đèn</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-poppins-medium">Trạng thái:</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-poppins-medium ${lightState ? "text-green-500" : "text-red-500"}`}>
              {lightState ? "Đang bật" : "Đang tắt"}
            </span>
            <button
              onClick={handleLightToggle}
              disabled={isSending}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                lightState
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {lightState ? "Tắt đèn" : "Bật đèn"}
            </button>
          </div>
        </div>
      </div>

      {/* Điều khiển quạt */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-poppins-semi-bold mb-4">Điều khiển quạt</h2>

        {/* Thanh trượt điều khiển tốc độ */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-poppins-medium">Tốc độ quạt:</span>
            <span className="text-lg font-poppins-bold text-blue-600">{fanSpeed}%</span>
          </div>

          <div className="relative h-2 rounded-lg bg-gray-200 mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={fanSpeed}
              onChange={handleFanSpeedChange}
              className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute h-full rounded-lg transition-all duration-300"
              style={{
                width: `${fanSpeed}%`,
                background: "#2E59BE"
              }}
            ></div>
          </div>

          <button
            onClick={applyFanSpeed}
            disabled={isSending}
            className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Áp dụng
          </button>
        </div>

        {/* Nút cài đặt nhanh */}
        <div>
          <h3 className="text-lg font-poppins-medium mb-2">Cài đặt nhanh:</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleFanPreset(0)}
              disabled={isSending}
              className={`py-2 rounded transition-all ${
                fanSpeed === 0
                  ? "bg-blue-100 text-blue-600 font-poppins-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Tắt
            </button>
            <button
              onClick={() => handleFanPreset(25)}
              disabled={isSending}
              className={`py-2 rounded transition-all ${
                fanSpeed === 25
                  ? "bg-blue-100 text-blue-600 font-poppins-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              25%
            </button>
            <button
              onClick={() => handleFanPreset(50)}
              disabled={isSending}
              className={`py-2 rounded transition-all ${
                fanSpeed === 50
                  ? "bg-blue-100 text-blue-600 font-poppins-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              50%
            </button>
            <button
              onClick={() => handleFanPreset(100)}
              disabled={isSending}
              className={`py-2 rounded transition-all ${
                fanSpeed === 100
                  ? "bg-blue-100 text-blue-600 font-poppins-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              100%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
