import { Spinner } from "flowbite-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded-md">
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default Loading;
