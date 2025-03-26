import { Button, Modal } from "flowbite-react";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
function PopUp({ click }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        outline
        gradientDuoTone="cyanToBlue"
        onClick={() => setOpenModal(true)}
      >
        Done<span style={{ fontSize: "30px" }}>&#128519;</span>
      </Button>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <span
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
              style={{ fontSize: "30px" }}
            >
              &#128517;
            </span>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure? This will trigger an email to the client.
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => [setOpenModal(false), click()]}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PopUp;
