/* eslint-disable react/prop-types */
import { unwrapResult } from "@reduxjs/toolkit";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { uploadFiles } from "../redux/creater/createrSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ImagePreviewUpload({ onClose }) {
  const { newTicket, loading } = useSelector((store) => store.creater);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (newTicket.modeDetails.email.emailCopy !== " ") {
      setPreviewUrl(newTicket.modeDetails.email.emailCopy);
    }
  }, [newTicket]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const resultAction = await dispatch(
        uploadFiles({ file: selectedFile, name: "email" })
      );
      // eslint-disable-next-line no-unused-vars
      const result = unwrapResult(resultAction);
      onClose();

      // Clear the preview and selected file after upload
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-4 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Image Preview and Upload</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      />
      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <span className=" pr-3">Uploading...</span>
            <Spinner size="sm" />
          </div>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
}
