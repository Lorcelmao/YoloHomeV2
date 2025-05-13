"use client";

import * as faceapi from 'face-api.js';

// Khởi tạo các model
let modelsLoaded = false;
let faceMatcher = null;

/**
 * Load các model cần thiết cho face-api.js
 */
export const loadModels = async () => {
  if (modelsLoaded) return;

  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/weights'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/weights')
    ]);
    modelsLoaded = true;
    console.log('Face-api models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
};

/**
 * Nhận diện khuôn mặt từ ảnh
 * @param {HTMLImageElement|HTMLVideoElement} imageOrVideo - Element chứa hình ảnh hoặc video
 * @returns {Promise<faceapi.WithFaceLandmarks<faceapi.WithFaceDescriptor<faceapi.WithFaceDetection<{}>>[]}
 */
export const detectFace = async (imageOrVideo) => {
  if (!modelsLoaded) await loadModels();

  try {
    // Sử dụng SSD MobileNet với tham số rõ ràng để ổn định hơn
    const detections = await faceapi
      .detectAllFaces(imageOrVideo, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  } catch (error) {
    console.error('Error detecting face:', error);
    throw error;
  }
};

/**
 * Lưu khuôn mặt người dùng
 * @param {string} userId - ID của người dùng
 * @param {Float32Array} faceDescriptor - Mô tả khuôn mặt
 */
export const saveFaceDescriptor = (userId, faceDescriptor) => {
  try {
    // Lấy các khuôn mặt đã lưu từ localStorage
    const savedFaces = JSON.parse(localStorage.getItem('face_data') || '{}');

    // Chuyển đổi Float32Array thành mảng thông thường để có thể lưu vào localStorage
    savedFaces[userId] = Array.from(faceDescriptor);

    // Lưu trở lại vào localStorage
    localStorage.setItem('face_data', JSON.stringify(savedFaces));

    // Làm mới face matcher
    resetFaceMatcher();

    return true;
  } catch (error) {
    console.error('Error saving face descriptor:', error);
    return false;
  }
};

/**
 * Tải face matcher với khuôn mặt đã lưu
 */
export const loadFaceMatcher = async () => {
  if (!modelsLoaded) await loadModels();

  if (faceMatcher) return faceMatcher;

  try {
    const savedFaces = JSON.parse(localStorage.getItem('face_data') || '{}');
    const labeledDescriptors = [];

    for (const userId in savedFaces) {
      if (Object.prototype.hasOwnProperty.call(savedFaces, userId)) {
        // Chuyển đổi mảng thông thường thành Float32Array
        const descriptor = new Float32Array(savedFaces[userId]);
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(userId, [descriptor])
        );
      }
    }

    if (labeledDescriptors.length > 0) {
      faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // 0.6 là ngưỡng khoảng cách
      return faceMatcher;
    }

    return null;
  } catch (error) {
    console.error('Error loading face matcher:', error);
    return null;
  }
};

/**
 * Làm mới face matcher
 */
export const resetFaceMatcher = () => {
  faceMatcher = null;
};

/**
 * Nhận diện người dùng từ khuôn mặt
 * @param {HTMLImageElement|HTMLVideoElement|Object} input - Element chứa hình ảnh/video hoặc đối tượng chứa descriptor
 * @returns {Promise<Object>} - Kết quả nhận diện khuôn mặt
 */
export const recognizeUser = async (input) => {
  try {
    let faceDescriptor;

    // Kiểm tra xem input có phải là descriptor trực tiếp không
    if (input && input.descriptor) {
      // Trường hợp truyền vào đối tượng có descriptor
      faceDescriptor = input.descriptor;
    } else {
      // Trường hợp truyền vào element HTML (video, image, canvas)
      const detections = await detectFace(input);

      if (detections.length === 0) {
        return { success: false, message: 'Không phát hiện khuôn mặt' };
      }

      if (detections.length > 1) {
        return { success: false, message: 'Chỉ được phép một khuôn mặt trong khung hình' };
      }

      faceDescriptor = detections[0].descriptor;
    }

    const matcher = await loadFaceMatcher();

    if (!matcher) {
      return { success: false, message: 'Chưa có dữ liệu khuôn mặt nào được lưu' };
    }

    const result = matcher.findBestMatch(faceDescriptor);

    if (result.label === 'unknown') {
      return { success: false, message: 'Không nhận diện được khuôn mặt' };
    }

    return { success: true, userId: result.label, distance: result.distance };
  } catch (error) {
    console.error('Error recognizing face:', error);
    return { success: false, message: 'Lỗi khi nhận diện khuôn mặt: ' + error.message };
  }
};

/**
 * Kiểm tra xem một userId đã có khuôn mặt được lưu chưa
 * @param {string} userId - ID của người dùng
 * @returns {boolean} - true nếu đã có, false nếu chưa
 */
export const hasFaceData = (userId) => {
  try {
    const savedFaces = JSON.parse(localStorage.getItem('face_data') || '{}');
    return savedFaces[userId] !== undefined;
  } catch (error) {
    console.error('Error checking face data:', error);
    return false;
  }
};

/**
 * Xóa dữ liệu khuôn mặt của một người dùng
 * @param {string} userId - ID của người dùng
 * @returns {boolean} - true nếu xóa thành công, false nếu không
 */
export const deleteFaceData = (userId) => {
  try {
    const savedFaces = JSON.parse(localStorage.getItem('face_data') || '{}');
    if (savedFaces[userId]) {
      delete savedFaces[userId];
      localStorage.setItem('face_data', JSON.stringify(savedFaces));
      resetFaceMatcher();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting face data:', error);
    return false;
  }
};
