import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/components/Footer";
import { resetUserError } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetUserError());
  }, [dispatch]);

  dispatch(resetUserError());
  return (
    <>
      <NavBar>
        <ProductList></ProductList>
      </NavBar>
      <Footer></Footer>
    </>
  );
}

export default Home;