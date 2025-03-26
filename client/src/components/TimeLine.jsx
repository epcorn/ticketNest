import { Timeline } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCalendar } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { getTicket } from "../redux/assigner/assignerSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "./Loading";

// eslint-disable-next-line react/prop-types
export default function TimeLine({ ticketId }) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetcher() {
      try {
        const resultAction = await dispatch(getTicket(ticketId));
        const result = unwrapResult(resultAction);
        setHistory(result.ticket.history.changes);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching completes
      }
    }

    fetcher();
  }, [dispatch, ticketId]);

  const formatTimestamp = (timestamp) => {
    const utcTimestamp = new Date(timestamp);
    const indianTimezone = "Asia/Kolkata";
    const indianTimestamp = utcTimestamp.toLocaleString("en-IN", {
      timeZone: indianTimezone,
    });
    return indianTimestamp;
  };

  return (
    <Timeline verticle>
      {loading && <Loading />}
      {history.length > 0 &&
        history.map((change, idx) => (
          <Timeline.Item key={idx}>
            <Timeline.Point icon={HiCalendar} />
            <Timeline.Content>
              <Timeline.Time>{formatTimestamp(change.timestamp)}</Timeline.Time>
              <Timeline.Title className="border">
                {change.fields.scheduledDate
                  ? "Ticket Rescheduled"
                  : change.message}
              </Timeline.Title>
              {change.fields &&
              change.fields.scheduledDate &&
              change.fields.scheduledTime ? (
                // If scheduledDate and scheduledTime exist in fields
                <Timeline.Body>
                  Old Scheduled Date: {change.fields.scheduledDate}
                  <br />
                  Old Scheduled Time: {change.fields.scheduledTime}
                  <br />
                  Message: {change.message}
                  <br />
                  Author: {change.author}
                </Timeline.Body>
              ) : (
                // Otherwise, default body
                <Timeline.Body>
                  {/* Check if fields are present before accessing them */}
                  {change.fields && (
                    <>
                      Status: {change.fields.status}
                      <br />
                    </>
                  )}
                  Author: {change.author}
                </Timeline.Body>
              )}
            </Timeline.Content>
          </Timeline.Item>
        ))}
    </Timeline>
  );
}
