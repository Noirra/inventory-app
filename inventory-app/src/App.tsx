import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./view/login/SignIn";
import AdminDashboard from "./view/admin/dashboard";
import AdminUser from "./view/admin/user/index";
import AdminUserItem from "./view/admin/useritem/index";
import CreateUser from "./view/admin/user/create";
import EditUser from "./view/admin/user/edit";
import AreaCategory from "./view/admin/area/index";
import CreateArea from "./view/admin/area/create";
import EditArea from "./view/admin/area/edit";
import AdminCategory from "./view/admin/category/index";
import CreateCategory from "./view/admin/category/create";
import EditCategory from "./view/admin/category/edit";
import AdminItem from "./view/admin/item/index";
import AdminItems from "./view/admin/komponen/index";
import CreateItem from "./view/admin/item/create";
import EditItem from "./view/admin/item/edit";
import ItemRequest from "./view/admin/item-request/index";
import CreateItemRequest from "./view/admin/item-request/create";
import EditItemRequest from "./view/admin/item-request/edit";
import RepairRequest from "./view/admin/repair-request/index";
import CreateRepairRequest from "./view/admin/repair-request/create";
import EditRepairRequest from "./view/admin/repair-request/edit";
import EmployeeDashboard from "./view/employee/dashboard";
import Inventory from "./view/employee/itemrequest/inventory";
import OwnerDashboard from "./view/owner/dashboard";
import ProtectedRoute from "./middleware/protectedroute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SignIn />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard/*" element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUser />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route path="users/edit/:userId" element={<EditUser />} />
              <Route path="users/useritem/:userId" element={<AdminUserItem />} />
              <Route path="area" element={<AreaCategory />} />
              <Route path="area/create" element={<CreateArea />} />
              <Route path="area/edit/:areaId" element={<EditArea />} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="category/create" element={<CreateCategory />} />
              <Route path="category/edit/:categoryId" element={<EditCategory />} />
              <Route path="item" element={<AdminItem />} />
              <Route path="items/create" element={<CreateItem />} />
              <Route path="items/edit/:itemId" element={<EditItem />} />
              <Route path="items/komponen/:itemId" element={<AdminItems />} />
              <Route path="item-request" element={<ItemRequest />} />
              <Route path="item-request/create" element={<CreateItemRequest />} />
              <Route path="item-request/edit/:itemId" element={<EditItemRequest />} />
              <Route path="repair-request" element={<RepairRequest />} />
              <Route path="repair-request/create" element={<CreateRepairRequest />} />
              <Route path="repair-request/edit/:itemId" element={<EditRepairRequest />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Employee Dashboard */}
        <Route path="/employee-dashboard/*" element={
          <ProtectedRoute requiredRole="employee">
            <Routes>
              <Route index element={<EmployeeDashboard />} />
              <Route path="inventory" element={<Inventory />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Owner Dashboard */}
        <Route path="/owner-dashboard" element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<h2>403 - Unauthorized</h2>} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
