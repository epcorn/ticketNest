import { Button, Select, Spinner, Table, TableHeadCell } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import {
  getTickets,
  showMoreTicket,
  getIt,
  update,
  uploadFiles,
  setImageLinkOfTicketNo,
  updateImage,
  cancelTicket,
} from "../redux/assigner/assignerSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Ticket,
  SearchTicket,
  CustomModal,
  AssignTicket,
  TimeLine,
  Reschedule,
  TicketStatusAssign,
} from "../components";
import { BiCheckboxChecked } from "react-icons/bi";
import { getStatusCount } from "../redux/creater/createrSlice";
export default function Manager() {
  const { currentUser } = useSelector((state) => state.user);
  const {
    tickets,
    loading,
    showMore,
    newTicket: { ticketImage },
  } = useSelector((state) => state.assigner);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [printModelOpen, setPrintModelOpen] = useState(false);
  const [ticketImgModelOpen, setTicketImgModelOpen] = useState(false);
  const [imgUplodingTicketNo, setImgUploadingTicketNo] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [extraQuery, setExtraQuery] = useState(null);
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [capturedTicketId, setCapturedTicketId] = useState("");
  const [reassign, setReassign] = useState(false);
  const [statusCount, setStatusCount] = useState([]);

  const togglePrintModel = () => {
    setPrintModelOpen(!printModelOpen);
  };
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    async function fn() {
      if (
        currentUser.rights.admin ||
        currentUser.rights.assign ||
        currentUser.rights.markDone
      ) {
        dispatch(getTickets());
        const a1 = await dispatch(getStatusCount());
        const r1 = unwrapResult(a1);
        setStatusCount(r1.data);
      } else {
        navigate("/");
      }
    }
    fn();
  }, [
    currentUser.rights.admin,
    currentUser.rights.assign,
    currentUser.rights.markDone,
    dispatch,
    navigate,
  ]);

  const handleClick = (ticketId) => {
    dispatch(getIt({ ticketId }));
  };

  const handleStatusUpdate = async (e, ticketId) => {
    const { value } = e.target;
    if (value == "Canceled") {
      dispatch(cancelTicket(ticketId));
      return;
    }
    const indexToUpdate = tickets.findIndex(
      (ticket) => ticket._id === ticketId
    );
    if (indexToUpdate !== -1) {
      const updatedTicket = {
        ...tickets[indexToUpdate],
        status: value,
      };
      if (updatedTicket.agent === "") {
        toast.error("Please edit the ticket first ");
        return;
      }
      if (!currentUser.rights.admin && !currentUser.rights.markDone) {
        toast.error("You currently do not have permission to close ticket");
        return;
      }
      if (value === "Closed" && ticketImage === "") {
        toast.error("Please upload image first!");
        return;
      }
      try {
        setUpdatingId(ticketId);
        if (value === "Closed") {
          updatedTicket.ticketImage = ticketImage;
        }
        const resultAction = await dispatch(
          update({ ticketId, newTicket: updatedTicket })
        );

        // eslint-disable-next-line no-unused-vars
        const result = unwrapResult(resultAction);

        setUpdatingId("");
      } catch (error) {
        setUpdatingId("");
      }
    }
  };

  const handleShowMore = async () => {
    const startIndex = tickets.length;
    if (showMore && extraQuery) {
      dispatch(showMoreTicket({ startIndex, extraQuery }));
      setExtraQuery(null);
    } else {
      dispatch(showMoreTicket({ startIndex }));
    }
  };

  return (
    <>
      <div className=" max-w-7xl mx-auto min-h-screen border mt-2 rounded-tl-lg rounded-br-lg ">
        <div className=" h-full">
          <div className="h-16 text-lg flex items-center justify-between font-medium bg-yellow-100 border border-yellow-500 rounded-tl-lg rounded-br-lg">
            <div className="flex-grow mr-4 ">
              <div className="flex items-center justify-center">
                <h3>Recent Tickets</h3>
              </div>
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
              }}
            >
              <TicketStatusAssign data={statusCount} />
            </div>
          </div>

          <div>
            <SearchTicket setExtraQuery={setExtraQuery} />
          </div>
          <div className=" overflow-x-auto ">
            <Table>
              <Table.Head>
                <Table.HeadCell>Ticket No</Table.HeadCell>
                <Table.HeadCell>Created By</Table.HeadCell>
                <Table.HeadCell>Contract No</Table.HeadCell>
                <Table.HeadCell>Timestamp</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </Table.Head>
              <Table.Body>
                {tickets.length > 0 &&
                  tickets.map((ticket) => (
                    <Table.Row key={ticket._id} className="border">
                      <Table.Cell>{ticket.ticketNo}</Table.Cell>
                      <Table.Cell>{ticket.createdBy}</Table.Cell>
                      <Table.Cell>{ticket.contract.number}</Table.Cell>
                      <Table.Cell>
                        <TimeAgo date={new Date(ticket.createdAt)} />
                      </Table.Cell>
                      <Table.Cell>
                        {updatingId === ticket._id ? (
                          <div className="flex items-center justify-center">
                            <span className=" pr-3">Loading...</span>
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <Select
                            name="status"
                            className=" min-w-24 "
                            value={ticket.status}
                            onChange={(e) => handleStatusUpdate(e, ticket._id)}
                          >
                            <option value="Open" disabled>
                              Open
                            </option>
                            <option value="Assigned" disabled>
                              Assigned
                            </option>
                            <option value="Closed">Closed</option>
                            {currentUser.rights.admin ? (
                              <option value="Canceled">Canceled</option>
                            ) : null}
                          </Select>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          pill
                          color="yellow"
                          onClick={() => [
                            toggleModal(),
                            handleClick(ticket._id),
                          ]}
                          disabled={ticket.status === "Canceled"}
                        >
                          {ticket.status !== "Open" ? "View" : "Edit"}
                        </Button>
                      </Table.Cell>
                      {updatingId === ticket._id ? (
                        <Table.Cell>
                          <span className=" pr-3">Loading...</span>
                          <Spinner size="sm" />
                        </Table.Cell>
                      ) : ticket.status !== "Open" ? (
                        <Table.Cell className="border">
                          <div className="flex items-center justify-evenly flex-wrap gap-1">
                            <Button
                              gradientDuoTone="purpleToBlue"
                              onClick={() => [
                                togglePrintModel(),
                                handleClick(ticket._id),
                              ]}
                              disabled={ticket.status === "Canceled"}
                            >
                              View Ticket
                            </Button>
                            {ticket.history && (
                              <Button
                                gradientDuoTone="tealToLime"
                                onClick={() => [
                                  setHistoryOpen(true),
                                  setCapturedTicketId(ticket._id),
                                ]}
                                disabled={ticket.status === "Canceled"}
                              >
                                History
                              </Button>
                            )}
                            {ticket.status === "Assigned" &&
                              (currentUser.rights.assign ||
                                currentUser.rights.admin) && (
                                <Button
                                  gradientDuoTone="greenToBlue"
                                  onClick={() => [
                                    setReassign(true),
                                    setCapturedTicketId(ticket._id),
                                  ]}
                                  disabled={ticket.status === "Canceled"}
                                >
                                  Reschedule
                                </Button>
                              )}
                            {ticket.status === "Assigned" &&
                              (currentUser.rights.markDone ||
                                currentUser.rights.admin) && (
                                <Button
                                  gradientDuoTone={
                                    ticket.ticketImage === ""
                                      ? "pinkToOrange"
                                      : "greenToBlue"
                                  }
                                  onClick={() => [
                                    setTicketImgModelOpen(true),
                                    setImgUploadingTicketNo(ticket.ticketNo),
                                    setUpdatingId(ticket._id),
                                  ]}
                                  disabled={ticket.status === "Canceled"}
                                >
                                  {ticket.ticketImage !== "" && (
                                    <BiCheckboxChecked className=" h-6 w-6" />
                                  )}
                                  {ticket.ticketImage === ""
                                    ? "Upload Image"
                                    : "Image uploaded"}
                                </Button>
                              )}
                          </div>
                        </Table.Cell>
                      ) : (
                        <Table.Cell className="flex items-center justify-center">
                          <p className=" text-xl ">&#128562;</p>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <CustomModal isOpen={isOpen} onClose={toggleModal} heading="Ticket">
          <AssignTicket onClose={toggleModal} />
        </CustomModal>
        <CustomModal
          isOpen={reassign}
          onClose={() => setReassign(!reassign)}
          heading="Re-Schedule"
        >
          <Reschedule
            ticketId={capturedTicketId}
            onClose={() => setReassign(!reassign)}
          />
        </CustomModal>

        <CustomModal
          isOpen={printModelOpen}
          onClose={togglePrintModel}
          heading="Print"
        >
          <Ticket closeModal={togglePrintModel} />
        </CustomModal>

        <CustomModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(!historyOpen)}
          heading="History"
        >
          <TimeLine ticketId={capturedTicketId} />
        </CustomModal>

        <CustomModal
          isOpen={ticketImgModelOpen}
          onClose={() => setTicketImgModelOpen(!ticketImgModelOpen)}
          heading="Upload Ticket Image"
        >
          <div>
            <div className="mb-4">
              <input
                type="file"
                id="ticketImage"
                className="w-full px-3 py-2 border rounded-md"
                onChange={async (e) => {
                  const uploadAction = await dispatch(
                    uploadFiles({ file: e.target.files, name: "ticketImage" })
                  );
                  const result = unwrapResult(uploadAction);
                  dispatch(
                    setImageLinkOfTicketNo({
                      ticketNo: imgUplodingTicketNo,
                      link: result.link,
                    })
                  );
                  const uploadAct = await dispatch(
                    updateImage({
                      ticketId: updatingId,
                      link: result.link,
                    })
                  );
                  // eslint-disable-next-line no-unused-vars
                  const res = unwrapResult(uploadAct);
                  setUpdatingId("");
                  setTicketImgModelOpen(!ticketImgModelOpen);
                }}
              />
              {loading && (
                <button className="flex items-center justify-center">
                  <span className=" pr-3">Uploading...</span>
                  <Spinner size="sm" />
                </button>
              )}
            </div>
          </div>
        </CustomModal>
      </div>
      {showMore && (
        <div className="flex items-center justify-center p-1">
          <Button gradientDuoTone="purpleToPink" pill onClick={handleShowMore}>
            Show more
          </Button>
        </div>
      )}
    </>
  );
}
