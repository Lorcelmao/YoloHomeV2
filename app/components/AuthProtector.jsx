"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/utils/auth";
import PropTypes from "prop-types";

const AuthProtector = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [router]);

  return isAuthenticated() ? children : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-pulse w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full mb-4"></div>
      <p className="text-gray-600">Đang kiểm tra xác thực...</p>
    </div>
  );
};

AuthProtector.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProtector;
