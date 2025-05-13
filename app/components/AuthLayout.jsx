"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";

const AuthLayout = ({ title, children, footer }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo và tiêu đề */}
        <div className="text-center">
          <h1 className="text-3xl font-poppins-bold text-[#2E59BE] mb-2">Yolo:Home</h1>
          <h2 className="mt-6 text-2xl font-poppins-semi-bold text-gray-900">{title}</h2>
        </div>
      </div>

      {/* Card chứa form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-2xl sm:px-10 border border-gray-200">
          {children}
        </div>

        {/* Footer của form */}
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node
};

export default AuthLayout;
