import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";

const lineOptions = {
  animations: {
    tension: {
      duration: 1000,
      easing: "easeOutQuart",
      from: 1,
      to: 0,
      loop: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    tooltip: { enabled: true },
  },
};

function LineChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const token = localStorage.getItem("token");

  const getYearlyRevenue = async () => {
    try {
      if (!token) {
        toast.error("No token found");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/admin/yearlyRevenue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.revenue;

      // sort by year (optional but recommended)
      const sortedData = data.sort((a, b) => a._id - b._id);

      const labels = sortedData.map((item) => item._id);
      const revenue = sortedData.map((item) => item.totalRevenue);

      setChartData({
        labels,
        datasets: [
          {
            label: "Yearly Revenue",
            data: revenue,
            fill: true,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      console.log("Yearly revenue error:", err);
      toast.error("Error fetching revenue");
    }
  };

  useEffect(() => {
    getYearlyRevenue();
  }, []);

  return <Line data={chartData} options={lineOptions} />;
}

export default LineChart;