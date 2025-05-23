import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./view/login/SignIn";
import AdminDashboard from "./view/admin/dashboard";
import AdminUser from "./view/admin/user/index";
import AdminUserItem from "./view/admin/useritem/index";
import CreateUserItem from "./view/admin/useritem/create";
import EditUserItem from "./view/admin/useritem/edit";
import CreateUser from "./view/admin/user/create";
import EditUser from "./view/admin/user/edit";
import AreaCategory from "./view/admin/area/index";
// import CreateArea from "./view/admin/area/create";
// import EditArea from "./view/admin/area/edit";
import AdminCategory from "./view/admin/category/index";
// import CreateCategory from "./view/admin/category/create";
import EditCategory from "./view/admin/category/edit";
import AdminItem from "./view/admin/item/index";
import AdminItems from "./view/admin/komponen/index";
import CreateComponent from "./view/admin/komponen/create";
import EditComponent from "./view/admin/komponen/edit";
import CreateItem from "./view/admin/item/create";
import EditItem from "./view/admin/item/edit";
import AdminGroupCode from "./view/admin/groupcode/index";
import CreateGroupCode from "./view/admin/groupcode/create";
import AdminGroupItem from "./view/admin/groupitem/index";
import CreateGroupitem from "./view/admin/groupitem/create";
import ItemRequest from "./view/admin/item-request/index";
import CreateItemRequest from "./view/employee/item-request/create";
import RepairRequest from "./view/admin/repair-request/index";
import CreateRepairRequest from "./view/admin/repair-request/create";
import EditRepairRequest from "./view/admin/repair-request/edit";
import EmployeeDashboard from "./view/employee/dashboard";
import ItemRequestEmployee from "./view/employee/item-request";
import OwnerDashboard from "./view/owner/dashboard";
import ItemRequestOwner from "./view/owner/item-request/index";
import OwnerItem from "./view/owner/items/index";
import OwnerUser from "./view/owner/user/index";
import ProtectedRoute from "./middleware/protectedroute";
import OwnerGroupCode from "./view/owner/groupcode";
import OwnerCategory from "./view/owner/category";
import OwnerArea from "./view/owner/area";
import OwnerGroupItem from "./view/owner/groupitem";



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
              <Route path="users/:userId/useritem/create" element={<CreateUserItem />} />
              <Route path="users/:userId/useritem/edit/:userItemId" element={<EditUserItem />} />
              <Route path="area" element={<AreaCategory />} />
              {/* <Route path="area/create" element={<CreateArea />} />
              <Route path="area/edit/:areaId" element={<EditArea />} /> */}
              <Route path="category" element={<AdminCategory />} />
              {/* <Route path="category/create" element={<CreateCategory />} /> */}
              <Route path="category/edit/:categoryId" element={<EditCategory />} />
              <Route path="items" element={<AdminItem />} />
              <Route path="items/create" element={<CreateItem />} />
              <Route path="items/edit/:itemId" element={<EditItem />} />
              <Route path="items/komponen/:itemId" element={<AdminItems />} />
              <Route path="items/:itemId/komponen/create" element={<CreateComponent />} />
              <Route path="items/:itemId/komponen/edit/:componentId" element={<EditComponent />} />
              <Route path="item-request" element={<ItemRequest />} />
              <Route path="repair-request" element={<RepairRequest />} />
              <Route path="repair-request/create" element={<CreateRepairRequest />} />
              <Route path="repair-request/edit/:itemId" element={<EditRepairRequest />} />
              <Route path="groupcode" element={<AdminGroupCode />} />
              <Route path="groupcode/create" element={<CreateGroupCode />} />
              <Route path="groupcode/groupitem/:groupId" element={<AdminGroupItem />} />
              <Route path="groupcode/:groupId/groupitem/create" element={<CreateGroupitem />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Employee Dashboard */}
        <Route path="/employee-dashboard/*" element={
          <ProtectedRoute requiredRole="employee">
            <Routes>
              <Route index element={<EmployeeDashboard />} />
              <Route path="item-request" element={<ItemRequestEmployee />} />
              <Route path="item-request/create" element={<CreateItemRequest />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Owner Dashboard */}
        <Route path="/owner-dashboard/*" element={
          <ProtectedRoute requiredRole="owner">
            <Routes>
              <Route index element={<OwnerDashboard />} />
              <Route path="item-request" element={<ItemRequestOwner />} />
              <Route path="items" element={<OwnerItem />} />
              <Route path="users" element={<OwnerUser />} />
              <Route path="groupcode" element={<OwnerGroupCode />} />
              <Route path="category" element={<OwnerCategory />} />
              <Route path="area" element={<OwnerArea />} />
              <Route path="groupcode/groupitem/:groupId" element={<OwnerGroupItem />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<h2>403 - Unauthorized</h2>} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
