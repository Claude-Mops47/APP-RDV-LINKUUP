import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appointmentActions } from "_store";
import moment from "moment";
import { Link } from "react-router-dom";


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function AllList() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.list);

  useEffect(() => {
    dispatch(appointmentActions.getAllAppointments());
  }, []);

  //   function download

  const downloadAsCSV = () => {
    const csvContent = [
      "Agent,Date,Name,Telephone,Address,Date programmation,Commercial",
      ...(appointments?.value || []).map((item) => {
        const phone = item.phone.join(" / ");
        const agent = item.posted_by?.firstName;
        const formattedDate = moment(item.date).format("DD-MM-YY [à] HH:mm");
        const address = item.address;
        const commercial = item.commercial;
        return [
          agent,
          formattedDate,
          item.name,
          phone,
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

  //   filter

  const [filterAgent, setFilterAgent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const appointmentsPerPage = 20;

  const filteredDateAppointments = selectedDate
    ? appointments?.value?.filter(
        (item) => moment(item.createdAt).format("DD-MMMM") === selectedDate
      )
    : appointments?.value;

  const filteredAppointments = filteredDateAppointments?.filter((item) => {
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
  };

  const getUniqueDates = (appointments) => {
    const uniqueDates = [
      ...new Set(
        appointments.map((item) => moment(item.createdAt).format("DD-MMMM"))
      ),
    ];
    return uniqueDates;
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
    setSelectedDate("");
  };

  return (
    <>
      {/* Download List */}
      <button className="btn btn-link" onClick={downloadAsCSV}>
        Download appointment list as CSV
      </button>

      {/* list Appointments */}

      <div className="table-wrapper">
        <h2>Appointment List</h2>

        <div className="row">
          <div className="mb-3 col">
            <label htmlFor="agentFilter">Filter by agent: </label>
            <input
              className="form-control"
              type="text"
              id="agentFilter"
              value={filterAgent}
              autoComplete="off"
              onChange={handleAgentFilterChange}
            />
          </div>

          <div className="mb-3 col">
            <label htmlFor="dateFilter">Filter by date: </label>
            <select
              className="form-control"
              id="dateFilter"
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="">All dates</option>
              {getUniqueDates(sortedAppointments).map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>

        <br />

        <table className="fl-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Scheduling Date</th>
              <th>Sales Representative</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((item, index) => {
              const agent = item.posted_by?.firstName;
              const DateProg = moment(item.date).format("DD-MM-YY [à] HH:mm");
              const DateCreated = moment(item?.createdAt).format("DD-MMMM");
              

              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{agent}</td>
                  <td>{DateCreated}</td>
                  <td>{item.name.toUpperCase()}</td>
                  <td>{item.phone.join(" / ").toLocaleString("fr-FR")}</td>
                  <td>{item.address.toLowerCase()}</td>
                  <td>{DateProg}</td>
                  <td>{item.commercial}</td>
                  <td>
                    <Link to={`../appointments/edit/${item._id}`} className="btn btn-sm btn-outline-primary me-1">Edit</Link>

                    <button
                      onClick={() =>{
                        confirmAlert({
                          title: 'Confirm deletion',
                          message: 'Are you sure you want to delete this appointment?',
                          buttons:[{
                            label: 'Yes',
                            onClick: ()=> dispatch(appointmentActions.deleteAppointment(item._id))
                          },{
                            label:"No",
                            onClick: ()=> {}
                          }
                        ]
                        })

                      }
                      }
                      className="btn btn-outtline-danger-primary me-1"
                      disabled={item.isDeleting}
                    >
                      {item.isDeleting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <span>Delete</span>
                      )}
                    </button>
                  </td>
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
    </>
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

export { AllList };
