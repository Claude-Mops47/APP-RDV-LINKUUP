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
            {appointments?.value?.map((item, idenx) => {
              const phoneNumbers = Array.isArray(item.phone)
                ? item.phone.join(" ").split("/")
                : null;
                // date pro
              const dateStr = item.date;
              const dateObj = moment(dateStr);
              const formattedDate = dateObj.format("DD-MM-YY [à] HH:mm");
               // date created
               const dateCreated = item?.createdAt;
               const dateObj2 = moment(dateCreated);
               const formattedDateCreated = dateObj2.format("DD-MMMM");
              return (
                <tr key={item._id}>
                  <td>{idenx + 1}</td>
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
                <td className="text-center">
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
      </div>
    </div>
  );
}
