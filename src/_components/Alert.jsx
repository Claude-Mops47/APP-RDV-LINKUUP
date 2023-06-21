// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// import { alertActions } from "_store";

// export { Alert };

// function Alert() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const alert = useSelector((x) => x.alert.value);

//   useEffect(() => {
//     // clear alert on location change
//     dispatch(alertActions.clear());
//   }, [location]);

//   if (!alert) return null;

//   return (
//     <div className="container">
//       <div className="m-3">
//         <div className={`alert alert-dismissible ${alert.type}`}>
//           {alert.message}
//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => dispatch(alertActions.clear())}
//           ></button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { alertActions } from "_store";

export { Alert };

function Alert() {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useSelector((x) => x.alert.value);

  useEffect(() => {
    // clear alert on location change
    dispatch(alertActions.clear());
  }, [location]);

  if (!alert) return null;

  return (
    <div className="container-alert">
      <div className="mt-4">
        <div
          className={`alert alert-dismissible ${alert.type} bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4`}
        >
          {alert.message}
          <button
            type="button"
            // className="btn-close"
            onClick={() => dispatch(alertActions.clear())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-gray-700"
              viewBox="0 0 16 16"
              width="20"
              height="20"
            >
              <path
                fillRule="evenodd"
                d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
