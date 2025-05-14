"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0
  });
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Đảm bảo tính toán sau khi component đã render
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
  }, [isFirstRender]);

  // Cập nhật vị trí indicator khi pathname thay đổi hoặc khi window resize
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;
      
      const activeItem = navRef.current.querySelector(`a[href="${pathname}"] > div`);
      if (activeItem) {
        const navRect = navRef.current.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        
        setIndicatorStyle({
          left: itemRect.left - navRect.left,
          width: itemRect.width,
          opacity: 1
        });
      }
    };

    // Đợi một chút để đảm bảo DOM đã render đầy đủ
    const timer = setTimeout(updateIndicator, 50);
    
    // Cập nhật khi thay đổi kích thước cửa sổ
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [pathname, isFirstRender]);

  // Thêm vào sau các useEffect đã có
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng menu khi click bên ngoài
      if (showUserMenu && !event.target.closest('.profile-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div ref={navRef} className="bg-white rounded-full shadow-lg flex items-center justify-between p-3 px-6 gap-6 md:gap-10 relative">
          {/* Indicator - thanh chỉ báo màu xanh di chuyển */}
          <div 
            className="absolute top-3 bg-blue-100 rounded-full transition-all duration-500 ease-in-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              height: '54px',
              opacity: indicatorStyle.opacity,
              zIndex: 0
            }}
          />

          <Link href="/">
            <div className={`flex flex-col items-center ${isActive("/") ? "text-[#2E59BE]" : "text-gray-400"} transition-colors duration-300 z-10 relative`}>
              <div className={`p-3 rounded-full`}>
                <Image 
                  src={Home} 
                  alt="Home" 
                  width={isActive("/") ? 26 : 22} 
                  height={isActive("/") ? 26 : 22} 
                  className={isActive("/") ? "filter brightness-0 invert" : ""} 
                />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Thông tin</span>
            </div>
          </Link>

          <Link href="/charts">
            <div className={`flex flex-col items-center ${isActive("/charts") ? "text-[#2E59BE]" : "text-gray-400"} transition-colors duration-300 z-10 relative`}>
              <div className={`p-3 rounded-full`}>
                <Image 
                  src={Chart} 
                  alt="Charts" 
                  width={isActive("/charts") ? 26 : 22} 
                  height={isActive("/charts") ? 26 : 22}
                  className={isActive("/charts") ? "filter brightness-0 invert" : ""} 
                />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Biểu đồ</span>
            </div>
          </Link>

          <Link href="/controls">
            <div className={`flex flex-col items-center ${isActive("/controls") ? "text-[#2E59BE]" : "text-gray-400"} transition-colors duration-300 z-10 relative`}>
              <div className={`p-3 rounded-full`}>
                <Image 
                  src={Control} 
                  alt="Controls" 
                  width={isActive("/controls") ? 26 : 22} 
                  height={isActive("/controls") ? 26 : 22}
                  className={isActive("/controls") ? "filter brightness-0 invert" : ""} 
                />
              </div>
              <span className="text-sm mt-1 font-poppins-medium">Điều khiển</span>
            </div>
          </Link>
        </div>
      </div>

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
    </>
  );
};

export default Navigation;
