import { useContext } from "react";
import { axiosInstance } from "../../axiosInstance";
import { ApiRoutes } from "../../routes/apiRoutes";
import { useNavigate } from "react-router";
import UserContext from "../../Context/UserContext";

const AuthService = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const loginUser = async (credentials) => {
    try {
      const { data } = await axiosInstance.post(ApiRoutes.LOGIN, {
        ...credentials,
      });
      const { token = "", member = {} } = data;

      localStorage.setItem("MEMBER", JSON.stringify(member));
      localStorage.setItem("TOKEN", token);

      setUser(member);

      navigate("/books", {
        replace: true,
      });
    } catch (ex) {}
  };

  return { loginUser };
};

export default AuthService;
