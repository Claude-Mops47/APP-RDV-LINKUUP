import { useSelector } from "react-redux";
import { AllList } from "_appointments/AllList";

function Admin() {
  const auth = useSelector((state) => state.auth.value.user);
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold leading-tight mb-4">
          Hi {auth?.firstName}!
        </h1>
        <p className="text-x1 font-semibold leading-tight mb-4">Welcome Admin</p>
      </div>

      {/* All list appointments */}
      <AllList />
    </>
  );
}
export { Admin };
