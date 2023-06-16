// import { useDispatch, useSelector } from "react-redux";
// import ModalForm from "_components/PopupForm";
// import React, { useEffect, useState } from "react";
// import { appointmentActions } from "_store";
// import { sortBy } from "lodash";

// function Home() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [refreshList, setRefreshList] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [appointmentsPerPage] = useState(15); // Nombre d'éléments par page
//   const dispatch = useDispatch();
//   const auth = useSelector((state) => state.auth.value.user);
//   const appointments = useSelector((state) => state.appointments.item);

//   useEffect(() => {
//     dispatch(appointmentActions.getAppointmentByUser(auth?.id));
//     setRefreshList(false);
//   }, [dispatch, auth?.id, refreshList]);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setRefreshList(true);
//   };

//   const renderAppointments = () => {
//     if (appointments?.loading) {
//       return (
//         <div className="h-screen bg-white">
//           <div className="flex justify-center items-center h-full">
//             <img
//               className="h-16 w-16"
//               src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
//               alt=""
//             />
//           </div>
//         </div>
//       );
//     }

//     if (appointments?.error) {
//       return (
//         <div className="center">
//           <p className="text-red-500">Error Network</p>
//         </div>
//       );
//     }

//     const sortedAppointments = sortBy(
//       appointments?.value,
//       "createdAt"
//     ).reverse();

//     // const sortedAppointments = appointments?.value?.sort((a, b) => {
//     //   return new Date(b.createdAt) - new Date(a.createdAt);
//     // });

//     const indexOfLastAppointment = currentPage * appointmentsPerPage;
//     const indexOfFirstAppointment =
//       indexOfLastAppointment - appointmentsPerPage;
//     const currentAppointments = sortedAppointments.slice(
//       indexOfFirstAppointment,
//       indexOfLastAppointment
//     );

//     return currentAppointments.map((item, index) => {

//       const formattedDate = new Date(item?.date).toLocaleDateString("fr-FR", {
//         day: "numeric",
//         month: "numeric",
//         year: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//       });

//       const formattedDateCreated = new Date(item?.createdAt).toLocaleDateString("fr-FR", {
//         day: "numeric",
//         month: "numeric",
//         year: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//       });

//       return (
//         <tr key={item?.id}>
//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             {" "}
//             <div className="flex text-xs items-center">
//               {index + 1 + (currentPage - 1) * appointmentsPerPage}
//             </div>
//           </td>
//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <p className="text-gray-900 text-xs whitespace-no-wrap">
//               {formattedDateCreated}{" "}
//             </p>
//           </td>
//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <p className="text-gray-900 text-xs whitespace-no-wrap">
//               {item.name?.toUpperCase()}
//             </p>
//           </td>
//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <p className="text-gray-900  text-xs whitespace-no-wrap">
//               {item.phone?.join(" / ").toLocaleString("fr-FR")}
//             </p>
//           </td>

//           <td className="px-3 py-3 border-b border-gray-300 bg-white ">
//             <p
//               className="text-gray-900 text-xs sm:px-6 h-8 whitespace-no-wrap overflow-auto"
//               style={{
//                 maxWidth: "120px",
//               }}
//             >
//               {item.address?.toLowerCase()}
//             </p>
//           </td>

//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <p className="text-gray-900 text-xs whitespace-no-wrap">
//               {formattedDate}
//             </p>
//           </td>
//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <p className="text-gray-900 text-xs whitespace-no-wrap">
//               {item.commercial}
//             </p>
//           </td>

//           <td className="px-3 py-3 border-b border-gray-300 bg-white">
//             <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
//               <span
//                 aria-hidden
//                 className="absolute text-xs inset-0 bg-green-200 opacity-50 rounded-full"
//               ></span>
//               <span className="relative text-xs whitespace-no-wrap">
//                 En-cours
//               </span>
//             </span>
//           </td>
//         </tr>
//       );
//     });
//   };

//   // Fonction pour changer de page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Calcul du nombre total de pages
//   const totalPages = Math.ceil(
//     (appointments?.value?.length || 0) / appointmentsPerPage
//   );

//   return (
//     <>
//       <div className="flex flex-col items-center">
//         <h1 className="text-3xl font-semibold leading-tight mb-4">
//           Hi {auth?.firstName}!
//         </h1>
//         <p className="text-x1 font-semibold leading-tight mb-4">
//           Welcome Marketer
//         </p>
//       </div>

//       <div className="w-full flex justify-center py-12">
//         <button
//           className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 mx-auto transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm"
//           onClick={openModal}
//         >
//           Add new
//         </button>
//         {isModalOpen && <ModalForm isOpen={openModal} onClose={closeModal} />}
//       </div>
//       <br />

//       <div className="antialiased font-sans bg-gray-200  max-w-screen-xl mx-auto">
//         <div className="container mx-auto px-4 sm:px-8">
//           <div className="py-8">
//             <>
//               <h2 className="text-2xl font-semibold leading-tight">
//                 Appointments
//               </h2>
//             </>
//             <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
//               <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
//                 <table className="min-w-full leading-normal">
//                   <thead>
//                     <tr>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         #
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Phone
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Address
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Scheduling Date
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Sales Representative
//                       </th>
//                       <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>{renderAppointments()}</tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           {/* Pagination */}

//           <div className="flex justify-center my-4">
//             {/* <div className="inline-flex mt-2 xs:mt-0"> */}
//             <nav className="block">
//               <ul className="flex pl-0 rounded list-none flex-wrap">
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <li key={index}>
//                     <button
//                       onClick={() => paginate(index + 1)}
//                       className={`${
//                         currentPage === index + 1
//                           ? "bg-indigo-700 text-white"
//                           : "text-indigo-700 hover:bg-indigo-200"
//                       } hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 mx-1 transition duration-150 ease-in-out rounded-md px-3 py-2 text-xs`}
//                     >
//                       {index + 1}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export { Home };

import { useDispatch, useSelector } from "react-redux";
import ModalForm from "_components/PopupForm";
import React, { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import { sortBy } from "lodash";

const DATE_OPTIONS = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};
const APPOINTMENTS_PER_PAGE = 15;

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.value.user);
  const appointments = useSelector((state) => state.appointments.item);

  useEffect(() => {
    dispatch(appointmentActions.getAppointmentByUser(authUser?.id));
    setRefreshList(false);
  }, [dispatch, authUser?.id, refreshList]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRefreshList(true);
  };

  const renderAppointments = () => {
    if (appointments?.loading) {
      return (
        <tr className="h-screen bg-white">
          <td className="flex justify-center items-center h-full">
            <img
              className="h-16 w-16"
              src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
              alt=""
            />
          </td>
        </tr>
      );
    }

    if (appointments?.error) {
      return (
        <tr className="center">
          <td className="text-red-500">Error Network</td>
        </tr>
      );
    }

    const sortedAppointments = sortBy(
      appointments?.value,
      "createdAt"
    ).reverse();

    const indexOfLastAppointment = currentPage * APPOINTMENTS_PER_PAGE;
    const indexOfFirstAppointment =
      indexOfLastAppointment - APPOINTMENTS_PER_PAGE;
    const currentAppointments = sortedAppointments.slice(
      indexOfFirstAppointment,
      indexOfLastAppointment
    );

    return currentAppointments.map((appointment, index) => {
      const formattedDate = new Date(appointment?.date).toLocaleDateString(
        "fr-FR",
        DATE_OPTIONS
      );

      const formattedDateCreated = new Date(
        appointment?.createdAt
      ).toLocaleDateString("fr-FR", DATE_OPTIONS);

      return (
        <tr key={appointment?.id}>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="flex text-xs items-center">
              {index + 1 + (currentPage - 1) * APPOINTMENTS_PER_PAGE}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {formattedDateCreated}{" "}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {appointment.name?.toUpperCase()}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="text-gray-900  text-xs whitespace-no-wrap">
              {appointment.phone?.join(" / ").toLocaleString("fr-FR")}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white ">
            <p
              className="text-gray-900 text-xs sm:px-6 h-8 whitespace-no-wrap overflow-auto"
              style={{
                maxWidth: "120px",
              }}
            >
              {appointment.address?.toLowerCase()}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {formattedDate}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
            <p className="text-gray-900 text-xs whitespace-no-wrap">
              {appointment.commercial}
            </p>
          </td>
          <td className="px-3 py-3 border-b border-gray-300 bg-white">
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(
    (appointments?.value?.length || 0) / APPOINTMENTS_PER_PAGE
  );

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold leading-tight mb-4">
          Hi {authUser?.firstName}!
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
          Add Appointment
        </button>
        {isModalOpen && <ModalForm isOpen={openModal} onClose={closeModal} />}

        {/* {isModalOpen && <ModalForm closeModal={closeModal} />} */}

      </div>
      <div className="w-full flex justify-center">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Date de rendez-vous
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Commercial
              </th>
              <th className="px-3 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>{renderAppointments()}</tbody>
        </table>
      </div>
      <div className="w-full flex justify-center py-4">
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap">
            <li>
              <button
                className="relative block py-2 px-3 leading-ttive block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:shadow-outline-blue active:bg-gray-300 active:text-gray-800 transition duration-150 ease-in-out"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <span className="sr-only">Previous</span>
                <span aria-hidden="true">«</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                 <button
                
                className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:shadow-outline-blue active:bg-gray-300 active:text-gray-800 transition duration-150 ease-in-out ${
                currentPage === i + 1 ? "z-10 bg-indigo-500 text-white" : ""
                }`}
                onClick={() => paginate(i + 1)}
                >
                {i + 1}
                </button> 
              </li>
            ))}
            <li>
              <button
                className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:shadow-outline-blue active:bg-gray-300 active:text-gray-800 transition duration-150 ease-in-out"
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                <span className="sr-only">Next</span>
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export  {Home};
