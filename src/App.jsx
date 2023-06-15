import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { history } from "_helpers";
import { Nav, Alert, PrivateRoute, Footer } from "_components";
import { Home } from "home";
import { AccountLayout } from "account";
import { UsersLayout } from "users";
import { Edit } from "_appointments";
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
    <div className="flex flex-col min-h-screen bg-gray-500">
      <Nav />
      <Alert />
      {/* bg-gray-400 */}
      <div className="flex-grow mt-20">
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

      <Footer className="mt-auto" />
    </div>
  );
}
