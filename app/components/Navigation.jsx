"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Home from "../public/icons/home.svg";
import Chart from "../public/icons/weather.svg";
import Control from "../public/icons/setting.svg";
import { isAuthenticated, logout, getCurrentUser } from "@/app/utils/auth";

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, [pathname]);

  const isActive = (path) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/auth/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };

  return (
    <>
      {showUserMenu && user && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg z-50 w-48 py-2">
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

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-lg flex items-center justify-between p-3 px-6 gap-6 md:gap-10">
          <Link href="/">
            <div className={`flex flex-col items-center ${isActive("/") ? "text-[#2E59BE]" : "text-gray-400"}`}>
              <div className={`p-3 rounded-full ${isActive("/") ? "bg-blue-100" : "bg-gray-100"}`}>
                <Image src={Home} alt="Home" width={22} height={22} />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Dashboard</span>
            </div>
          </Link>

          <Link href="/charts">
            <div className={`flex flex-col items-center ${isActive("/charts") ? "text-[#2E59BE]" : "text-gray-400"}`}>
              <div className={`p-3 rounded-full ${isActive("/charts") ? "bg-blue-100" : "bg-gray-100"}`}>
                <Image src={Chart} alt="Charts" width={22} height={22} />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Charts</span>
            </div>
          </Link>

          <Link href="/controls">
            <div className={`flex flex-col items-center ${isActive("/controls") ? "text-[#2E59BE]" : "text-gray-400"}`}>
              <div className={`p-3 rounded-full ${isActive("/controls") ? "bg-blue-100" : "bg-gray-100"}`}>
                <Image src={Control} alt="Controls" width={22} height={22} />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Controls</span>
            </div>
          </Link>

          {user ? (
            <div
              className="flex flex-col items-center text-gray-400 cursor-pointer"
              onClick={toggleUserMenu}
            >
              <div className="p-3 rounded-full bg-gray-100 relative">
                <div className="w-[22px] h-[22px] rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Tài khoản</span>
            </div>
          ) : (
            <Link href="/auth/login">
              <div className="flex flex-col items-center text-gray-400">
                <div className="p-3 rounded-full bg-gray-100">
                  <div className="w-[22px] h-[22px] rounded-full bg-gray-400 flex items-center justify-center text-white">
                    ?
                  </div>
                </div>
                <span className="text-sm mt-1 font-poppins-medium">Đăng nhập</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
