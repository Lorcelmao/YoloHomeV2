"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/app/components/AuthLayout";
import FormInput from "@/app/components/FormInput";
import { login, isAuthenticated, loginWithFace } from "@/app/utils/auth";
import FaceCamera from "@/app/components/FaceCamera";
import { recognizeUser } from "@/app/utils/faceRecognition";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showFaceLogin, setShowFaceLogin] = useState(false);
  const [faceLoginStatus, setFaceLoginStatus] = useState("");

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Xóa lỗi đăng nhập khi người dùng thay đổi thông tin
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    try {
      await login(formData.username, formData.password);
      router.push("/");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFaceLogin = () => {
    setShowFaceLogin(!showFaceLogin);
    setFaceLoginStatus("");
  };

  const handleFaceCapture = async (faceData) => {
    if (!faceData || !faceData.descriptor) {
      setFaceLoginStatus("Không thể phát hiện khuôn mặt, vui lòng thử lại.");
      return;
    }

    setIsLoading(true);
    setFaceLoginStatus("Đang nhận diện khuôn mặt...");

    try {
      // Thực hiện nhận diện khuôn mặt
      const recognitionResult = await recognizeUser({ descriptor: faceData.descriptor });

      if (!recognitionResult.success) {
        setFaceLoginStatus(recognitionResult.message || "Không nhận diện được khuôn mặt");
        setIsLoading(false);
        return;
      }

      // Đăng nhập với ID người dùng
      await loginWithFace(recognitionResult.userId);
      setFaceLoginStatus("Đăng nhập thành công!");

      // Điều hướng sang trang chủ
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setFaceLoginStatus(`Lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập vào Yolo:Home"
      footer={
        <p>
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </p>
      }
    >
      {showFaceLogin ? (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Đăng nhập bằng khuôn mặt</h2>
            <p className="text-sm text-gray-600 mt-1">Đặt khuôn mặt của bạn vào khung hình</p>
          </div>

          {faceLoginStatus && (
            <div className={`p-4 rounded-md mb-4 ${
              faceLoginStatus.includes("thành công")
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500"
            }`}>
              <p>{faceLoginStatus}</p>
            </div>
          )}

          <FaceCamera
            onCapture={handleFaceCapture}
            mode="login"
            width={400}
            height={300}
          />

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={toggleFaceLogin}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={isLoading}
            >
              Quay lại đăng nhập với mật khẩu
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 text-sm">{loginError}</p>
            </div>
          )}

          <FormInput
            id="username"
            name="username"
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span>Google</span>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span>Facebook</span>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={toggleFaceLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  <span>Khuôn mặt</span>
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Tài khoản demo: <span className="font-bold">demo123</span> (mật khẩu bất kỳ)</p>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
