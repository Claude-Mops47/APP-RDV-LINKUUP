import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AllList } from "_appointments/AllList";

function Admin() {
  const auth = useSelector((state) => state.auth.value.user);
  return (
    <div>
      <h1>Hi {auth?.firstName}!</h1>
      <p>Welcome Admin</p>

      <p>
        <Link to="/users">Manage Users</Link>
      </p>

      {/* All list appointments */}
      <AllList />
    </div>
  );
}
export { Admin };
