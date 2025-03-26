import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Login,
  Layout,
  PageNotFound,
  User,
  Create,
  Assign,
  Home,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" pauseOnFocusLoss={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/assign" element={<Assign />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
