import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  register,
  updateUser,
  deleteUser,
} from "../redux/user/userSlice";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import { unwrapResult } from "@reduxjs/toolkit";

const userInit = {
  username: "",
  password: "",
  rights: {
    create: false,
    assign: false,
    markDone: false,
    admin: false,
  },
};
export default function User() {
  const { currentUser, allUsers } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(userInit);
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    if (!currentUser.rights.admin) {
      navigate("/");
    } else {
      dispatch(getUsers());
    }
  }, [currentUser, navigate, dispatch]);

  const handleRights = (e) => {
    if (e.target.checked) {
      setUser((prev) => ({
        ...prev,
        rights: {
          ...prev.rights,
          [e.target.id]: true,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        rights: {
          ...prev.rights,
          [e.target.id]: false,
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerUser = async () => {
    const resultAction = await dispatch(register(user));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(resultAction);
    onCloseModal();
    setUser(userInit);
  };
  const handleUpdateUser = async () => {
    const resultAction = await dispatch(updateUser(user));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(resultAction);
    onCloseModal();
    setUpdate(false);
    setUser(userInit);
  };
  const deleteIt = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen mt-2">
      <div className=" mt-2 h-full">
        <div className="h-16 text-lg flex items-center justify-between font-medium bg-yellow-100 border border-yellow-500 rounded-tl-lg rounded-br-lg">
          <div className="flex-grow mr-4 ">
            <div className="flex items-center justify-center">
              <h3>All Users</h3>
            </div>
          </div>
          <div>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded mr-2"
            >
              New User
            </button>
          </div>
        </div>
        <div className=" overflow-x-auto ">
          <Table>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Rights</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {allUsers.length > 0 &&
                allUsers.map((user) => (
                  <Table.Row
                    key={user._id}
                    className={
                      currentUser._id === user._id ? "bg-gray-100" : ""
                    }
                  >
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell className="border">
                      <div className="flex items-center justify-evenly flex-wrap">
                        <div className="flex items-center justify-evenly">
                          <div className="mr-2">
                            <div className="mb-2 block">
                              <Label htmlFor="create" value="Create" />
                            </div>
                            <Checkbox
                              disabled
                              id="create"
                              value="create"
                              checked={user.rights.create}
                            />
                          </div>
                          <div className="">
                            <div className="mb-2 block">
                              <Label htmlFor="assign" value="Assign" />
                            </div>
                            <Checkbox
                              disabled
                              id="assign"
                              value="assign"
                              checked={user.rights.assign}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-evenly">
                          <div className="mr-2">
                            <div className="mb-2 block">
                              <Label htmlFor="markDone" value="Done" />
                            </div>
                            <Checkbox
                              disabled
                              id="markDone"
                              value="markDone"
                              checked={user.rights.markDone}
                            />
                          </div>
                          <div className="">
                            <div className="mb-2 block">
                              <Label htmlFor="admin" value="Admin" />
                            </div>
                            <Checkbox
                              disabled
                              id="admin"
                              value="admin"
                              checked={user.rights.admin}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="border">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <Button
                          pill
                          color="yellow"
                          onClick={() => [
                            setOpenModal(true),
                            setUser(user),
                            setUpdate(true),
                          ]}
                        >
                          Edit
                        </Button>
                        <Button
                          pill
                          color={user.active ? "failure" : "success"}
                          onClick={() =>
                            dispatch(
                              updateUser({ ...user, active: !user.active })
                            )
                          }
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          pill
                          color="red"
                          onClick={() => deleteIt(user._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => [onCloseModal(), setUpdate(false), setUser(userInit)]}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {update ? "Update User" : "Create User"}
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Enter Username" />
              </div>
              <TextInput
                id="username"
                name="username"
                placeholder="username..."
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Enter password" />
              </div>
              <TextInput
                id="password"
                name="password"
                placeholder="********"
                type="text"
                value={user.password}
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-evenly ">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="create" value="Create" />
                </div>
                <Checkbox
                  id="create"
                  value="create"
                  checked={user.rights.create}
                  onClick={(e) => handleRights(e)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="assign" value="Assign" />
                </div>
                <Checkbox
                  id="assign"
                  value="assign"
                  checked={user.rights.assign}
                  onClick={(e) => handleRights(e)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="markDone" value="Mark Done" />
                </div>
                <Checkbox
                  id="markDone"
                  value="markDone"
                  checked={user.rights.markDone}
                  onClick={(e) => handleRights(e)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="admin" value="Admin" />
                </div>
                <Checkbox
                  id="admin"
                  value="admin"
                  checked={user.rights.admin}
                  onClick={(e) => handleRights(e)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                onClick={() => (update ? handleUpdateUser() : registerUser())}
              >
                {update ? "Edit User" : "Create User"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
