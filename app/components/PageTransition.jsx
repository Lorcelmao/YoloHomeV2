"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const [nextChildren, setNextChildren] = useState(null);

  useEffect(() => {
    if (children !== currentChildren) {
      setIsAnimating(true);
      setNextChildren(children);

      // Sau khi animation hoàn tất, cập nhật nội dung
      const timer = setTimeout(() => {
        setCurrentChildren(children);
        setNextChildren(null);
        setIsAnimating(false);
      }, 300); // Thời gian cần match với transition-duration trong CSS

      return () => clearTimeout(timer);
    }
  }, [children, currentChildren]);

  return (
    <div className="page-transition-container">
      <div
        className={`page-content ${isAnimating ? 'page-exit' : 'page-enter'}`}
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isAnimating ? currentChildren : (nextChildren || currentChildren)}
      </div>
    </div>
  );
};

export default PageTransition;
