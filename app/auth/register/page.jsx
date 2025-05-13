"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/app/components/AuthLayout";
import FormInput from "@/app/components/FormInput";
import { register, isAuthenticated, isValidEmail } from "@/app/utils/auth";
import FaceCamera from "@/app/components/FaceCamera";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [useFaceAuth, setUseFaceAuth] = useState(false);
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [capturedFace, setCapturedFace] = useState(null);
  const [faceStatus, setFaceStatus] = useState("");

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

    // Xóa lỗi đăng ký khi người dùng thay đổi thông tin
    if (registerError) {
      setRegisterError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Nếu người dùng muốn sử dụng xác thực khuôn mặt nhưng chưa chụp
    if (useFaceAuth && !capturedFace) {
      setShowFaceCapture(true);
      return;
    }

    setIsLoading(true);
    setRegisterError("");

    try {
      await register(
        formData.name,
        formData.username,
        formData.email,
        formData.password,
        capturedFace ? capturedFace.descriptor : null
      );
      router.push("/");
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFaceAuth = () => {
    setUseFaceAuth(!useFaceAuth);
    if (!useFaceAuth) {
      setFaceStatus("");
      setCapturedFace(null);
    }
  };

  const handleFaceCapture = (faceData) => {
    if (!faceData || !faceData.descriptor) {
      setFaceStatus("Không thể nhận diện khuôn mặt, vui lòng thử lại.");
      return;
    }

    setCapturedFace(faceData);
    setFaceStatus("Đã lưu khuôn mặt thành công!");

    setTimeout(() => {
      setShowFaceCapture(false);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Đăng ký tài khoản Yolo:Home"
      footer={
        <p>
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </p>
      }
    >
      {showFaceCapture ? (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Đăng ký khuôn mặt</h2>
            <p className="text-sm text-gray-600 mt-1">Điều này sẽ cho phép bạn đăng nhập bằng khuôn mặt sau này</p>
          </div>

          {faceStatus && (
            <div className={`p-4 rounded-md mb-4 ${
              faceStatus.includes("thành công")
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500"
            }`}>
              <p>{faceStatus}</p>
            </div>
          )}

          <FaceCamera
            onCapture={handleFaceCapture}
            mode="register"
            width={400}
            height={300}
          />

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => {
                setShowFaceCapture(false);
                if (!capturedFace) {
                  setUseFaceAuth(false);
                }
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {capturedFace ? "Quay lại hoàn tất đăng ký" : "Bỏ qua xác thực khuôn mặt"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {registerError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 text-sm">{registerError}</p>
            </div>
          )}

          <FormInput
            id="name"
            name="name"
            label="Họ tên"
            placeholder="Nhập họ tên"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

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
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
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

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với{" "}
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Điều khoản sử dụng
                </Link>
                {" "}và{" "}
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              id="face_auth"
              name="face_auth"
              type="checkbox"
              checked={useFaceAuth}
              onChange={toggleFaceAuth}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="face_auth" className="ml-2 flex items-center text-sm text-gray-700">
              Đăng ký xác thực bằng khuôn mặt
              {capturedFace && (
                <span className="ml-2 text-sm text-green-600 inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Đã lưu
                </span>
              )}
              {useFaceAuth && !capturedFace && (
                <button
                  type="button"
                  onClick={() => setShowFaceCapture(true)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Thêm khuôn mặt
                </button>
              )}
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || (useFaceAuth && !capturedFace && !showFaceCapture)}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${(isLoading || (useFaceAuth && !capturedFace && !showFaceCapture)) ? 'opacity-70 cursor-not-allowed' : ''}
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
              ) : useFaceAuth && !capturedFace ? (
                'Thêm khuôn mặt để tiếp tục'
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
