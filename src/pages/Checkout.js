import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  deleteItemInCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/CartSlice";
import { Link, Navigate } from "react-router-dom";
import {
  selectLoggedInUser,
  updateUserAsync,
} from "../features/auth/AuthSlice";
import {
  createOrderAsync,
  selectCurrentOrder,
} from "../features/order/OrderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const items = useSelector(selectItems);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [open, setOpen] = useState(true);
  const currentOrder = useSelector(selectCurrentOrder);
  const [selectAddress, setSelectAddress] = useState(null);
  const [paymentMethord, setPaymentMethord] = useState("card");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleQuantityChange = (event, item) => {
    dispatch(updateCartAsync({ item, quantity: +event.target.value }));
  };

  const handleRemove = (event, id) => {
    dispatch(deleteItemInCartAsync(id));
  };

  const handleSelectAddress = (event, address) => {
    setSelectAddress(address);
  };

  const handlePaymentMethod = (event) => {
    setPaymentMethord(event.target.value);
  };

  const handleOrder = (event) => {
    const orders = {
      items,
      totalAmount,
      totalItems,
      selectAddress,
      paymentMethord,
      user: {
        id: user.id,
        email: user.email,
      },
      status: "pending",
    };
    dispatch(createOrderAsync(orders));
  };

  return (
    <>
      {items.length === 0 && <Navigate to="/" replace={true} />}
      {currentOrder&& <Navigate to={`/order-success/${currentOrder.id}`} replace={true} />}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            className="bg-white my-12 rounded-md ml-6 md:mr-0 mr-6 p-4"
            noValidate
            onSubmit={handleSubmit((data) => {
              dispatch(
                updateUserAsync({
                  ...user,
                  addresses: [...user.addresses, data],
                  data,
                })
              );
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
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        {...register("phoneNumber", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid phone number",
                          },
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="streetAddress"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        {...register("street", {
                          required: "Street address is required",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
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
                        id="city"
                        name="city"
                        type="text"
                        {...register("city", { required: "City is required" })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
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
                        id="state"
                        name="state"
                        type="text"
                        {...register("state", {
                          required: "State / Province is required",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="pinCode"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Pin Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="pinCode"
                        name="pinCode"
                        type="text"
                        {...register("pinCode", {
                          required: "ZIP / Postal code is required",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
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

              <div className="border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Address
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <ul
                  role="list"
                  className="divide-y divide-gray-100 border-b border-gray-100"
                >
                  {user.addresses.map((address, index) => (
                    <li key={index} className="w-full gap-x-6 py-5">
                      <label
                        htmlFor={index}
                        className="flex justify-between text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex min-w-0 gap-x-4">
                          <input
                            id={index}
                            onChange={(e) => handleSelectAddress(e, address)}
                            name="address"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 my-4"
                          />

                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {address.name}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            {address.street}, {address.pinCode}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {address.city}, {address.state}
                          </p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Payment Method
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Choose your preferred method of payment.
                    </p>
                    <div className="mt-6 divide-y divide-gray-100">
                      <label
                        htmlFor="card"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-center gap-x-3 my-4">
                          <input
                            id="card"
                            onChange={(e) => handlePaymentMethod(e)}
                            value="card"
                            checked={paymentMethord === "card"}
                            name="paymentMethod"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Card
                        </div>
                      </label>
                      <label
                        htmlFor="cash"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-center gap-x-3 my-4">
                          <input
                            id="cash"
                            onChange={(e) => handlePaymentMethod(e)}
                            value="cash"
                            checked={paymentMethord === "cash"}
                            name="paymentMethod"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Cash
                        </div>
                      </label>
                      <label
                        htmlFor="upi"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-center gap-x-3 my-4">
                          <input
                            id="upi"
                            checked={paymentMethord === "upi"}
                            onChange={(e) => handlePaymentMethod(e)}
                            value="upi"
                            name="paymentMethod"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          UPI
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
          {" "}
          <div className="p-4 my-8">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 text-center bg-white mx-auto h-16 pt-4 rounded-t-md">
              Shopping cart
            </h1>

            <div className="">
              <div className="flow-root">
                <ul
                  role="list"
                  className="-my-6 divide-y divide-gray-200 mx-auto py-6 bg-white px-4"
                >
                  {items.map((product) => (
                    <li key={product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          alt={product.title}
                          src={product.thumbnail}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to={`/product-detail/${product.id}`}>
                                {product.title}
                              </Link>
                            </h3>
                            <p className="ml-4">
                              ₹
                              {Math.round(
                                product.price * product.quantity * 100
                              ) / 100}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.color}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500 flex justify-center items-center">
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty
                            </label>
                            <select
                              name="quantity"
                              onChange={(e) =>
                                handleQuantityChange(e, product.id)
                              }
                              id="quantity"
                              className="mx-4 text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={product.quantity}
                            >
                              {Array.from(
                                { length: product.stock },
                                (_, index) => index + 1
                              ).map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={(e) => handleRemove(e, product.id)}
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

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6 mx-auto bg-white rounded-b-md">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal {totalItems > 0 ? `(${totalItems} items)` : ""}</p>
                <p>₹{Math.round(totalAmount * 100) / 100}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes are calculated.
              </p>
              <div className="mt-6">
                <div
                  onClick={() => {
                    handleOrder();
                  }}
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                >
                  Pay and Order Now
                </div>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{" "}
                  <Link to="/">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
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
    </>
  );
};

export default Checkout;
