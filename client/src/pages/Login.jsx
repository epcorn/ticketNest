import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginData));
  };
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center border border-sky-400 w-96 h-96 ">
        <h1 className=" text-3xl mb-4  font-bold ">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="">
            <label
              htmlFor="username"
              className="block mb-2 font-bold text-blue-600"
            >
              Enter Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Username..."
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="block mb-2 font-bold text-blue-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={(e) => handleChange(e)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="********"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold mt-2 px-8 py-2 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className=" pr-3">Loading...</span>
                <Spinner size="sm" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
