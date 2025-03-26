/* eslint-disable react/prop-types */
import { Button } from "flowbite-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { incPrintCount } from "../redux/assigner/assignerSlice";
import { unwrapResult } from "@reduxjs/toolkit";

// eslint-disable-next-line react/display-name, no-unused-vars
const Ticket = forwardRef((props, ref) => {
  const { close } = props;
  const dispatch = useDispatch();
  const { newTicket } = useSelector((state) => state.assigner);
  const [id, setId] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      const resultAction = await dispatch(incPrintCount(id));
      // eslint-disable-next-line no-unused-vars
      const result = unwrapResult(resultAction);
      close();
    },
  });
  useEffect(() => {
    setId(newTicket._id);
  }, [newTicket]);

  return (
    <div>
      <div ref={componentRef} className="ticket p-3 bg-white">
        <div className="ticket-header mb-2 border-b border-black pb-1">
          <h1 className="text-lg font-bold text-center mb-1">Ticket</h1>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold mb-0.5">
                Ticket No: {newTicket.ticketNo}
              </h2>
              <h4 className="text-xs">Contract: {newTicket.contract.number}</h4>
            </div>
            <div className="border-l border-black pl-2">
              <p className="text-xs font-semibold mb-0.5">Scheduled:</p>
              <p className="text-xs">
                {newTicket.scheduledDate} | {newTicket.scheduledTime}
              </p>
            </div>
          </div>
        </div>
        <div className="ticket-body">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Ship To Details:</h3>
            <div className="border-l-2 border-black pl-1">
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Name:</span>{" "}
                {newTicket.contract.shipToName}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Address:</span>{" "}
                {newTicket.contract.shipToAddress}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Emails:</span>{" "}
                {newTicket.contract.shipToEmails.join(", ")}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Complain Details:</h3>
            <div className="border-l-2 border-black pl-1">
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Mode:</span>{" "}
                {newTicket.complainMode}
              </p>
              {newTicket.complainMode === "phone" && (
                <>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Date:</span>{" "}
                    {newTicket.modeDetails.phone.date}
                  </p>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Number:</span>{" "}
                    {newTicket.modeDetails.phone.number}
                  </p>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Caller Details:</span>{" "}
                    {newTicket.modeDetails.phone.callerDetails}
                  </p>
                </>
              )}
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Problem:</span>{" "}
                {newTicket.issue.problem.map((a) => (
                  <span className="mr-1" key={a.label}>
                    {a.value}
                  </span>
                ))}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Location:</span>{" "}
                {newTicket.issue.location}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Details:</span>{" "}
                {newTicket.issue.details}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Appointment Details:</h3>
            <div className="flex">
              <div className="w-1/3 pr-2 border-r border-black">
                <p className="font-semibold mb-0.5 text-xs">Agent:</p>
                <p className="text-xs">{newTicket.agent}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-black pt-2">
            <h3 className="font-semibold text-sm mb-1">Customer Signature:</h3>
            <div className="flex items-center">
              <div className="w-1/2">
                <label htmlFor="signature" className="font-semibold text-xs">
                  Signature:
                </label>
                <input
                  type="text"
                  id="signature"
                  className="border-b border-black w-full focus:outline-none text-xs"
                />
              </div>
              <div className="w-1/2 ml-2">
                <input type="checkbox" id="done" className="mr-1" />
                <label htmlFor="done" className="text-xs">
                  Done
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <Button gradientDuoTone="purpleToPink" onClick={() => handlePrint()}>
          <span className="mr-2">Print</span>
          <span>{newTicket.printcount}</span>
        </Button>
      </div>
    </div>
  );
});

export default Ticket;
