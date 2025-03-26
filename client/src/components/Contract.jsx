/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import {
  contractDetails,
  setSelectedService,
} from "../redux/creater/createrSlice.js";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";

export default function Contract({ createOption, location = "" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [validTerm, setValidTerm] = useState(false);
  const dispatch = useDispatch();
  const { newTicket, loading, services } = useSelector(
    (store) => store.creater
  );
  const { currentUser } = useSelector((store) => store.user);

  const handleClick = () => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      dispatch(contractDetails(searchTerm));
    }
  };
  const handleCardId = (obj) => {
    dispatch(setSelectedService(obj));
  };
  useEffect(() => {
    if (
      (currentUser.rights.admin || currentUser.rights.create) &&
      location.pathname === "/create"
    ) {
      createOption(newTicket.contract.selectedServices);
    }
  }, [newTicket, createOption, currentUser, location]);

  useEffect(() => {
    function validateInput(input) {
      // Check if input is empty
      if (!input) return false;

      // Split the input by "/"
      const parts = input.split("/");

      // Check if there are exactly two parts
      if (parts.length !== 2) return false;

      // Check if the first character of the first part is uppercase
      if (parts[0][0] !== parts[0][0].toUpperCase()) return false;

      // Check if the second part consists of only digits
      if (!/^\d+(?:-\d+)?$/.test(parts[1])) return false;
      return true;
    }
    setValidTerm(validateInput(searchTerm));
  }, [searchTerm]);
  const handleContractNo = (e) => {
    setSearchTerm(
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    );
  };
  return (
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
              onChange={(e) => handleContractNo(e)}
              type="text"
              value={
                currentUser.rights.admin || currentUser.rights.create
                  ? searchTerm
                  : newTicket.contract.number
              }
              id="contractNo"
              className={`w-full px-3 py-2 border rounded-md ${
                !validTerm ? "bg-red-300" : "bg-green-300"
              }`}
              placeholder="Enter ContractNo"
              autoComplete="off"
            />
          </div>
          <div>
            <Button onClick={handleClick} gradientDuoTone="greenToBlue">
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className=" pr-3">Fetching...</span>
                  <Spinner size="sm" />
                </div>
              ) : (
                "Fetch"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* First Column */}
        <div className="w-1/2 pr-4">
          {/* Bill To */}
          <div className="mb-4">
            <label htmlFor="billToName" className="block mb-2 font-bold">
              Bill To Name
            </label>
            <input
              type="text"
              value={newTicket.contract?.billToName}
              id="billToName"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Name"
              disabled
            />
          </div>
          <div>
            <label htmlFor="billToAddress" className="block mb-2 font-bold">
              Bill To Address
            </label>
            <textarea
              type="text"
              rows="4"
              value={newTicket.contract?.billToAddress}
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
              Ship To Name
            </label>
            <input
              value={newTicket.contract?.shipToName}
              type="text"
              id="shipToName"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Name"
              disabled
            />
          </div>
          <div>
            <label htmlFor="shipToAddress" className="block mb-2 font-bold">
              Ship To Address
            </label>
            <textarea
              type="text"
              rows="4"
              value={newTicket.contract?.shipToAddress}
              id="shipToAddress"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Address"
              disabled
            />
          </div>
        </div>
      </div>
      {services.length > 0 && (
        <div className="flex items-center justify-center gap-1 mb-3 border-2 border-gray-950 p-2 flex-wrap ">
          {services.map((x, idx) => (
            <span
              key={idx + x.serviceId}
              className="p-1 border border-orange-500 rounded-md bg-red-300 min-w-10 cursor-pointer "
              onClick={() => handleCardId(x)}
            >
              {x.name}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-1 mt-3 flex-wrap">
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
  );
}
