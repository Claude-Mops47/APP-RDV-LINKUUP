import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import moment from "moment";

function Admin() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.value.user);
  const appointments = useSelector((state) => state.appointments.list);

  useEffect(() => {
    dispatch(appointmentActions.getAllAppointments());
  }, []);

  const downloadAsCSV = () => {
    const csvContent = [
      "Agent,Date,Name,Telephone,Address,Date programmation,Commercial",
      ...(appointments?.value || []).map((item) => {
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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

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
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 16;

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

  const handleAgentFilterChange = (e) => {
    setFilterAgent(e.target.value);
  };

  const sortedAppointments = [...(filteredAppointments || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
          <label htmlFor="agentFilter">Filtre agent :</label>
          <input
            className="input-control"
            type="text"
            id="agentFilter"
            value={filterAgent}
            autoComplete='off'
            onChange={handleAgentFilterChange}
          />
        </div>
        <br />

        <table className="fl-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent</th>
              <th>Date</th>
              <th>Name</th>
              <th>Telephone</th>
              <th>Address</th>
              <th>Date programmation</th>
              <th>Commercial</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((item, index) => {
              const phoneNumbers = Array.isArray(item.phone)
                ? item.phone.join(" ").split("/")
                : null;
              const agent = item.posted_by?.firstName;
              const formattedDate = moment(item.date).format(
                "DD-MM-YY [à] HH:mm"
              );
              const formattedDateCreated = moment(item?.createdAt).format(
                "DD-MMMM"
              );

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
            {appointments?.error && (
              <tr>
                <td className="center">
                  <p style={{ color: "red" }}>Error Network</p>{" "}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          appointmentsPerPage={appointmentsPerPage}
          totalAppointments={sortedAppointments.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
}

function Pagination({
  appointmentsPerPage,
  totalAppointments,
  currentPage,
  paginate,
}) {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              className={`page-link ${number === currentPage ? "active" : ""}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { Admin };
