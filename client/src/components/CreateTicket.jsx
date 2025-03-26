import { Contract, TwoColumnForm } from "./index.js";
import bugToServicesMap from "../data/servicetoBug.js";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function CreateTicket({ onClose = "" }) {
  const [options, setOptions] = useState([]);
  const location = useLocation();

  const createOption = useCallback((selectedServices) => {
    let aray = selectedServices.map((service) => {
      const inscet = findInsectByServiceName(service.name);
      return { label: inscet, value: inscet };
    });
    aray = removeDuplicates(aray);
    setOptions(aray);
  }, []);

  function removeDuplicates(insectsArray) {
    const uniqueValues = new Set(insectsArray.map((insect) => insect.value));
    const uniqueInsects = Array.from(uniqueValues, (value) =>
      insectsArray.find((insect) => insect.value === value)
    );
    return uniqueInsects;
  }

  function findInsectByServiceName(serviceName) {
    for (const bug of bugToServicesMap) {
      if (bug.ServiceNames.includes(serviceName)) {
        return bug.Insect;
      }
    }
    return;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mt-2 p-2">
        <Contract createOption={createOption} location={location} />
        <TwoColumnForm options={options} onClose={onClose} />
      </div>
    </div>
  );
}
