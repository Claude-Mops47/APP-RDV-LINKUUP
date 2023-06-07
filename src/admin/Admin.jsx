import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import moment from "moment";

export { Admin };

function Admin() {
  const dispatch = useDispatch();
  const auth = useSelector((x) => x.auth.value.user);
  const appointments = useSelector((x) => x.appointments.list);

  useEffect(() => {
    dispatch(appointmentActions.getAllAppointments());
  }, []);

  const downloadAsCSV = () => {
    // Create a CSV string from the appointment data
    const csvContent = [
      "Agent,Date,Name,Telephone,Address,Date programmation,Commercial",
      ...appointments?.value?.map((item) => {
        const phoneNumbers = Array.isArray(item.phone)
          ? item.phone.join(" ").split("/")
          : null;
        const agent = item.posted_by?.firstName;
        const dateStr = item.date;
        const dateObj = moment(dateStr);
        const formattedDate = dateObj.format("DD-MM-YY [à] HH:mm");
        const address = item.address;
        const commercial = item.commercial;
        return [
          agent,
          formattedDate,
          item.name,
          phoneNumbers ? phoneNumbers.join(", ") : "",
          address,
          formattedDate,
          commercial,
        ].join(",");
      }),
    ].join("\n");

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "appointments.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [filterAgent, setFilterAgent] = useState("");

  const handleAgentFilterChange = (e) => {
    setFilterAgent(e.target.value);
  };

  const filteredAppointments = appointments?.value?.filter((item) => {
    if (
      filterAgent &&
      !item.posted_by?.firstName
        .toLowerCase()
        .includes(filterAgent.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <h1>Hi {auth?.firstName}!</h1>
      <p>Welcome Admin</p>
      <p>
        <Link to="/users">Manage Users</Link>
      </p>

      <button className="btn btn-link" onClick={downloadAsCSV}>
        Download appointment list as CSV
      </button>

      <div className="table-wrapper">
        <h2>Liste des rendez-vous</h2>
        <div className="form-group">
          <label htmlFor="agentFilter">Filter par agent :</label>
          <input
            className="input-control"
            type="text"
            id="agentFilter"
            value={filterAgent}
            onChange={handleAgentFilterChange}
          />
        </div>
        <br />

        <table className="fl-table">
          <thead>
            <tr>
              <th style={{ width: "2%" }}>#</th>
              <th style={{ width: "10%" }}>Agent</th>
              <th style={{ width: "15%" }}>Date</th>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "20%" }}>Telephone</th>
              <th style={{ width: "30%" }}>Address</th>
              <th style={{ width: "25%" }}>Date programmation</th>
              <th style={{ width: "20%" }}>Commercial</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments?.map((item, index) => {
              // phone array

              const phoneNumbers = Array.isArray(item.phone)
                ? item.phone.join(" ").split("/")
                : null;
              // agent
              const agent = item.posted_by?.firstName;
              // date programmation
              const dateStr = item.date;
              const dateObj = moment(dateStr);
              const formattedDate = dateObj.format("DD-MM-YY [à] HH:mm");
              // date created
              const dateCreated = item.posted_by?.createdAt;
              const dateObj2 = moment(dateCreated);
              const formattedDateCreated = dateObj2.format("DD-MMMM");

              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{agent}</td>
                  <td>{formattedDateCreated}</td>
                  <td>{item.name}</td>
                  <td>
                    {phoneNumbers &&
                      phoneNumbers.map((number) => (
                        <div key={number}>{number}</div>
                      ))}
                  </td>
                  <td>{item.address}</td>
                  <td>{formattedDate}</td>
                  <td>{item.commercial}</td>
                </tr>
              );
            })}
            {appointments?.loading && (
              <tr>
                <td className="center">
                  <span className="spinner-border spinner-border-lg align-center"></span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
