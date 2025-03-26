import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TicketTrendLineChart = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Extract unique years from data
  const uniqueYears = [...new Set(data.map((item) => item.year))];

  // Filter and sort data based on the selected year
  const filteredData = data
    .filter((item) => item.year === selectedYear)
    .sort(
      (a, b) =>
        monthOrder.indexOf(a.month.trim()) - monthOrder.indexOf(b.month.trim())
    );

  return (
    <div className="w-full">
      {/* Year Selection Dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">Select Year:</label>
        <select
          className="border p-2 rounded-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={100}
          height={400}
          data={filteredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="open" stroke="#8884d8" />
          <Line type="monotone" dataKey="closed" stroke="#82ca9d" />
          <Line type="monotone" dataKey="assigned" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketTrendLineChart;
