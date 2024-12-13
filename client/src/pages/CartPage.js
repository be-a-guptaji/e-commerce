import Cart from "../features/cart/Cart";
import NavBar from "../features/navbar/Navbar";

function CartPage() {
  return (
    <>
      <NavBar>
        <h1 className="mx-auto text-2xl font-bold">Cart</h1>
        <Cart></Cart>
      </NavBar>
    </>
  );
}

export default CartPage;