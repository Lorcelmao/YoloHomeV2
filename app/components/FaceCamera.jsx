"use client";

import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels } from '@/app/utils/faceRecognition';

const FaceCamera = ({ onCapture, mode = 'register', width = 400, height = 300 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [detection, setDetection] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);

  // Khởi tạo các model
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadModels();
        setModelsReady(true);
      } catch (err) {
        setError('Không thể khởi tạo các model nhận diện khuôn mặt');
        console.error(err);
      }
    };

    initModels();

    return () => {
      // Dọn dẹp stream khi component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Khởi tạo camera khi models đã sẵn sàng
  useEffect(() => {
    if (!modelsReady) return;

    const startVideo = async () => {
      try {
        setError('');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsReady(true);
        }
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setError('Vui lòng cấp quyền truy cập camera để tiếp tục');
        } else {
          setError('Không thể kết nối với camera. Vui lòng thử lại.');
        }
        console.error(err);
      }
    };

    startVideo();
  }, [modelsReady, width, height]);

  // Phát hiện khuôn mặt theo thời gian thực
  useEffect(() => {
    if (!isReady || !modelsReady) return;

    let frameId;

    const detectFaceInRealTime = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
        // Đặt kích thước canvas bằng với video
        const videoEl = videoRef.current;
        const canvas = canvasRef.current;
        const displaySize = { width: videoEl.videoWidth, height: videoEl.videoHeight };

        // Match size của canvas với video
        faceapi.matchDimensions(canvas, displaySize);

        try {
          // Phát hiện khuôn mặt với tham số rõ ràng
          const detections = await faceapi
            .detectAllFaces(videoEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          // Hiển thị kết quả
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          // Xóa canvas trước mỗi lần vẽ mới
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

          // Vẽ hộp và landmarks lên khuôn mặt phát hiện được
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // Lưu lại thông tin phát hiện
          if (resizedDetections.length > 0) {
            setDetection(resizedDetections[0]);
          } else {
            setDetection(null);
          }
        } catch (err) {
          console.error('Error during face detection:', err);
        }

        // Lặp lại quá trình phát hiện
        frameId = requestAnimationFrame(detectFaceInRealTime);
      } else {
        frameId = requestAnimationFrame(detectFaceInRealTime);
      }
    };

    detectFaceInRealTime();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isReady, modelsReady]);

  // Chụp khuôn mặt hiện tại
  const handleCapture = () => {
    if (!detection) {
      setError('Vui lòng đảm bảo có một khuôn mặt trong khung hình');
      return;
    }

    if (detection) {
      onCapture({
        descriptor: detection.descriptor,
        detection: detection.detection,
        landmarks: detection.landmarks
      });
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <video
          ref={videoRef}
          className="w-full"
          autoPlay
          playsInline
          muted
          style={{
            width,
            height,
            transform: 'scaleX(-1)',
            visibility: isReady ? 'visible' : 'hidden'
          }}
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-10"
          style={{
            width,
            height,
            transform: 'scaleX(-1)'
          }}
        />

        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {!modelsReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 opacity-90">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-600">Đang tải các model nhận diện khuôn mặt...</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={handleCapture}
          disabled={!detection || !isReady}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${(!detection || !isReady) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`
          }
        >
          {mode === 'register' ? 'Lưu khuôn mặt' : 'Đăng nhập bằng khuôn mặt'}
        </button>
      </div>

      <div className="mt-2 text-center text-sm text-gray-500">
        {!detection && isReady && (
          <p>Đặt khuôn mặt vào giữa khung hình và nhìn thẳng vào camera</p>
        )}
        {detection && (
          <p className="text-green-600">Đã phát hiện khuôn mặt! Bạn có thể tiếp tục.</p>
        )}
      </div>
    </div>
  );
};

export default FaceCamera;
