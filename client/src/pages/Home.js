import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";
import { resetError } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  dispatch(resetError());
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
