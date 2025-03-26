import { useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useDispatch } from "react-redux";
import { searchTicket } from "../redux/assigner/assignerSlice";
import { unwrapResult } from "@reduxjs/toolkit";

// eslint-disable-next-line react/prop-types
const SearchTicket = ({ setExtraQuery }) => {
  const dispatch = useDispatch();
  const [createdBy, setCreatedBy] = useState("");
  const [contract, setContract] = useState("");
  const [status, setStatus] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    createdBy: false,
    contract: false,
    status: false,
    ticketNo: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    let query = "";

    if (selectedFilters.createdBy) {
      query += `&createdBy=${createdBy}`;
    }

    if (selectedFilters.contract) {
      query += `&contract=${contract}`;
    }

    if (selectedFilters.status) {
      query += `&status=${status}`;
    }

    if (selectedFilters.ticketNo) {
      query += `&ticketNo=${ticketNo}`;
    }

    try {
      setLoading(true);
      const resultAction = await dispatch(searchTicket(query.slice(1)));
      setExtraQuery(query.slice(1));
      // eslint-disable-next-line no-unused-vars
      const result = unwrapResult(resultAction);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  return (
    <div className=" max-w-7xl mx-auto">
      <div className="flex items-center  sm:justify-evenly gap-3 pr-6 flex-wrap">
        <div className="">
          <Label htmlFor="createdBy" className="font-bold text-blue-600">
            Created By
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              value={createdBy}
              name="createdBy"
              id="createdBy"
              onChange={(e) => setCreatedBy(e.target.value)}
            />
            <Checkbox
              name="createdBy"
              checked={selectedFilters.createdBy}
              className=" ml-1"
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  createdBy: e.target.checked,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="contract" className=" font-bold text-blue-600">
            Contract
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              value={contract}
              name="contract"
              id="contract"
              onChange={(e) => setContract(e.target.value)}
            />
            <Checkbox
              type="checkbox"
              checked={selectedFilters.contract}
              className=" ml-1"
              name="contract"
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  contract: e.target.checked,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="status" className="font-bold text-blue-600">
            Status
          </Label>
          <div className="flex items-center justify-center">
            <Select
              value={status}
              name="status"
              id="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option disabled></option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Closed">Closed</option>
            </Select>
            <Checkbox
              type="checkbox"
              className=" ml-1"
              name="status"
              checked={selectedFilters.status}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  status: e.target.checked,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="ticketNo" className="font-bold text-blue-600">
            Ticket No
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              name="ticketNo"
              id="ticketNo"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
            />
            <Checkbox
              type="checkbox"
              className=" ml-1"
              name="ticketNo"
              checked={selectedFilters.ticketNo}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  ticketNo: e.target.checked,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <Button gradientDuoTone="redToYellow" onClick={handleSearch}>
          {loading ? (
            <div className="flex items-center justify-center">
              <span className=" pr-3">Searching...</span>
              <Spinner size="sm" />
            </div>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchTicket;
