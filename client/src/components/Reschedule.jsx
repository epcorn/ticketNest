/* eslint-disable no-unused-vars */
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTicket, reschedule } from "../redux/assigner/assignerSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Loading } from ".";

// eslint-disable-next-line react/prop-types
function Reschedule({ ticketId, onClose }) {
  const dispatch = useDispatch();
  const [ticket, setTicket] = useState();
  const [loading, setLoading] = useState();
  const [changes, setChanges] = useState({
    scheduledDate: "",
    scheduledTime: "",
    message: "",
  });

  function getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
  }
  function handleChages(e) {
    const { name, value } = e.target;
    setChanges((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    async function fetcher() {
      try {
        const resultAction = await dispatch(getTicket(ticketId));
        const result = unwrapResult(resultAction);
        setTicket(result.ticket);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching completes
      }
    }

    fetcher();
  }, [dispatch, ticketId]);

  async function submit() {
    setLoading(true);
    const data = {
      id: ticketId,
      changes: changes,
    };
    const resultAction = await dispatch(reschedule(data));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(resultAction);
    setLoading(false);
    onClose();
  }

  return (
    <div>
      <div>
        {loading && <Loading />}
        <label htmlFor="scheduledDate" className="block mb-2 font-bold">
          Date
        </label>
        <input
          id="scheduledDate"
          className="w-full px-3 py-2 border rounded-md"
          type="date"
          name="scheduledDate"
          value={changes.scheduledDate}
          onChange={handleChages}
          min={getCurrentDate()} // Set the min attribute to the current date
        ></input>
      </div>
      <div>
        <label htmlFor="scheduledTime" className="block mb-2 font-bold">
          Time
        </label>
        <Select
          id="scheduledTime"
          name="scheduledTime"
          value={changes.scheduledTime}
          onChange={handleChages}
        >
          <option value="" disabled selected>
            Select a time range
          </option>
          <option value="10AM-12PM">10AM : 12PM</option>
          <option value="12PM-02PM">12PM : 02PM</option>
          <option value="02PM-04PM">02PM : 04PM</option>
          <option value="04PM-06PM">04PM : 06PM</option>
          <option value="06PM-08PM">06PM : 08PM</option>
        </Select>
      </div>
      <div>
        <label htmlFor="message" className="block mb-2 font-bold">
          Resion for Re-Scheduling
        </label>
        <textarea
          id="message"
          name="message"
          value={changes.message}
          onChange={handleChages}
          className="block mb-2 w-full"
        />
      </div>
      <div>
        <Button onClick={() => submit()}>Submit</Button>
      </div>
    </div>
  );
}

export default Reschedule;
