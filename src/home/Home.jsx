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
      const formattedDateCreated = moment(item?.createdAt).format("DD-MM [à] HH:mm");

      return (
        <tr key={item?.id}>
          <td>{index + 1}</td>
          <td>{formattedDateCreated}</td>
          <td>{item.name?.toUpperCase()}</td>
          <td>{item.phone?.join(" / ").toLocaleString("fr-FR")}</td>
          <td>{item.address?.toLowerCase()}</td>
          <td>{formattedDate}</td>
          <td>{item.commercial}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h1>Hi {auth?.firstName}!</h1>
      <p>Welcome Marketer</p>

      <div>
        <button className="btn btn-outline-primary" onClick={openModal}>
          Add new
        </button>
        {isModalOpen && <ModalForm isOpen={openModal} onClose={closeModal} />}
      </div>
      <br />

      <div className="table-wrapper">
        <h2>Appointments</h2>

        <table className="fl-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Scheduling Date</th>
              <th>Sales Representative</th>
            </tr>
          </thead>
          <tbody>{renderAppointments()}</tbody>
        </table>
      </div>
    </div>
  );
}

export { Home };
