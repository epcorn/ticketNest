import { Button, Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getTickets,
  showMoreTicket,
  setInit,
} from "../redux/creater/createrSlice";
import TimeAgo from "react-timeago";
import { CustomModal, CreateTicket } from "../components";
export default function Create() {
  const { currentUser } = useSelector((state) => state.user);
  const { tickets, totalTickets, todayTickets, showMore } = useSelector(
    (state) => state.creater
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createModel, setCreateModel] = useState(false);
  const [extraQuery, setExtraQuery] = useState(null);

  useEffect(() => {
    if (!currentUser.rights.admin && !currentUser.rights.create) {
      navigate("/");
    } else {
      dispatch(getTickets());
    }
  }, [currentUser, navigate, dispatch]);

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
    <div className=" max-w-7xl mx-auto ">
      <div className="h-full mt-3">
        <div className=" mt-2 h-full">
          <div className="h-16 text-lg flex items-center justify-between font-medium bg-yellow-100 border border-yellow-500 rounded-tl-lg rounded-br-lg">
            <div className="flex-grow mr-4 ">
              <div className="flex items-center justify-center">
                <h3>Recent Tickets</h3>
              </div>
            </div>
            <div>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded mr-2"
                onClick={() => setCreateModel(true)}
              >
                Create Ticket
              </button>
            </div>
          </div>
          <div className="flex items-center justify-evenly h-16 p-2 border">
            <div className="flex items-center justify-center gap-2">
              <span>
                <div>Total</div>
                <div>Tickets</div>
              </span>
              <span className=" font-bold text-2xl ">{totalTickets}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span>
                <div>Today&apos;s</div>
                <div>Tickets</div>
              </span>
              <span className=" font-bold text-2xl ">{todayTickets}</span>
            </div>
          </div>
          <div className=" overflow-x-auto ">
            <Table>
              <Table.Head>
                <Table.HeadCell>Ticket No</Table.HeadCell>
                <Table.HeadCell>Created By</Table.HeadCell>
                <Table.HeadCell>Contract No</Table.HeadCell>
                <Table.HeadCell>Timestamp</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {tickets.length > 0 &&
                  tickets.map((ticket) => (
                    <Table.Row key={ticket._id}>
                      <Table.Cell>{ticket.ticketNo}</Table.Cell>
                      <Table.Cell>{ticket.createdBy}</Table.Cell>
                      <Table.Cell>{ticket.contract.number}</Table.Cell>
                      <Table.Cell>
                        <TimeAgo date={new Date(ticket.createdAt)} />
                      </Table.Cell>
                      <Table.Cell>
                        <span className=" font-semibold text-md rounded-md border border-red-400 p-2">
                          {ticket.status}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            {tickets.length <= 0 && (
              <h1 className="text-center">
                Not created any ticket yet
                <span style={{ fontSize: "60px" }}>&#128524;</span>
              </h1>
            )}
          </div>
        </div>
      </div>
      {showMore && (
        <div className="flex items-center justify-center p-1">
          <Button gradientDuoTone="purpleToPink" pill onClick={handleShowMore}>
            Show more
          </Button>
        </div>
      )}
      <CustomModal
        isOpen={createModel}
        onClose={() => setCreateModel(!createModel)}
        setInit={setInit}
      >
        <CreateTicket onClose={() => setCreateModel(!createModel)} />
      </CustomModal>
    </div>
  );
}
