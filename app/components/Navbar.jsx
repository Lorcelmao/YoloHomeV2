"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import logo from "@/app/public/icons/logo.svg";
import search from "@/app/public/icons/search.svg";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout, getCurrentUser } from "@/app/utils/auth";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchBarRef = useRef(null);
  const userMenuRef = useRef(null);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserMenu(false);
    router.push("/auth/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    router.push(`/search/${encodedSearchTerm}`);
    setSearchTerm("");
  };

  // Đóng search bar khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowSearchBar(false);
      }
    };

    if (showSearchBar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchBar]);

  // Đóng user menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="bg-white sticky top-0 shadow-md z-50">
      <div className="flex items-center w-full py-3">
        {/* Logo */}
        <div className="pl-5 hover-grow">
          <Link href="/">
            <img src={logo.src} alt="Logo" className="w-30 h-19" />
          </Link>
        </div>

        {/* Navigation Links - Với hiệu ứng hover */}
        <ul className="flex text-[17px] font-poppins-medium space-x-14 justify-center flex-grow text-[#212121]">
          <li className="transition-all duration-300 hover:text-[#2E59BE] relative group">
            <Link href="/san_pham" className="block py-1">Sản phẩm</Link>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E59BE] transition-all duration-300 group-hover:w-full"></div>
          </li>
          <li className="transition-all duration-300 hover:text-[#2E59BE] relative group">
            <Link href="/thong_tin" className="block py-1">Thông tin</Link>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E59BE] transition-all duration-300 group-hover:w-full"></div>
          </li>
          <li className="transition-all duration-300 hover:text-[#2E59BE] relative group">
            <Link href="/ve_greenly" className="block py-1">Về Greenly</Link>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E59BE] transition-all duration-300 group-hover:w-full"></div>
          </li>
        </ul>

        {/* Right Section - Search và Profile */}
        <div className="mr-6 flex items-center space-x-6">
          {/* Search Section */}
          <div className="relative">
            {!showSearchBar ? (
              <img
                src={search.src}
                alt="Search"
                className="w-5 h-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                onClick={() => setShowSearchBar(true)}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex slide-in-right" ref={searchBarRef}>
                <div className="flex justify-end">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    className="text-black py-2 pl-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tìm kiếm sản phẩm..."
                    autoFocus
                  />
                </div>
              </form>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <div
                className="flex items-center cursor-pointer hover-elevate"
                onClick={toggleUserMenu}
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium relative">
                  {user.name.charAt(0).toUpperCase()}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <div className="flex items-center hover-elevate">
                  <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    ?
                  </div>
                </div>
              </Link>
            )}

            {/* User Dropdown Menu với Animation */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-48 py-2 scale-in origin-top-right">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-poppins-medium text-gray-800 truncate">{user?.name || "Khách"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
                <ul>
                  <li className="hover:bg-gray-50 transition-colors duration-200">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700">
                      Hồ sơ cá nhân
                    </Link>
                  </li>
                  <li className="hover:bg-gray-50 transition-colors duration-200">
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700">
                      Cài đặt
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 mt-1 pt-1 hover:bg-gray-50 transition-colors duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
