/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  handleMode,
  setCreator,
  uploadFiles,
  updateIssueField,
  handlePhoneFilds,
  handleInspection,
  createTicket,
} from "../redux/creater/createrSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { PopUp, Loading, CustomModal, ImagePreviewUpload } from "./index.js";
import { toast } from "react-toastify";

const TwoColumnForm = ({ onClose = "", options }) => {
  const { currentUser } = useSelector((store) => store.user);
  const { newTicket, loading } = useSelector((store) => store.creater);
  const [showInspect, setShowInspect] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [imageModel, setImageModel] = useState(false);

  const handleComplementModeChange = (mode) => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      dispatch(handleMode(mode));
      if (mode === "phone") {
        const currentDate = new Date().toISOString().split("T")[0];
        dispatch(handlePhoneFilds({ field: "date", value: currentDate }));
      }
    }

    if (mode === "inspection") {
      setShowInspect(true);
    } else {
      setShowInspect(false);
    }
    if (mode === "email") {
      setShowEmail(true);
    } else {
      setShowEmail(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputChange = (e) => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      const { name, value } = e.target;
      dispatch(updateIssueField({ field: name, value }));
      dispatch(setCreator(currentUser.username));
    }
  };

  const hadlePhoneChange = (e) => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      const { name, value } = e.target;
      dispatch(handlePhoneFilds({ field: name, value }));
    }
  };
  const handleInspectionDetails = (e) => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      const { name, value } = e.target;
      dispatch(handleInspection({ field: name, value }));
    }
  };

  const handleClick = async () => {
    try {
      if (currentUser.rights.admin || currentUser.rights.create) {
        if (
          newTicket.number === "" ||
          newTicket.issue.problem === "" ||
          newTicket.issue.location === ""
        ) {
          toast.error("Fill all the fields!");
          return;
        }
        const resultAction = await dispatch(createTicket(newTicket));
        const result = unwrapResult(resultAction);
        onClose();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  useEffect(() => {
    if (currentUser.rights.admin || currentUser.rights.create) {
      dispatch(updateIssueField({ field: "problem", value: selected }));
    }
  }, [selected, dispatch, currentUser]);

  return (
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
                value="email"
                checked={newTicket.complainMode === "email"}
                onChange={() => handleComplementModeChange("email")}
                className="form-radio"
              />
              <span className="ml-2">Email</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="complementMode"
                value="phone"
                checked={newTicket.complainMode === "phone"}
                onChange={() => handleComplementModeChange("phone")}
                className="form-radio"
              />
              <span className="ml-2">Phone</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="complementMode"
                value="inspection"
                checked={newTicket.complainMode === "inspection"}
                onChange={() => handleComplementModeChange("inspection")}
                className="form-radio"
              />
              <span className="ml-2">Inspection</span>
            </label>
          </div>

          {/* Additional Phone Fields */}
          {newTicket.complainMode === "email" && (
            <div className="mb-4">
              <label htmlFor="emailCopy" className="block mb-2 font-bold">
                Email Screenshot
              </label>
              <Button
                gradientDuoTone="purpleToBlue"
                className="w-full"
                onClick={() => setImageModel(true)}
              >
                Image uplaod
              </Button>
            </div>
          )}
          {newTicket.complainMode === "phone" && (
            <div>
              <div className="mb-4">
                <label htmlFor="callDate" className="block mb-2 font-bold">
                  Date <span className=" text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="callDate"
                  name="date"
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) => hadlePhoneChange(e)}
                  value={newTicket.modeDetails.phone.date}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="callerDetails" className="block mb-2 font-bold">
                  Caller Name <span className=" text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="callerDetails"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter caller Name"
                  name="callerDetails"
                  onChange={(e) => hadlePhoneChange(e)}
                  value={newTicket.modeDetails.phone.callerDetails}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 font-bold">
                  Phone Number <span className=" text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter phone number"
                  name="number"
                  onChange={(e) => hadlePhoneChange(e)}
                  value={newTicket.modeDetails.phone.number}
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
                  value={newTicket.modeDetails.inspection.inspector}
                  onChange={(e) => handleInspectionDetails(e)}
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
                  onChange={(e) => handleInspectionDetails(e)}
                  value={newTicket.modeDetails.inspection.assessment}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="emailCopy" className="block mb-2 font-bold">
                  Images Taken
                </label>
                <input
                  type="file"
                  id="emailCopy"
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) =>
                    dispatch(
                      uploadFiles({
                        file: e.target.files,
                        name: "inspection",
                      })
                    )
                  }
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
            Select Bug type? <span className=" text-red-600">*</span>
          </label>
          <MultiSelect
            options={options}
            value={newTicket.issue.problem}
            name="problem"
            onChange={setSelected}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="problemLocation" className="block mb-2 font-bold">
            Where is the problem? <span className=" text-red-600">*</span>
          </label>
          <input
            type="text"
            id="problemLocation"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Location of pest problem"
            onChange={handleInputChange}
            value={newTicket.issue.location}
            name="location"
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
            onChange={handleInputChange}
            rows="4"
            value={newTicket.issue.details}
            name="details"
          ></textarea>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center">
        {newTicket.status === "Assigned" || newTicket.status === "Closed" ? (
          <Button onClick={() => onClose()}>Close</Button>
        ) : currentUser.rights.admin || currentUser.rights.create ? (
          <Button
            gradientDuoTone="cyanToBlue"
            className="font-semibold"
            onClick={() => handleClick()}
          >
            Create Ticket
          </Button>
        ) : (
          <PopUp click={handleClick} />
        )}
      </div>
      <CustomModal
        isOpen={imageModel}
        onClose={() => setImageModel(false)}
        heading="Image Upload"
      >
        <ImagePreviewUpload onClose={() => setImageModel(false)} />
      </CustomModal>
    </div>
  );
};

export default TwoColumnForm;
