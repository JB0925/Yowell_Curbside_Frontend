import { useHistory } from "react-router-dom";

const RequireAuth = () => {
  const history = useHistory();
  const allowListed = window.localStorage.getItem("allowListed") || null;
  allowListed === "true"
    ? history.push(window.location.pathname)
    : history.push("/login");
};

export default RequireAuth;
