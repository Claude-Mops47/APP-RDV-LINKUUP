

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "_store";

export { Nav };

function Nav() {
  const auth = useSelector((x) => x.auth.value);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  const role = auth?.user?.role;
  // only show nav when logged in
  if (!auth) return null;

  return (
    <nav className="fixed top-0 w-full bg-white shadow dark:bg-gray-800 z-10">
      <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <Link
          to="/"
          // className="text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
          className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"

        >
          home
        </Link>

        {role === "Admin" && (
          <>
            <Link
              to="/admin"
              className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
            >
              Admin
            </Link>

            <Link
              to="/users"
              className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
            >
              Manage Users
            </Link>
          </>
        )}

        <button
          onClick={logout}
          className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          logout
        </button>
      </div>
    </nav>
  );
}
