import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectProductById,
  updateProductAsync,
} from "../../product/productSlice";
import { createBrandAsync, selectBrands } from "../../brands/brandSlice";
import { createCategoryAsync, selectCategories } from "../../category/categorySlice";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/components/Modal";
import { ToastContainer, toast } from "react-toastify";

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>;

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("stock", selectedProduct.stock);
      setValue("image1", selectedProduct.images[0]);
      setValue("image2", selectedProduct.images[1]);
      setValue("image3", selectedProduct.images[2]);
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = { ...selectedProduct, deleted: true };
    dispatch(updateProductAsync(product));
    toast.success("Product Deleted Successfully");
    navigate("/admin", { replace: true });
  };

  const handleAddBrand = () => {
    dispatch(createBrandAsync());
  };

  const handleAddCategory = () => {
    dispatch(createCategoryAsync());
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          let product = { ...data };
          product.images = [
            product.image1,
            product.image2,
            product.image3,
            product.thumbnail,
          ];
          product.rating = 0;

          delete product["image1"];
          delete product["image2"];
          delete product["image3"];

          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;

          if (params.id && !openModal) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAsync(product));
            toast.success("Product Updated Successfully");
            reset();
          } else if (!openModal) {
            dispatch(createProductAsync(product));
            toast.success("Product Created Successfully");
            reset();
          }

          if (!openModal) {
            navigate("/admin", { replace: true });
          }
        })}
      >
        {openModal === "delete" && (
          <Modal
            title={`Delete ${selectedProduct?.title}`}
            message="Are you sure you want to delete this Product ?"
            dangerOption="Delete"
            input={false}
            cancelOption="Cancel"
            dangerAction={() => handleDelete()}
            cancelAction={() => setOpenModal(null)}
            showModal={openModal}
          ></Modal>
        )}
        {openModal === "addBrand" && (
          <Modal
            title={`Add Brand`}
            message="Enter the name of the brand"
            input={true}
            dangerOption="Add Brand"
            cancelOption="Cancel"
            dangerAction={() => handleAddBrand()}
            cancelAction={() => setOpenModal(null)}
            showModal={openModal}
          ></Modal>
        )}
        {openModal === "addCategory" && (
          <Modal
            title={`Add Category`}
            message="Enter the name of the category"
            dangerOption="Add Category"
            input={true}
            cancelOption="Cancel"
            dangerAction={() => handleAddCategory()}
            cancelAction={() => setOpenModal(null)}
            showModal={openModal}
          ></Modal>
        )}
        {openModal === "save" && (
          <Modal
            title={`Save ${selectedProduct?.title}`}
            message="Are you sure you want toadd this Product ?"
            dangerOption="Save"
            input={false}
            cancelOption="Cancel"
            dangerAction={() => handleDelete()}
            cancelAction={() => setOpenModal(null)}
            showModal={openModal}
          ></Modal>
        )}
        {openModal === "update" && (
          <Modal
            title={`Updated ${selectedProduct?.title}`}
            message="Are you sure you want to update this Product ?"
            dangerOption="Update"
            input={false}
            cancelOption="Cancel"
            dangerAction={() => handleDelete()}
            cancelAction={() => setOpenModal(null)}
            showModal={openModal}
          ></Modal>
        )}
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Product
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                {selectedProduct?.deleted && (
                  <h2 className="text-red-500 sm:col-span-6">
                    This product is deleted
                  </h2>
                )}
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      {...register("title", {
                        required: "name is required",
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about product.
                </p>
              </div>

              <div className="col-span-full flex justify-start items-end gap-4">
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Brand
                  </label>
                  <div className="mt-2">
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4 w-48"
                      {...register("brand", {
                        required: "brand is required",
                      })}
                    >
                      <option value="">--choose brand--</option>
                      {brands.map((brand) => (
                        <option value={brand.value} key={brand.id}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40"
                  onClick={() => setOpenModal("addBrand")}
                >
                  Add Brand
                </button>
              </div>

              <div className="col-span-full flex justify-start items-end gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4 w-48"
                      {...register("category", {
                        required: "category is required",
                      })}
                    >
                      <option value="">--choose category--</option>
                      {categories.map((category) => (
                        <option value={category.value} key={category.id}>
                          {category.label}{" "}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40"
                  onClick={() => setOpenModal("addCategory")}
                >
                  Add Category
                </button>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="number"
                      {...register("price", {
                        required: "price is required",
                        min: 1,
                        max: 10000,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="number"
                      {...register("discountPercentage", {
                        required: "discountPercentage is required",
                        min: 0,
                        max: 100,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="number"
                      {...register("stock", {
                        required: "stock is required",
                        min: 0,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Thumbnail
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      {...register("thumbnail", {
                        required: "thumbnail is required",
                      })}
                      id="thumbnail"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 1
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      {...register("image1", {
                        required: "image1 is required",
                      })}
                      id="image1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 2
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      {...register("image2", {
                        required: "image is required",
                      })}
                      id="image2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 3
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      {...register("image3", {
                        required: "image is required",
                      })}
                      id="image3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            to="/admin"
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Link>

          {selectedProduct && !selectedProduct.deleted && (
            <>
              <button
                onClick={() => {
                  setOpenModal("delete");
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Delete
              </button>

              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
              </button>
            </>
          )}
          {!selectedProduct && (
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default ProductForm;
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearSelectedProduct,
//   createProductAsync,
//   fetchProductByIdAsync,
//   selectBrands,
//   selectCategories,
//   selectProductById,
//   updateProductAsync,
// } from "../../product/productSlice";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Modal from "../../common/components/Modal";
// import { ToastContainer, toast } from "react-toastify";

// <ToastContainer
//   position="top-right"
//   autoClose={5000}
//   hideProgressBar={false}
//   newestOnTop={false}
//   closeOnClick
//   rtl={false}
//   pauseOnFocusLoss
//   draggable
//   pauseOnHover
//   theme="colored"
// />;

// function ProductForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const navigate = useNavigate();
//   const brands = useSelector(selectBrands);
//   const categories = useSelector(selectCategories);
//   const dispatch = useDispatch();
//   const params = useParams();
//   const selectedProduct = useSelector(selectProductById);
//   const [openModal, setOpenModal] = useState(null);

//   useEffect(() => {
//     if (params.id) {
//       dispatch(fetchProductByIdAsync(params.id));
//     } else {
//       dispatch(clearSelectedProduct());
//     }
//   }, [params.id, dispatch]);

//   useEffect(() => {
//     if (selectedProduct && params.id) {
//       setValue("title", selectedProduct.title);
//       setValue("description", selectedProduct.description);
//       setValue("price", selectedProduct.price);
//       setValue("discountPercentage", selectedProduct.discountPercentage);
//       setValue("thumbnail", selectedProduct.thumbnail);
//       setValue("stock", selectedProduct.stock);
//       setValue("image1", selectedProduct.images[0]);
//       setValue("image2", selectedProduct.images[1]);
//       setValue("image3", selectedProduct.images[2]);
//       setValue("brand", selectedProduct.brand);
//       setValue("category", selectedProduct.category);
//     }
//   }, [selectedProduct, params.id, setValue]);

//   const handleDelete = () => {
//     const product = { ...selectedProduct, deleted: true };
//     dispatch(updateProductAsync(product));
//     toast.success("Product Deleted Successfully");
//     navigate("/admin", { replace: true });
//   };

//   return (
//     <>
//       <form
//         noValidate
//         onSubmit={handleSubmit((data) => {
//           let product = { ...data };
//           product.images = [
//             product.image1,
//             product.image2,
//             product.image3,
//             product.thumbnail,
//           ];
//           product.rating = 0;

//           delete product["image1"];
//           delete product["image2"];
//           delete product["image3"];

//           product.price = +product.price;
//           product.stock = +product.stock;
//           product.discountPercentage = +product.discountPercentage;

//           if (params.id && !openModal) {
//             product.id = params.id;
//             product.rating = selectedProduct.rating || 0;
//             dispatch(updateProductAsync(product));
//             toast.success("Product Updated Successfully");
//             reset();
//           } else if (!openModal) {
//             dispatch(createProductAsync(product));
//             toast.success("Product Created Successfully");
//             reset();
//           }

//           if (!openModal) {
//             navigate("/admin", { replace: true });
//           }
//         })}
//       >
//         <Modal
//           title={`Delete ${selectedProduct?.title}`}
//           message="Are you sure you want to delete this Product ?"
//           dangerOption="Delete"
//           cancelOption="Cancel"
//           dangerAction={() => handleDelete()}
//           cancelAction={() => setOpenModal(null)}
//           showModal={openModal}
//         ></Modal>
//         <div className="space-y-12 bg-white p-12">
//           <div className="border-b border-gray-900/10 pb-12">
//             <h2 className="text-base font-semibold leading-7 text-gray-900">
//               Add Product
//             </h2>

//             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//               <div className="sm:col-span-6">
//                 {selectedProduct?.deleted && (
//                   <h2 className="text-red-500 sm:col-span-6">
//                     This product is deleted
//                   </h2>
//                 )}
//                 <label
//                   htmlFor="title"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Product Name
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="text"
//                       {...register("title", {
//                         required: "name is required",
//                       })}
//                       id="title"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="col-span-full">
//                 <label
//                   htmlFor="description"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Description
//                 </label>
//                 <div className="mt-2">
//                   <textarea
//                     id="description"
//                     {...register("description", {
//                       required: "description is required",
//                     })}
//                     rows={3}
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                     defaultValue={""}
//                   />
//                 </div>
//                 <p className="mt-3 text-sm leading-6 text-gray-600">
//                   Write a few sentences about product.
//                 </p>
//               </div>

//               <div className="col-span-full flex justify-start items-end gap-4">
//                 <div>
//                   <label
//                     htmlFor="brand"
//                     className="block text-sm font-medium leading-6 text-gray-900"
//                   >
//                     Brand
//                   </label>
//                   <div className="mt-2">
//                     <select
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4 w-48"
//                       {...register("brand", {
//                         required: "brand is required",
//                       })}
//                     >
//                       <option value="">--choose brand--</option>
//                       {brands.map((brand) => (
//                         <option value={brand.value} key={brand.id}>
//                           {brand.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40">
//                   Add Brand
//                 </button>
//               </div>

//               <div className="col-span-full flex justify-start items-end gap-4">
//                 <div>
//                   <label
//                     htmlFor="category"
//                     className="block text-sm font-medium leading-6 text-gray-900"
//                   >
//                     Category
//                   </label>
//                   <div className="mt-2">
//                     <select
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4 w-48"
//                       {...register("category", {
//                         required: "category is required",
//                       })}
//                     >
//                       <option value="">--choose category--</option>
//                       {categories.map((category) => (
//                         <option value={category.value} key={category.id}>
//                           {category.label}{" "}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40">
//                   Add Category
//                 </button>
//               </div>

//               <div className="sm:col-span-2">
//                 <label
//                   htmlFor="price"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Price
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="number"
//                       {...register("price", {
//                         required: "price is required",
//                         min: 1,
//                         max: 10000,
//                       })}
//                       id="price"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <label
//                   htmlFor="discountPercentage"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Discount Percentage
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="number"
//                       {...register("discountPercentage", {
//                         required: "discountPercentage is required",
//                         min: 0,
//                         max: 100,
//                       })}
//                       id="discountPercentage"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <label
//                   htmlFor="stock"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Stock
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="number"
//                       {...register("stock", {
//                         required: "stock is required",
//                         min: 0,
//                       })}
//                       id="stock"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-6">
//                 <label
//                   htmlFor="thumbnail"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Thumbnail
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="text"
//                       {...register("thumbnail", {
//                         required: "thumbnail is required",
//                       })}
//                       id="thumbnail"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-6">
//                 <label
//                   htmlFor="image1"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Image 1
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="text"
//                       {...register("image1", {
//                         required: "image1 is required",
//                       })}
//                       id="image1"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-6">
//                 <label
//                   htmlFor="image2"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Image 2
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="text"
//                       {...register("image2", {
//                         required: "image is required",
//                       })}
//                       id="image2"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="sm:col-span-6">
//                 <label
//                   htmlFor="image2"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Image 3
//                 </label>
//                 <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
//                     <input
//                       type="text"
//                       {...register("image3", {
//                         required: "image is required",
//                       })}
//                       id="image3"
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex items-center justify-end gap-x-6">
//           <Link
//             to="/admin"
//             type="button"
//             className="text-sm font-semibold leading-6 text-gray-900"
//           >
//             Cancel
//           </Link>

//           {selectedProduct && !selectedProduct.deleted && (
//             <>
//               <button
//                 onClick={() => {
//                   setOpenModal(true);
//                 }}
//                 className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Delete
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Save
//               </button>
//             </>
//           )}
//           {!selectedProduct && (
//             <button
//               type="submit"
//               className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Save
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// export default ProductForm;
