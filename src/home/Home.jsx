import { useDispatch, useSelector } from "react-redux";
import ModalForm from "_components/PopupForm";
import React, { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import moment from "moment";
import { sortBy } from "lodash";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.value.user);
  const appointments = useSelector((state) => state.appointments.item);

  useEffect(() => {
    dispatch(appointmentActions.getAppointmentByUser(auth?.id));
    setRefreshList(false);
  }, [dispatch, auth?.id, refreshList]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRefreshList(true);
  };

  const renderAppointments = () => {
    if (appointments?.loading) {
      return (
        <tr>
          <td className="text-center">
            <span className="spinner-border spinner-border-lg align-center"></span>
          </td>
        </tr>
      );
    }

    if (appointments?.error) {
      return (
        <tr>
          <td className="center">
            <p style={{ color: "red" }}>Error Network</p>
          </td>
        </tr>
      );
    }

    const sortedAppointments = sortBy(
      appointments?.value,
      "createdAt"
    ).reverse();

    return sortedAppointments.map((item, index) => {
      const formattedDate = moment(item?.date).format("DD-MM-YY [à] HH:mm");
      const formattedDateCreated = moment(item?.createdAt).format(
        "DD-MM [à] HH:mm"
      );

      return (
        <tr key={item?.id}>
          <td className="px-3 py-3 border-b border-gray-200 bg-white">
            {" "}
            <div className="flex text-xs items-center">{index + 1}</div>
          </td>
          <td className="px-3 py-3 border-b border-gray-200 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {formattedDateCreated}{" "}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-200 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {item.name?.toUpperCase()}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-200 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {item.phone?.join(" / ").toLocaleString("fr-FR")}
            </p>
          </td>

          {/* <td className="px-3 py-3 border-b border-gray-200 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {item.address?.toLowerCase()}
            </p>
          </td> */}

          <td className="px-3 py-3 border-b border-gray-200 bg-white ">
            <div
              className="text-gray-900 text-xs sm:px-6 h-8 whitespace-no-wrap overflow-auto"
              style={{
                maxWidth: "110px",
              }}
            >
              {item.address?.toLowerCase()}
            </div>
          </td>

          <td className="px-3 py-3 border-b border-gray-200 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {formattedDate}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-200 bg-white">
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
        </tr>
      );
    });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold leading-tight mb-4">
          Hi {auth?.firstName}!
        </h1>
        <p className="text-x1 font-semibold leading-tight mb-4">
          Welcome Marketer
        </p>
      </div>

      <div className="w-full flex justify-center py-12">
        <button
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 mx-auto transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm"
          onClick={openModal}
        >
          Add new
        </button>
        {isModalOpen && <ModalForm isOpen={openModal} onClose={closeModal} />}
      </div>
      <br />

      {/* <div className="w-full min-h-screen flex justify-center items-center"> */}

      <div className="antialiased font-sans bg-gray-200  max-w-screen-xl mx-auto">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <>
              <h2 className="text-2xl font-semibold leading-tight">
                Appointments
              </h2>
            </>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Address
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Scheduling Date
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Sales Representative
                      </th>
                      <th
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderAppointments()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export { Home };
