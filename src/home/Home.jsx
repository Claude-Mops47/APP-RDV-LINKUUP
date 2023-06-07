import { useDispatch, useSelector } from "react-redux";
import ModalForm from "_components/PopupForm";
import React, { useEffect, useState } from "react";
import { appointmentActions } from "_store";
import moment from "moment";

export { Home };

function Home() {
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRefreshList(true);
  };

  const dispatch = useDispatch();
  const auth = useSelector((x) => x.auth.value.user);
  const appointments = useSelector((x) => x.appointments.item);

  // console.log(appointments);

  useEffect(() => {
    dispatch(appointmentActions.getAppointment(auth?.id));
    setRefreshList(false);
  }, [dispatch, auth?.id, refreshList]);

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
              <th style={{ width: "3%" }}>#</th>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "20%" }}>Telephone</th>
              <th style={{ width: "30%" }}>Address</th>
              <th style={{ width: "20%" }}>Date programmation</th>
              <th style={{ width: "20%" }}>Commercial</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.value?.map((item, idenx) => {
              const phoneNumbers = Array.isArray(item.phone)
                ? item.phone.join(" ").split("/")
                : null;
              const dateStr = item.date;
              const dateObj = moment(dateStr);
              const formattedDate = dateObj.format("DD-MM-YY [à] HH:mm");
              return (
                <tr key={item._id}>
                  <td>{idenx + 1}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
