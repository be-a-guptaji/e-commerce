import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";

function Home() {
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
