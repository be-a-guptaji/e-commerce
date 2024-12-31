import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectProductById,
  updateProductAsync,
} from "../../product/productSlice";
import { createBrandAsync, selectBrands } from "../../brands/brandSlice";
import {
  createCategoryAsync,
  selectCategories,
} from "../../category/categorySlice";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useForm, useFieldArray, get } from "react-hook-form";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [item, setItem] = useState({});
  const [openModal, setOpenModal] = useState(null);
  const [newColor, setNewColor] = useState("#000000");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      colors: [],
      sizes: [],
    },
  });

  const { append: appendColors, remove: removeColors } = useFieldArray({
    control,
    name: "colors", 
  });

  const { append: appendSizes, remove: removeSizes } = useFieldArray({
    control,
    name: "sizes",
  });

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
      setValue("colors", selectedProduct.colors);
      setValue("sizes", selectedProduct.sizes);
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

  const handleUpdate = () => {
    dispatch(updateProductAsync(item));
    toast.success("Product Updated Successfully");
    reset();
    navigate("/admin", { replace: true });
  };

  const handleSave = () => {
    dispatch(createProductAsync(item));
    toast.success("Product Created Successfully");
    reset();
    navigate("/admin", { replace: true });
  };

  const handleAddColor = () => {
    const colors = getValues("colors");

    if (!colors.includes(newColor)) {
      appendColors(newColor);
      toast.success("Color added");
    } else {
      toast.error("Color already added");
    }
  };

  const handleRemoveColor = (index) => {
    removeColors(index);
    toast.success("Color removed");
  };

  const handleAddSize = () => {
    const sizes = getValues("sizes");

    if (!sizes.includes(newColor)) {
      appendSizes(newColor);
      toast.success("Size added");
    } else {
      toast.error("Size already added");
    }
  };

  const handleRemoveSize = (index) => {
    removeSizes(index);
    toast.success("Size removed");
  };

  useEffect(() => {
    // if (getValues("colors").length !== 0 && getValues("sizes").length !== 0) {
    if (
      getValues("colors").length === 0 &&
      getValues("sizes").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("colors", {
        type: "manual",
        message: "Add at least one color",
      });
      setError("sizes", {
        type: "manual",
        message: "Add at least one size",
      });
    } else if (
      getValues("colors").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("colors", {
        type: "manual",
        message: "Add at least one color",
      });
    } else if (
      getValues("sizes").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("sizes", {
        type: "manual",
        message: "Add at least one size",
      });
    }
    // }
  }, [
    getValues,
    setError,
    errors,
    getValues("colors").length,
    getValues("sizes").length,
  ]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      if (getValues("colors").length === 0 && getValues("sizes").length === 0) {
        setError("colors", {
          type: "manual",
          message: "Add at least one color",
        });
        setError("sizes", {
          type: "manual",
          message: "Add at least one size",
        });
      } else if (getValues("colors").length === 0) {
        setError("colors", {
          type: "manual",
          message: "Add at least one color",
        });
      } else if (getValues("sizes").length === 0) {
        setError("sizes", {
          type: "manual",
          message: "Add at least one size",
        });
      }
    }
  }, [getValues, setError, errors]);

  useEffect(() => {
    if (getValues("colors").length > 0 && getValues("sizes").length > 0) {
      clearErrors("colors");
      clearErrors("sizes");
    } else if (getValues("colors").length > 0) {
      clearErrors("colors");
    } else if (getValues("sizes").length > 0) {
      clearErrors("sizes");
    }
  }, [
    clearErrors,
    getValues("colors").length,
    getValues("sizes").length,
    getValues,
  ]);

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
          product.colors = product.colors || [];
          product.sizes = product.sizes || [];

          delete product["image1"];
          delete product["image2"];
          delete product["image3"];

          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;

          if (params.id && !openModal) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            setItem(product);
            // setOpenModal("update");
          } else {
            setItem(product);
            // setOpenModal("save");
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
            title={`Save ${item?.title}`}
            message="Are you sure you want toadd this Product ?"
            dangerOption="Save"
            input={false}
            cancelOption="Cancel"
            dangerAction={() => handleSave()}
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
            dangerAction={() => handleUpdate()}
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
                        required: "Name is required",
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 col-span-full">
                    {errors.title.message}
                  </p>
                )}
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
                      required: "Description is required",
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
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.description.message}
                </p>
              )}

              <div className="col-span-full lg:flex justify-between">
                <div className="col-span-full flex justify-start items-end gap-8">
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
                          required: "Brand is required",
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40 hover:bg-gray-100"
                    onClick={() => setOpenModal("addBrand")}
                  >
                    Add Brand
                  </button>
                </div>
                {errors.brand && (
                  <p className="mt-2 text-sm text-red-600 col-span-full">
                    {errors.brand.message}
                  </p>
                )}

                <div className="col-span-full flex justify-start items-end gap-8">
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
                          required: "Category is required",
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40 hover:bg-gray-100"
                    onClick={() => setOpenModal("addCategory")}
                  >
                    Add Category
                  </button>
                </div>
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.category.message}
                </p>
              )}

              {getValues("colors").length > 0 ? (
                <>
                  <div className="flex flex-col justify-start items-start gap-4 col-span-full">
                    <h2 className="font-semibold col-span-full">
                      Colors Added
                    </h2>

                    <div className="col-span-full flex flex-wrap gap-4">
                      {getValues("colors").map((color, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <div
                            id={color}
                            className="block rounded-full aspect-square w-12 h-12 border-2 border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                          <button onClick={() => handleRemoveColor(index)}>
                            <TrashIcon className="h-6 w-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              <div className="col-span-full mt-4">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Add Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    id="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="block rounded-full aspect-square w-10 h-10 border-none cursor-pointer"
                  />
                  <button
                    onClick={handleAddColor}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40 mt-4 hover:bg-gray-100"
                  >
                    Add Color
                  </button>
                </div>
              </div>
              {errors.colors && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.colors.message}
                </p>
              )}

              {getValues("sizes").length > 0 && (
                <>
                  <div className="flex flex-col justify-start items-start gap-4 col-span-full">
                    <h2 className="font-semibold col-span-full">Sizes Added</h2>

                    <div className="col-span-full flex flex-wrap gap-4">
                      {getValues("sizes").map((size, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <p
                            id={size}
                            className="block px-6 rounded-lg py-2 border-2 border-gray-200"
                          >
                            {size}
                          </p>
                          <button onClick={() => handleRemoveSize(index)}>
                            <TrashIcon className="h-6 w-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-full mt-4">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Add Sizes in Inches
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    id="sizes"
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-10 border-2 cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40 mt-4 hover:bg-gray-100"
                  />
                  <button
                    onClick={handleAddSize}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 mb-4 font-semibold w-40 mt-4 hover:bg-gray-100"
                  >
                    Add Size
                  </button>
                </div>
              </div>
              {errors.sizes && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.sizes.message}
                </p>
              )}

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
                        required: "Price is required",
                        min: 1,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.price && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.price.message}
                </p>
              )}

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
                        required: "Discount Percentage is required",
                        min: 0,
                        max: 100,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.discountPercentage && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.discountPercentage.message}
                </p>
              )}

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
                        required: "Stock is required",
                        min: 1,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.stock && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.stock.message}
                </p>
              )}

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
                        required: "Thumbnail is required",
                      })}
                      id="thumbnail"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.thumbnail && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.thumbnail.message}
                </p>
              )}

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
                        required: "Image is required",
                      })}
                      id="image1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.image1 && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.image1.message}
                </p>
              )}

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
                        required: "Image is required",
                      })}
                      id="image2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.image2 && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.image2.message}
                </p>
              )}

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
                        required: "Image is required",
                      })}
                      id="image3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errors.image3 && (
                <p className="mt-2 text-sm text-red-600 col-span-full">
                  {errors.image3.message}
                </p>
              )}
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
