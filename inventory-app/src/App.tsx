import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./view/login/SignIn";
import Dashboard from "./view/employee/dashboard";
import AdminDashboard from "./view/admin/dashboard";
import AreaCategory from "./view/admin/area/index";
import CreateArea from "./view/admin/area/create";
import EditArea from "./view/admin/area/edit";
import AdminCategory from "./view/admin/category/index";
import CreateCategory from "./view/admin/category/create";
import EditCategory from "./view/admin/category/edit";
import AdminItem from "./view/admin/item/index";
import CreateItem from "./view/admin/item/create";
import EditItem from "./view/admin/item/edit"; 
import Inventory from "./view/employee/itemrequest/inventory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/area" element={<AreaCategory />} />
        <Route path="/area/create" element={<CreateArea />} />
        <Route path="/area/edit/:areaId" element={<EditArea />} />
        <Route path="/category" element={<AdminCategory />} />
        <Route path="/category/create" element={<CreateCategory />} />
        <Route path="/category/edit/:categoryId" element={<EditCategory />} />
        <Route path="/item" element={<AdminItem />} />
        <Route path="/items/create" element={<CreateItem />} />
        <Route path="/items/edit/:itemId" element={<EditItem />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;