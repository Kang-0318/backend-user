import { Outlet } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return <div className="auth-layout">{children || <Outlet />}</div>;
};

export default AuthLayout;
