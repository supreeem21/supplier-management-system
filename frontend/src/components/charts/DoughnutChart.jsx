import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { useState, useEffect } from "react";

function generateColors(count, alpha) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 * i) / count); // spread hues evenly
    colors.push(`hsla(${hue}, 70%, 50%, ${alpha})`);
  }
  return colors;
}

function DoughnutChart() {
  const [category, setCategory] = useState([]);
  const numberOfCategory = category.length;

  const token = localStorage.getItem("token");

  const doughnutData = {
    labels: category.map((categoryName) => categoryName._id),
    datasets: [
      {
        data: category.map((categoryCount) => categoryCount.count),
        backgroundColor: generateColors(numberOfCategory, 0.5),
        hoverBackgroundColor: generateColors(numberOfCategory, 0.9),
        borderWidth: 0,
        hoverOffset: 25,
      },
    ],
  };

  const doughnutOptions = {
    animation: {
      duration: 500,
      loop: false
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Categories",
        font: {
          size: 24,

        }
      },
      legend: {
        position: "left",
        labels: {
          boxWidth: 20,
          maxHeight: 200, 
        },
      },
      tooltip: { enabled: true },
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.raw;
          return `${label}: ${value}`;
        },
      },
    },
  };

  const loadData = async () => {
    
    const response = await axios.get(
      "http://localhost:5000/admin/product-category-count",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
    );
    setCategory(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Doughnut
        key="doughnut-chart"
        data={doughnutData}
        options={doughnutOptions}
      />
    </>
  );
}

export default DoughnutChart;
