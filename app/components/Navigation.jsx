"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Home from "../public/icons/home.svg";
import Chart from "../public/icons/weather.svg";
import Control from "../public/icons/setting.svg";

const Navigation = () => {
  const pathname = usePathname();

  // Refs cho các nút điều hướng
  const homeRef = useRef(null);
  const chartRef = useRef(null);
  const controlRef = useRef(null);
  const indicatorRef = useRef(null);

  const [initialized, setInitialized] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  // Cập nhật vị trí của indicator dựa vào nút đang được chọn
  useEffect(() => {
    if (
      homeRef.current &&
      chartRef.current &&
      controlRef.current &&
      indicatorRef.current
    ) {
      let activeElement = null;

      if (isActive("/")) {
        activeElement = homeRef.current;
      } else if (isActive("/charts")) {
        activeElement = chartRef.current;
      } else if (isActive("/controls")) {
        activeElement = controlRef.current;
      }

      if (activeElement) {
        const elementRect = activeElement.getBoundingClientRect();
        const containerRect = activeElement.parentElement.getBoundingClientRect();

        indicatorRef.current.style.width = `${elementRect.width}px`;
        indicatorRef.current.style.transform = `translateX(${
          elementRect.left - containerRect.left
        }px)`;

        if (!initialized) {
          setTimeout(() => {
            indicatorRef.current.style.opacity = "1";
            setInitialized(true);
          }, 50);
        }
      }
    }
  }, [pathname, initialized]);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 scale-in">
      <div className="bg-white rounded-full shadow-lg flex items-center justify-between p-3 px-6 gap-6 md:gap-10 relative">
        {/* Indicator animation */}
        <div
          ref={indicatorRef}
          className="nav-indicator"
          style={{
            opacity: 0,
            height: "3px",
            bottom: "10px",
            position: "absolute",
            left: 0,
            background: "#2E59BE",
            borderRadius: "2px",
            transition: "transform 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s",
            zIndex: 1,
          }}
        ></div>

        <Link href="/" className="transition-transform hover:scale-105 duration-300">
          <div
            ref={homeRef}
            className={`flex flex-col items-center ${isActive("/") ? "text-[#2E59BE]" : "text-gray-400"}`}
          >
            <div
              className={`p-3 rounded-full ${
                isActive("/") ? "bg-blue-100" : "bg-gray-100"
              } transition-all duration-300`}
            >
              <Image
                src={Home}
                alt="Home"
                width={isActive("/") ? 26 : 22}
                height={isActive("/") ? 26 : 22}
                className={`${
                  isActive("/") ? "filter brightness-0 invert" : ""
                } transition-all duration-300`}
              />
            </div>
            <span className="text-sm mt-1 font-poppins-medium">Thông tin</span>
          </div>
        </Link>

        <Link href="/charts" className="transition-transform hover:scale-105 duration-300">
          <div
            ref={chartRef}
            className={`flex flex-col items-center ${isActive("/charts") ? "text-[#2E59BE]" : "text-gray-400"}`}
          >
            <div
              className={`p-3 rounded-full ${
                isActive("/charts") ? "bg-blue-100" : "bg-gray-100"
              } transition-all duration-300`}
            >
              <Image
                src={Chart}
                alt="Charts"
                width={isActive("/charts") ? 26 : 22}
                height={isActive("/charts") ? 26 : 22}
                className={`${
                  isActive("/charts") ? "filter brightness-0 invert" : ""
                } transition-all duration-300`}
              />
            </div>
            <span className="text-sm mt-1 font-poppins-medium">Biểu đồ</span>
          </div>
        </Link>

        <Link href="/controls" className="transition-transform hover:scale-105 duration-300">
          <div
            ref={controlRef}
            className={`flex flex-col items-center ${isActive("/controls") ? "text-[#2E59BE]" : "text-gray-400"}`}
          >
            <div
              className={`p-3 rounded-full ${
                isActive("/controls") ? "bg-blue-100" : "bg-gray-100"
              } transition-all duration-300`}
            >
              <Image
                src={Control}
                alt="Controls"
                width={isActive("/controls") ? 26 : 22}
                height={isActive("/controls") ? 26 : 22}
                className={`${
                  isActive("/controls") ? "filter brightness-0 invert" : ""
                } transition-all duration-300`}
              />
            </div>
            <span className="text-sm mt-1 font-poppins-medium">Điều khiển</span>
          </div>
        </Link>
      </div>
      <style jsx global>{`
        .scale-in {
          animation: scaleInNav 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes scaleInNav {
          0% {
            opacity: 0;
            transform: scale(0.85) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;
