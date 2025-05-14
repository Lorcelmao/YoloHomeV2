"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const SensorCard = ({ icon, value, title, bgColorClass, iconColorClass, unit, delay = 0 }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`border-2 border-gray-200 ${bgColorClass || 'bg-gray-100'} px-4 py-6 rounded-2xl
        transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]
        slide-up`}
      style={{
        animationDelay: `${delay}ms`,
        transform: isHovering ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovering ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 0px 0px 0 rgba(0, 0, 0, 0)',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between px-6">
        <div
          className={`${iconColorClass || 'bg-[#D9D9D9]'} rounded-full overflow-hidden p-3
          transition-transform duration-500 ${isHovering ? 'rotate-[10deg] scale-110' : ''}`}
        >
          <Image
            src={icon}
            alt={`${title} Icon`}
            width={38}
            height={38}
            priority={true}
            className={`transition-transform duration-500 ${isHovering ? 'scale-110' : ''}`}
          />
        </div>

        <div className="text-4xl font-poppins-bold text-[#2E59BE] transition-all duration-300">
          <span className={`inline-block transition-transform ${isHovering ? 'scale-110 translate-y-[-2px]' : ''}`}>
            {value}
          </span>{" "}
          <span className={`text-2xl transition-opacity ${isHovering ? 'opacity-80' : 'opacity-60'}`}>{unit}</span>
        </div>
      </div>

      <h2 className={`pt-4 title-font font-poppins-semi-bold text-lg
        transition-all duration-300 ${isHovering ? 'text-[#1E3A80]' : 'text-[#2E59BE]'}`}>
        {title}
      </h2>

      <div className={`w-0 h-1 bg-blue-500 rounded transition-all duration-500 ${isHovering ? 'w-full' : ''}`}></div>
    </div>
  );
};

SensorCard.propTypes = {
  icon: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  bgColorClass: PropTypes.string,
  iconColorClass: PropTypes.string,
  unit: PropTypes.string.isRequired,
  delay: PropTypes.number
};

export default SensorCard;
