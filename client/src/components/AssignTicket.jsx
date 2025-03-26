import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { MultiSelect } from "react-multi-select-component";
import { Button, Select } from "flowbite-react";
import { update, updateManagerField } from "../redux/assigner/assignerSlice";
import PopUp from "./PopUp";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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

// eslint-disable-next-line react/prop-types
function AssignTicket({ onClose = "", options = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { newTicket, loading } = useSelector((store) => store.assigner);
  const { currentUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [disableIt] = useState(
    newTicket.status !== "" && newTicket.status !== "Open" ? true : false
  );
  const handleManagerInputChange = (e) => {
    if (currentUser.rights.admin || currentUser.rights.assign) {
      const { name, value } = e.target;
      dispatch(updateManagerField({ field: name, value }));
    }
  };
  const handleClick = async () => {
    try {
      if (
        newTicket.agent === "" ||
        newTicket.scheduledTime === "" ||
        newTicket.scheduledDate === ""
      ) {
        return toast.error("Please fill requried fields");
      }

      if (currentUser.rights.admin || currentUser.rights.assign) {
        const resultAction = await dispatch(
          update({ ticketId: newTicket._id, newTicket })
        );
        // eslint-disable-next-line no-unused-vars
        const result = unwrapResult(resultAction);
        onClose();
      }
    } catch (error) {
      // Handle the error case
      console.error("Error creating ticket:", error);
    }
  };
  return (
    <div>
      <div className="px-16 ">
        <div className="mb-4 max-w-md mx-auto">
          <div className="flex items-end justify-center gap-2">
            <div>
              <label
                htmlFor="contractNo"
                className="block mb-2 font-bold text-blue-600"
              >
                Contract No
              </label>
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                value={
                  currentUser.role === "generator"
                    ? searchTerm
                    : newTicket.contract.number
                }
                id="contractNo"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter ContractNo"
              />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* First Column */}
          <div className="w-1/2 pr-4">
            {/* Bill To */}
            <div className="mb-4">
              <label htmlFor="billToName" className="block mb-2 font-bold">
                Bill To
              </label>
              <input
                type="text"
                defaultValue={newTicket.contract?.billToName}
                id="billToName"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="billToAddress" className="block mb-2 font-bold">
                Address
              </label>
              <textarea
                type="text"
                rows="4"
                defaultValue={newTicket.contract?.billToAddress}
                id="billToAddress"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Address"
                disabled
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="w-1/2 pl-4">
            {/* Ship To */}
            <div className="mb-4">
              <label htmlFor="shipToName" className="block mb-2 font-bold">
                Ship To
              </label>
              <input
                defaultValue={newTicket.contract?.shipToName}
                type="text"
                id="shipToName"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="shipToAddress" className="block mb-2 font-bold">
                Address
              </label>
              <textarea
                type="text"
                rows="4"
                defaultValue={newTicket.contract?.shipToAddress}
                id="shipToAddress"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Address"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-3">
          {newTicket.contract.selectedServices.map((x, idx) => (
            <span
              key={idx + x.serviceId}
              className="p-1 border border-gray-800 rounded-md bg-green-300 min-w-10"
            >
              {x.name}
            </span>
          ))}
        </div>
      </div>
      <div className=" mx-auto  p-16 rounded-lg">
        {/* Complement Mode */}
        {loading && <Loading />}
        <div>
          <div className="w-full">
            <label
              htmlFor="complementMode"
              className="block mt-4 mb-1 font-bold text-blue-600"
            >
              Complain Mode
            </label>
            <div className="mb-4">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="complementMode"
                  defaultValue="email"
                  checked={newTicket.complainMode === "email"}
                  readOnly
                  className="form-radio"
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="complementMode"
                  defaultValue="phone"
                  checked={newTicket.complainMode === "phone"}
                  readOnly
                  className="form-radio"
                />
                <span className="ml-2">Phone</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="complementMode"
                  defaultValue="inspection"
                  checked={newTicket.complainMode === "inspection"}
                  readOnly
                  className="form-radio"
                />
                <span className="ml-2">Inspection</span>
              </label>
            </div>

            {/* Additional Phone Fields */}
            {newTicket.complainMode === "phone" && (
              <div>
                <div className="mb-4">
                  <label htmlFor="callDate" className="block mb-2 font-bold">
                    Date
                  </label>
                  <input
                    type="date"
                    id="callDate"
                    name="date"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={newTicket.modeDetails.phone.date}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="callerDetails"
                    className="block mb-2 font-bold"
                  >
                    Caller Name
                  </label>
                  <input
                    type="text"
                    id="callerDetails"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter caller Name"
                    name="callerDetails"
                    disabled
                    defaultValue={newTicket.modeDetails.phone.callerDetails}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block mb-2 font-bold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter phone number"
                    name="number"
                    disabled
                    defaultValue={newTicket.modeDetails.phone.number}
                  />
                </div>
              </div>
            )}
            {newTicket.complainMode === "inspection" && (
              <div>
                <div className="mb-4">
                  <label htmlFor="inspector" className="block mb-2 font-bold">
                    Inspector name
                  </label>
                  <input
                    type="text"
                    id="inspector"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter inspector name"
                    name="inspector"
                    defaultValue={newTicket.modeDetails.inspection.inspector}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="assessment" className="block mb-2 font-bold">
                    Assessment
                  </label>
                  <input
                    type="text"
                    id="assessment"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Readings...."
                    name="assessment"
                    defaultValue={newTicket.modeDetails.inspection.assessment}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* complain details */}
        <div>
          <label
            htmlFor="complainDetails"
            className="block mt-4 mb-1 font-bold text-blue-600"
          >
            Complain Details
          </label>
          <div className="mb-4">
            <label htmlFor="problem" className="block mb-2 font-bold">
              Select Bug type?
            </label>
            <MultiSelect
              options={options}
              value={newTicket.issue.problem}
              name="problem"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="problemLocation" className="block mb-2 font-bold">
              Where is the problem?
            </label>
            <input
              type="text"
              id="problemLocation"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Location of pest problem"
              defaultValue={newTicket.issue.location}
              name="location"
              disabled
            />
          </div>
          <div>
            <label htmlFor="moreDetails" className="block mb-2 font-bold">
              More Details
            </label>
            <textarea
              id="moreDetails"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter more details"
              rows="4"
              defaultValue={newTicket.issue.details}
              name="details"
              disabled
            ></textarea>
          </div>
        </div>

        {/* Manager Inputs */}

        {(currentUser.rights.admin || currentUser.rights.assign) && (
          <div>
            <span className=" text-red-700">Edit here</span>
            <span style={{ fontSize: "50px" }}>&#128071;</span>
            <div>
              <label htmlFor="agent" className="block mb-2 font-bold">
                Choose Agent
              </label>
              <Select
                id="agent"
                name="agent"
                defaultValue={newTicket.agent}
                onChange={handleManagerInputChange}
                disabled={disableIt}
              >
                <option value="" disabled>
                  Please select an agent
                </option>
                <option value="executive">Executive</option>
                <option value="supervisor">Supervisor</option>
                <option value="executive+supervisor">
                  Executive + Supervisor
                </option>
              </Select>
            </div>
            <div>
              <label htmlFor="scheduledDate" className="block mb-2 font-bold">
                Date
              </label>
              <input
                id="scheduledDate"
                className="w-full px-3 py-2 border rounded-md"
                type="date"
                onChange={handleManagerInputChange}
                value={newTicket.scheduledDate}
                name="scheduledDate"
                disabled={disableIt}
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
                value={newTicket.scheduledTime}
                onChange={handleManagerInputChange}
                disabled={disableIt}
              >
                <option value="" disabled selected>
                  Select a time range
                </option>
                <option value="10AM-12PM">10AM : 12PM</option>
                <option value="12PM-02PM">12PM : 02PM</option>
                <option value="02PM-04PM">02PM : 04PM</option>
                <option value="04PM-06PM">04PM : 06PM</option>
                <option value="06PM-08PM">06PM : 08PM</option>
                <option value="08PM-10PM">08PM : 10PM</option>
                <option value="12AM-02AM">12AM : 02AM</option>
                <option value="02AM-04AM">02AM : 04AM</option>
                <option value="04AM-06AM">04AM : 06AM</option>
                <option value="06AM-08AM">06AM : 08AM</option>
                <option value="08AM-10AM">08AM : 10AM</option>
              </Select>
            </div>
            <div>
              <label htmlFor="resource" className="block mb-2 font-bold">
                Resources
              </label>
              <textarea
                id="resource"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="All Resource"
                onChange={handleManagerInputChange}
                rows="4"
                value={newTicket.resource}
                name="resource"
                disabled={disableIt}
              ></textarea>
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-center">
          {newTicket.status === "Assigned" || newTicket.status === "Closed" ? (
            <Button onClick={() => onClose()}>Close</Button>
          ) : (
            (currentUser.rights.admin || currentUser.rights.assign) && (
              <PopUp click={handleClick} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignTicket;
