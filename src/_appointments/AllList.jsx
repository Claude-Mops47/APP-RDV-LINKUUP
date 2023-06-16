import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appointmentActions } from "_store";
import { Link } from "react-router-dom";
import { sortBy } from "lodash";
import moment from "moment";

function AllList() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.list);

  useEffect(() => {
    dispatch(appointmentActions.getAllAppointments());
  }, [dispatch]);

  //   function download
  const downloadRef = useRef(null);

  const downloadAsCSV = () => {
    const csvContent = [
      "Agent,Date,Name,Telephone,Address,Date programmation,Commercial",
      ...(sortedAppointments || []).map((item) => {
        const phone = item.phone.join(" / ");
        const agent = item.posted_by?.firstName;
        return [
          agent,
          moment(item.createdAt).format("DD-MM-YY HH:mm"),
          item.name,
          phone,
          item.address,
          moment(item.date).format("DD-MM-YY HH:mm"),
          item.commercial,
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
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(20);

  const handleSelectChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setAppointmentsPerPage(selectedValue);
  };

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

  const sortedAppointments = sortBy(
    filteredAppointments,
    "createdAt"
  ).reverse();

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
    // <div className="w-full min-h-screen flex justify-center items-center">
    <div className="antialiased font-sans bg-gray-200  max-w-screen-xl mx-auto">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Appointments List
            </h2>
          </div>

          <div className="my-2 flex sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select
                  className="appearance-none h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={appointmentsPerPage}
                  onChange={handleSelectChange}
                >
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
                >
                  <option value="">All</option>
                  {getUniqueDates(sortedAppointments).map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                type="text"
                value={filterAgent}
                onChange={handleAgentFilterChange}
                placeholder="Search Agent"
                autoComplete="off"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
            <div className="block relative ml-4">
              <button
                type="button"
                ref={downloadRef}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={downloadAsCSV}
              >
                download as CSV
              </button>
            </div>
          </div>

          {/* <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"> */}
          <div className="-mx-8 sm:-mx-10 px-8 sm:px-10 py-8 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              {/* <div className="overflow-x-auto"> */}

              <table className="min-w-full leading-normal ">
                <thead>
                  <tr>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Scheduling Date
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sales Respresentative
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((item, index) => {
                    const agent = item.posted_by?.firstName;
                    const DateProg = moment(item.date).format(
                      "DD-MM-YY, HH:mm"
                    );
                    const DateCreated = moment(item?.createdAt).format(
                      "DD-MMMM"
                    );

                    return (
                      <tr key={item._id}>
                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <div className="flex text-xs items-center">
                            {index + 1}
                          </div>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 text-xs">{agent}</p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 text-xs whitespace-no-wrap">
                            {DateCreated}
                          </p>
                        </td>

                        <td className=" px-3 py-3 border-b border-gray-100 bg-white text-sm">
                          <p className="text-gray-900 text-xs whitespace-no-wrap">
                            {item.name.toUpperCase()}
                          </p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white ">
                          <p className="text-gray-900 text-xs whitespace-no-wrap">
                            {item.phone.join(" / ").toLocaleString("fr-FR")}
                          </p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white ">
                          <p
                            className="text-gray-900 text-xs sm:px-6  whitespace-no-wrap overflow-auto"
                            style={{
                              maxWidth: "120px",
                            }}
                          >
                            {item.address.toLowerCase()}
                          </p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white">
                          <p className="text-gray-900 text-xs whitespace-no-wrap">
                            {DateProg}
                          </p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white ">
                          <p className="text-gray-900 text-xs whitespace-no-wrap">
                            {item.commercial}
                          </p>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white">
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute text-xs inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative text-xs whitespace-no-wrap">
                              En-cours
                            </span>
                          </span>
                        </td>

                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <Link to={`../appointments/edit/${item._id}`}>
                              edit
                            </Link>
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {appointments?.loading && (
                <div className="h-screen bg-white">
                  <div className="flex justify-center items-center h-full">
                    <img
                      className="h-16 w-16"
                      src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
                      alt=""
                    />
                  </div>
                </div>
              )}
              {appointments?.error && (
                <div>
                  <div className="center">
                    <p style={{ color: "red" }}>Error Network</p>{" "}
                  </div>
                </div>
              )}

              {/* </div> */}
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                <Pagination
                  appointmentsPerPage={appointmentsPerPage}
                  totalAppointments={sortedAppointments.length}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // </div>
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
    <div className="inline-flex mt-2 xs:mt-0">
      <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${
            number === currentPage ? "active" : ""
          }`}
          onClick={() => paginate(number)}
        >
          {number}
        </button>
      ))}
      <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
        Next
      </button>
    </div>
  );
}

export { AllList };
