import TicketTrendLineChart from "../components/TicketTrendLineChart";
import TicketPieChart from "../components/TicketStatusPieChart";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getInsectsCount,
  getJobs,
  getMonthlyStatusCount,
  getServiceCount,
  getStatusAvg,
  getStatusCount,
} from "../redux/creater/createrSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import PestBarChart from "../components/PestBarChart";
import { FaChartLine, FaChartPie, FaBug, FaTools } from "react-icons/fa";
import { TicketTrendYearly, TodayJobTable } from "../components";

export default function Home() {
  const dispatch = useDispatch();
  const [statusCount, setStatusCount] = useState([]);
  const [monthlyCount, setMonthlyCount] = useState([]);
  const [insectsCount, setInsectsCount] = useState([]);
  const [serviceCount, setServiceCount] = useState([]);
  const [yearlyCount, setYearlyCount] = useState([]);
  const [todaysJob, setTodaysJob] = useState([]);
  const [tomorrowJob, setTomorrowJob] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [statusAvg, setStatusAvg] = useState({});

  useEffect(() => {
    async function get() {
      const a1 = await dispatch(getStatusCount());
      const a2 = await dispatch(getMonthlyStatusCount());
      const a3 = await dispatch(getInsectsCount());
      const a4 = await dispatch(getServiceCount());
      const a5 = await dispatch(getStatusAvg());
      const jobData = await dispatch(getJobs());
      const r1 = unwrapResult(a1);
      const r2 = unwrapResult(a2);
      const r3 = unwrapResult(a3);
      const r4 = unwrapResult(a4);
      const r5 = unwrapResult(a5);
      const jobDataResult = unwrapResult(jobData);
      setStatusCount(r1.data);
      setMonthlyCount(r2.monthlyTicketStatus);
      setYearlyCount(r2.yearlyData);
      setInsectsCount(r3.data);
      setServiceCount(r4.data);
      setStatusAvg(r5.data);
      setTodaysJob(jobDataResult.today);
      setTomorrowJob(jobDataResult.tomorrow);
    }
    get();
  }, [dispatch]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
        Dashboard Analytics
      </h1>
      <TodayJobTable heading="Today's" data={todaysJob} />
      <TodayJobTable heading="Tomorrow's" data={tomorrowJob} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center">
            <FaChartLine className="mr-2 text-indigo-500" /> Ticket Trend
          </h2>
          <div className="p-6">
            <TicketTrendLineChart data={monthlyCount} />
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center">
            <FaChartPie className="mr-2 text-indigo-500" /> Ticket Status
          </h2>
          <div className="p-6">
            <TicketPieChart data={statusCount} />
          </div>
        </div>
        <div className="lg:col-span-6 bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center">
            <FaBug className="mr-2 text-indigo-500" /> Insect Distribution
          </h2>
          <div className="p-6">
            <PestBarChart data={insectsCount} />
          </div>
        </div>
        <div className="lg:col-span-6 bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center">
            <FaTools className="mr-2 text-indigo-500" /> Service Distribution
          </h2>
          <div className="p-6">
            <PestBarChart data={serviceCount} />
          </div>
        </div>
      </div>

      {yearlyCount.length > 0 && (
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 mt-3">
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center">
            <FaChartLine className="mr-2 text-indigo-500" /> Ticket Creation
            Trend
          </h2>
          <div className="p-6">
            <TicketTrendYearly ticketData={yearlyCount} />
          </div>
        </div>
      )}
    </div>
  );
}
