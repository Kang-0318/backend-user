import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthed } = useContext(AuthContext);

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
