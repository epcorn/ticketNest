import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/user/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import avatarImage from "../images/avatar.png";
import logo from "../images/logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = async () => {
    dispatch(logout());
  };

  const location = useLocation();

  return (
    <Navbar fluid rounded className="border-b-2 max-w-[1400px] mx-auto ">
      <Navbar.Brand className=" cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} className="mr-1 h-[65px] " alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          TicketNest
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2">
        {currentUser && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={avatarImage} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{`${currentUser?.username}`}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as="div" active={location.pathname === "/" ? true : false}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        {(currentUser?.rights.create || currentUser?.rights.admin) && (
          <Navbar.Link
            as="div"
            active={location.pathname === "/create" ? true : false}
          >
            <Link to="/create">Create</Link>
          </Navbar.Link>
        )}
        {(currentUser?.rights.assign ||
          currentUser?.rights.admin ||
          currentUser?.rights.markDone) && (
          <Navbar.Link
            as="div"
            active={location.pathname === "/assign" ? true : false}
          >
            <Link to="/assign">Assign</Link>
          </Navbar.Link>
        )}
        {currentUser?.rights.admin && (
          <Navbar.Link
            as="div"
            active={location.pathname === "/user" ? true : false}
          >
            <Link to="/user">User</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
