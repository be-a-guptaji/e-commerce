import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemInCartAsync,
  selectItems,
  updateCartAsync,
} from "./CartSlice";
import { Link, Navigate } from "react-router-dom";

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (event, item) => {
    dispatch(updateCartAsync({ item, quantity: +event.target.value }));
  };

  const handleRemove = (event, id) => {
    dispatch(deleteItemInCartAsync(id));
  };

  return (
    <>
      {items.length === 0 && <Navigate to="/" replace={true} />}
      <div className="p-4 my-8">
        <h1 className="md:text-4xl text-2xl font-bold text-gray-900 text-center bg-white md:w-1/2 mx-auto h-16 pt-4 rounded-t-md">
          Shopping cart
        </h1>
        <div className="flow-root">
          <ul className="-my-6 divide-y divide-gray-200 sm:w-1/2 mx-auto py-6 bg-white px-4">
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
                        <Link to={`/product-detail/${product.productId}`}>
                          {product.title}
                        </Link>
                      </h3>
                      <p className="ml-4">
                        ₹
                        {Math.round(product.price * product.quantity * 100) /
                          100}
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
                        onChange={(e) => handleQuantityChange(e, product.id)}
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

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 sm:w-1/2 mx-auto bg-white rounded-b-md">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal {totalItems > 0 ? `(${totalItems} items)` : ""}</p>
          <p>₹{Math.round(totalAmount * 100) / 100}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
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
    </>
  );
}
