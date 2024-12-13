import AdminOrders from "../features/admin/components/AdminOrders";
import NavBar from "../features/navbar/Navbar";

function AdminOrdersPage() {
  return (
    <>
      <NavBar>
        <AdminOrders></AdminOrders> 
      </NavBar>
    </>
  );
}

export default AdminOrdersPage;
