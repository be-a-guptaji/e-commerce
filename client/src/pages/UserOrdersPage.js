import NavBar from "../features/navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";

function UserOrdersPage() {
  return (
    <>
      <NavBar>
        <h1 className="mx-4 text-2xl font-bold">My Orders</h1>
        <UserOrders></UserOrders>
      </NavBar>
    </>
  );
}

export default UserOrdersPage;