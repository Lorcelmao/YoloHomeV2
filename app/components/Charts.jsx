"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";
import { fetchHistory, AIO_FEEDS } from "@/app/utils/adafruit";

// Đăng ký các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorChart = ({ sensorType, title, timeRange = 1, color = "#2E59BE" }) => {
  const [chartData, setChartData] = useState({
    labels: ["Đang tải dữ liệu..."],
    datasets: [
      {
        label: title,
        data: [0],
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        tension: 0.3,
        fill: true,
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  // Xác định feed dựa trên loại cảm biến
  const getFeedByType = () => {
    switch (sensorType) {
      case "temperature":
        return AIO_FEEDS.temperature;
      case "humidity":
        return AIO_FEEDS.humidity;
      case "light":
        return AIO_FEEDS.light;
      default:
        return AIO_FEEDS.temperature;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadChartData = async () => {
      try {
        setLoading(true);

        // Số lượng dữ liệu cần lấy dựa trên thời gian
        const dataLimit = timeRange * 24; // 24 điểm dữ liệu mỗi ngày

        // Lấy dữ liệu lịch sử
        const historyData = await fetchHistory(getFeedByType(), dataLimit);

        if (!isMounted) return;

        if (historyData.length === 0) {
          setChartData({
            labels: ["Không có dữ liệu"],
            datasets: [
              {
                ...chartData.datasets[0],
                data: [0],
              },
            ],
          });
          return;
        }

        // Sắp xếp dữ liệu theo thời gian (từ cũ đến mới)
        const sortedData = [...historyData].sort((a, b) =>
          a.timestamp.getTime() - b.timestamp.getTime()
        );

        // Chuẩn bị dữ liệu cho biểu đồ
        const labels = sortedData.map(item =>
          item.timestamp.toLocaleTimeString() + ' ' +
          item.timestamp.toLocaleDateString('vi-VN')
        );

        const values = sortedData.map(item => item.value);

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: values,
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        if (isMounted) {
          setChartData({
            labels: ["Lỗi khi tải dữ liệu"],
            datasets: [
              {
                ...chartData.datasets[0],
                data: [0],
              },
            ],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadChartData();

    return () => {
      isMounted = false;
    };
  }, [sensorType, timeRange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative">
      <h2 className="text-2xl font-poppins-semi-bold mb-4">{title}</h2>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl z-10">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      <div className="h-[300px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: "top" },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;

                      // Thêm đơn vị đo dựa trên loại cảm biến
                      switch (sensorType) {
                        case "temperature":
                          label += " °C";
                          break;
                        case "humidity":
                          label += " %";
                          break;
                        case "light":
                          label += " lux";
                          break;
                      }
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  callback: function(value) {
                    // Thêm đơn vị đo vào trục y
                    switch (sensorType) {
                      case "temperature":
                        return value + " °C";
                      case "humidity":
                        return value + " %";
                      case "light":
                        return value + " lux";
                      default:
                        return value;
                    }
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

SensorChart.propTypes = {
  sensorType: PropTypes.oneOf(["temperature", "humidity", "light"]).isRequired,
  title: PropTypes.string.isRequired,
  timeRange: PropTypes.number,
  color: PropTypes.string
};

export default SensorChart;
