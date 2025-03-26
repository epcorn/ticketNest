function TodayJobTable({ heading, data }) {
  return (
    <div className="m-2 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{heading} Jobs</h2>
      {/* Table View */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Ticket No</th>
              <th className="p-3">ContractNo</th>
              <th className="p-3">Complain Phoneno</th>
              <th className="p-3">Due Time</th>
              <th className="p-3">Problem</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data?.map((ticket) => (
                <tr key={ticket.ticketNo} className="border-t">
                  <td className="p-3">{ticket.ticketNo}</td>
                  <td className="p-3">{ticket.contract.number}</td>
                  <td className="p-3">
                    {ticket.modeDetails.phone?.number ?? "NA"}
                  </td>
                  <td className="p-3">{ticket.scheduledTime}</td>
                  <td className="p-3">
                    {ticket.issue.problem
                      .map((problem) => problem.label)
                      .join(", ")}
                  </td>
                  {/* <td className="p-3">
                    <button className="text-blue-600">View</button>
                    <button className="ml-2 text-green-600">Complete</button>
                  </td> */}
                </tr>
              ))
            ) : (
              <h1>NO Job today!</h1>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TodayJobTable;
