import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ScoreData } from '../types/demo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RealtimeChartProps {
  data: ScoreData[];
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d, i) => `${i*5}s`),
    datasets: [
      {
        label: 'Score',
        data: data.map(d => d.score),
        borderColor: '#00D9FF',
        backgroundColor: 'rgba(0, 217, 255, 0.2)',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Donations',
        data: data.map(d => d.donationAmount),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 0,
        stepped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#00D9FF', font: { size: 10 } },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: { color: '#FFD700', font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuart' as const,
    },
  };

  return <Line options={options} data={chartData} />;
};

export default RealtimeChart;
