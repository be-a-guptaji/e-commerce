import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectItems,
  updateCartAsync,
} from "./cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { selectStatus } from "./cartSlice";
import { RotatingLines } from "react-loader-spinner";
import { resetStockError } from "../order/orderSlice";
import Modal from "../common/components/Modal";

export default function Cart() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const [openModal, setOpenModal] = useState(null);
  const items = useSelector(selectItems);
  const cartLoaded = useSelector(selectCartLoaded);
  const totalAmount = items.reduce(
    (amount, item) => item.product.discountedPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
    toast.error("Product removed from cart");
  };

  useEffect(() => {
    dispatch(resetStockError());
  }, [dispatch]);

  return (
    <>
      {!items.length && cartLoaded ? (
        <NoItem />
      ) : (
        <div>
          <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                Cart
              </h1>
              <div className="flow-root">
                {status === "loading" ? (
                  <RotatingLines
                    visible={true}
                    height="96"
                    width="96"
                    color="#4fa94d"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : null}
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6">
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
                              <Link to={`/product-detail/${item.product.id}`}>
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
                                {item.product.stock > 0 ? (
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
                            <div className="flex flex-col ml-12 h-full font-semibold gap-4 justify-start items-start">
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

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹ {totalAmount}</p>
              </div>
              <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Total Items in Cart</p>
                <p>{totalItems} items</p>
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
          </div>
        </div>
      )}
    </>
  );
}

const NoItem = () => {
  return (
    <>
      <div>
        <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
              Cart
            </h1>
            <p className="text-2xl text-center">
              You have no item in the cart yet
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="mt-6">
            <Link
              to="/"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
