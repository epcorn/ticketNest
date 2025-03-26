/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getStatusCount } from "../redux/creater/createrSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const COLOR_MAP = {
  Open: "#FF76CE",
  Assigned: "#00C49F", // Green
  Closed: "#FFBB28", // Yellow
  Canceled: "#FF0000", // Crimson
};

const TicketStatusAssign = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fn() {
      const a1 = await dispatch(getStatusCount());
      const result = unwrapResult(a1);
      setData(result.data);
    }
    fn();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={20}
          outerRadius={30}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            // Use the COLOR_MAP to get the color for each entry based on the name
            <Cell
              key={`cell-${index}`}
              fill={COLOR_MAP[entry.name] || "#8884d8"}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TicketStatusAssign;
