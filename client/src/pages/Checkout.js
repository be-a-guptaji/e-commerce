import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { useForm } from "react-hook-form";
import { updateUserAsync, selectUserInfo } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStockError,
} from "../features/order/orderSlice";
import { toast } from "react-toastify";
import NavBar from "../features/navbar/Navbar";
import { selectUserChecked } from "../features/auth/authSlice";
import {
  initiatePaymentAsync,
  resetPayment,
} from "../features/payment/paymentSlice";
import { PATH } from "../app/constants";
import Modal from "../features/common/components/Modal";
import "react-toastify/dist/ReactToastify.css";

function Checkout() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const error = useSelector(selectStockError);
  const items = useSelector(selectItems);
  const currentOrder = useSelector(selectCurrentOrder);
  const userChecked = useSelector(selectUserChecked);
  const [openModal, setOpenModal] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const totalAmount = items.reduce(
    (amount, item) => item.product.discountedPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    if (currentOrder) {
      navigate(`/order-success/${currentOrder.id}`, { replace: true });
    }
  }, [navigate, currentOrder]);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddress = (e) => {
    setSelectedAddress(user?.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== "undefined") {
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () =>
        reject(new Error("Razorpay script failed to load."));
      document.body.appendChild(script);
    });
  };

  const payUsingCard = async (data) => {
    try {
      // Step 1: Make API call to initiate the payment and get payment details
      let razorpayID;
      let paymentId;

      await dispatch(initiatePaymentAsync(data))
        .unwrap()
        .then((result) => {
          // Step 2: Parse the payment details from the response
          razorpayID = result.razorpayID;
          paymentId = result.paymentId;
        })
        .catch((err) => {
          setPaymentError(err.message);
        });

      // Step 3: Validate Razorpay response
      if (!razorpayID || !paymentId) {
        throw new Error("Invalid payment details received from the server.");
      }

      // Step 4: Configure Razorpay payment options
      const options = {
        key: razorpayID, // Razorpay Key ID
        amount: data.totalAmount, // Amount is in the smallest currency unit (e.g., paise)
        currency: "INR", // Currency
        name: "E Kart", // Your business name
        description: "Thanks for shopping with us",
        image: "../../logo.png", // Replace with your logo URL
        order_id: paymentId, // The payment ID returned by the server
        callback_url: `${PATH}/payment/verify`, // Your server's callback URL
        prefill: {
          name: user.name, // Customer's name
          email: user.email, // Customer's email
          contact: user.phoneNumber, // Customer's phone number
        },
        notes: {
          address: selectedAddress,
        },
        theme: {
          color: "#3399cc", // Color of the Razorpay modal
        },
      };

      await loadRazorpayScript();

      // Step 5: Ensure Razorpay script is loaded and create Razorpay instance
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay script not loaded.");
      }

      const rzp1 = new window.Razorpay(options);

      // Step 6: Open Razorpay payment modal
      await rzp1.open();
    } catch (error) {
      // Optionally, notify the user of the error
      toast.error(`${paymentError || "Product"} is out of stock`);
    } finally {
      dispatch(resetPayment());
    }
  };

  const handleOrder = () => {
    const order = {
      items,
      totalAmount,
      totalItems,
      user: user.id,
      paymentMethod,
      selectedAddress,
      status: "pending",
    };

    if (selectedAddress && paymentMethod === "card") {
      payUsingCard(order);
    } else if (selectedAddress && paymentMethod) {
      dispatch(createOrderAsync(order));
    } else {
      toast.error("Enter Address and Payment method");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }
  }, [error]);

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <NavBar>
        {!items.length && !userChecked && (
          <Navigate to="/" replace={true}></Navigate>
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {/* This form is for address */}
              <form
                className="bg-white px-5 py-12 mt-12"
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(
                    updateUserAsync({
                      ...user,
                      addresses: [...user?.addresses, data],
                    })
                  );
                  toast.success("Address Added");
                  reset();
                })}
              >
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Use a permanent address where you can receive mail.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("name", {
                              required: "name is required",
                            })}
                            id="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.name && (
                            <p className="text-red-500">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            {...register("email", {
                              required: "email is required",
                            })}
                            type="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Phone
                        </label>
                        <div className="mt-2">
                          <input
                            id="phone"
                            {...register("phone", {
                              required: "phone is required",
                            })}
                            type="tel"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.phone && (
                            <p className="text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("street", {
                              required: "street is required",
                            })}
                            id="street"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.street && (
                            <p className="text-red-500">
                              {errors.street.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("city", {
                              required: "city is required",
                            })}
                            id="city"
                            autoComplete="address-level2"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.city && (
                            <p className="text-red-500">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("state", {
                              required: "state is required",
                            })}
                            id="state"
                            autoComplete="address-level1"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.state && (
                            <p className="text-red-500">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="pinCode"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("pinCode", {
                              required: "pinCode is required",
                            })}
                            id="pinCode"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.pinCode && (
                            <p className="text-red-500">
                              {errors.pinCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      onClick={(e) => reset()}
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              </form>
              <div className="border-b border-gray-900/10 pb-12 my-4">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose from Existing addresses
                </p>
                <ul>
                  {user?.addresses.map((address, index) => (
                    <li
                      key={index}
                      className="border-solid border-2 border-gray-200 my-4 rounded-lg bg-white"
                    >
                      <label
                        htmlFor={index}
                        className="flex justify-between items-center rounded-lg p-4"
                      >
                        <div className="flex items-center mx-4 gap-6">
                          <input
                            onChange={handleAddress}
                            id={index}
                            name="address"
                            type="radio"
                            value={index}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {address.name}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.street}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            Phone: {address.phone}
                          </p>
                          <p className="text-sm leading-6 text-gray-500">
                            {address.city}
                          </p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Payment Methods
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Choose One
                    </p>
                    <div className="mt-6 space-y-6 flex flex-col">
                      <label
                        htmlFor="cash"
                        className="text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-center gap-x-3 bg-white p-4 rounded-lg md:w-1/4 border-solid border-2 border-gray-200">
                          <input
                            id="cash"
                            name="payments"
                            onChange={handlePayment}
                            value="cash"
                            type="radio"
                            checked={paymentMethod === "cash"}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Cash
                        </div>
                      </label>
                      <label
                        htmlFor="card"
                        className="text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-center gap-x-3 bg-white p-4 rounded-lg md:w-1/4 border-solid border-2 border-gray-200">
                          <input
                            id="card"
                            onChange={handlePayment}
                            name="payments"
                            checked={paymentMethod === "card"}
                            value="card"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Card
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="mx-auto mt-12 bg-white max-w-7xl px-2 sm:px-2 lg:px-4">
                <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
                  <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                    Cart
                  </h1>
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <li
                          key={item.id}
                          className="flex py-6 justify-center items-center"
                        >
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <Link
                                    to={`/product-detail/${item.product.id}`}
                                  >
                                    {item.product.title}
                                  </Link>
                                </h3>
                                <p className="ml-4">
                                  ₹ {item.product.discountedPrice}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.product.brand}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="text-gray-500 flex">
                                <div className="mt-2">
                                  <label
                                    htmlFor={item.id}
                                    className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Qty
                                  </label>
                                  <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4 w-24"
                                    onChange={(e) => handleQuantity(e, item)}
                                    value={item.quantity}
                                    id={item.id}
                                  >
                                    {item.product.stock ? (
                                      [...Array(item.product.stock).keys()].map(
                                        (x) => (
                                          <option value={x + 1} key={x}>
                                            {x + 1}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option value="0">Out of Stock</option>
                                    )}
                                  </select>
                                </div>
                                <div className="flex flex-col ml-8 h-full font-semibold gap-2 justify-start items-start">
                                  <div className="flex justify-center items-center gap-2">
                                    Color :{" "}
                                    <div
                                      className="rounded-full bg-gray-100 aspect-square p-4 border-2 border-gray-200"
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-center items-center gap-2">
                                    Size :{" "}
                                    <div className="group relative flex items-center justify-center rounded-md border-2 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-2 cursor-pointer}">
                                      {item.size}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex">
                                <Modal
                                  title={`Remove ${item.product.title} from Cart`}
                                  message="Are you sure you want to remove this Cart item ?"
                                  dangerOption="Remove"
                                  cancelOption="Cancel"
                                  input={false}
                                  dangerAction={(e) => handleRemove(e, item.id)}
                                  cancelAction={() => setOpenModal(null)}
                                  showModal={openModal === item.id}
                                ></Modal>
                                <button
                                  onClick={() => {
                                    setOpenModal(item.id);
                                  }}
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹ {totalAmount}</p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated are included.
                  </p>
                  <div className="mt-6">
                    <div
                      onClick={handleOrder}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Order Now
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <Link to="/">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavBar>
    </>
  );
}

export default Checkout;
