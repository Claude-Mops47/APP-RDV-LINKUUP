
import { useDispatch, useSelector } from "react-redux";
import ModalForm from "_components/PopupForm";
import React, { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import moment from "moment";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.value.user);
  const appointments = useSelector((state) => state.appointments.item);

  useEffect(() => {
    dispatch(appointmentActions.getAppointment(auth?.id));
    setRefreshList(false);
  }, [dispatch, auth?.id, refreshList]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRefreshList(true);
  };

  const renderPhoneNumbers = (phone) => {
    if (Array.isArray(phone)) {
      return phone.join(" / ")
    }
    return null;
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

    return appointments?.value?.map((item, index) => {
      const formattedDate = moment(item.date).format("DD-MM-YY [à] HH:mm");
      const formattedDateCreated = moment(item?.createdAt).format("DD-MMMM");

      return (
        <tr key={item._id}>
          <td>{index + 1}</td>
          <td>{formattedDateCreated}</td>
          <td>{item.name}</td>
          <td>{item.phone.join(' / ')}</td>
          <td>{item.address}</td>
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
        <h2>Rendez-vous</h2>

        <table className="fl-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Telephone</th>
              <th>Address</th>
              <th>Date programmation</th>
              <th>Commercial</th>
            </tr>
          </thead>
          <tbody>
            {renderAppointments()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Home };
