import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { history } from "_helpers";
import { Nav, Alert, PrivateRoute } from "_components";
import { Home } from "home";
import { AccountLayout } from "account";
import { UsersLayout } from "users";
import { AppointmentsLayout, Edit } from "_appointments";
import { Admin } from "admin";
import { useSelector } from "react-redux";

export { App };

function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  const auth = useSelector((x) => x.auth);

  const isAuthenticated = auth && auth.value;

  const userRole = isAuthenticated ? auth.value.user.role : "";

  return (
    // <div className="app-container bg-light">
    <div className="">
      <Nav />
      <Alert />
      {/* <div className="container pt-4 pb-8"> */}
      <div className="">
        <Routes>
          {/* private */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />

            {userRole === "Admin" && (
              <Route path="/admin" element={<Admin />} />
            )}
            <Route path="users/*" element={<UsersLayout />} />
            <Route path="appointments/edit/:id" element={<Edit />} />
          </Route>
          {/* public */}
          <Route path="account/*" element={<AccountLayout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
