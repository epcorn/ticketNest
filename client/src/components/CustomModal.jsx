/* eslint-disable react/prop-types */
import { Modal } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CustomModal = ({
  isOpen,
  onClose,
  children,
  heading,
  setInit = undefined,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Modal
          dismissible
          show={isOpen}
          onClose={() => [onClose(), setInit && dispatch(setInit())]}
        >
          <Modal.Header>{heading}</Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-25"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default CustomModal;
