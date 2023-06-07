import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { appointmentActions } from "_store";
import moment from "moment";

export { Admin };

function Admin() {
  const dispatch = useDispatch();
  const auth = useSelector((x) => x.auth.value.user);
  const appointments = useSelector((x) => x.appointments.list);

  console.log(appointments);

  useEffect(() => {
    dispatch(appointmentActions.getAllAppointments());
  }, []);

  return (
    <div>
      <h1>Hi {auth?.firstName}!</h1>
      <p>Welcome Admin</p>
      <p>
        <Link to="/users">Manage Users</Link>
      </p>

      <div className="table-wrapper">
      <h2>Liste des rendez-vous</h2>

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
            {appointments?.value?.map((item, index) => {
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
              const formattedDateCreated = dateObj2.format("DD-MM-YY");

              console.log(dateCreated);
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
