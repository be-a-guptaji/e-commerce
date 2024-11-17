import NavBar from "../features/navbar/Navbar";
import ProductDetail from "../features/product/components/ProductDetail";
import Footer from "../features/common/Footer";

function ProductDetailPage() {
  return (
    <>
      <NavBar>
        <ProductDetail></ProductDetail>
      </NavBar>
      <Footer />
    </>
  );
}

export default ProductDetailPage;
