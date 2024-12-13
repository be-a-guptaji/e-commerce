import ProductForm from "../features/admin/components/ProductForm";
import NavBar from "../features/navbar/Navbar";
function AdminProductFormPage() {
  return (
    <>
      <NavBar>
        <ProductForm></ProductForm>
      </NavBar>
    </>
  );
}

export default AdminProductFormPage;