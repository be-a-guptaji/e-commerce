import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoggedInUserOrdersAsync, selectUserOrders } from "../UserSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { Link } from "react-router-dom";
import { selectItems } from "../../cart/CartSlice";

export function UserOrder() {
  const user = useSelector(selectLoggedInUser);
  const dispacth = useDispatch();
  const orders = useSelector(selectUserOrders);
  const items = useSelector(selectItems);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((total, item) => total + item.quantity, 1);

  useEffect(() => {
    dispacth(fetchLoggedInUserOrdersAsync(user.id));
  }, [dispacth, user]);

  return (
    <>
      <h1 className="md:text-4xl text-2xl font-bold text-gray-900 text-center bg-white md:w-1/2 mx-auto h-16 pt-4 rounded-t-md">
        Item in this Order
      </h1>
      {orders.map((order, index) => (
        <div className="p-4 my-8" key={index}>
          <div className="">
            <div className="flow-root">
              <ul className="-my-6 border-b border-gray-200 sm:w-1/2 mx-auto py-4 bg-white px-4">
                {order.items.map((product) => (
                  <li key={product.id} className="flex">
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
                            {Math.round(
                              product.price * product.quantity * 100
                            ) / 100}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.color}
                        </p>
                      </div>
                      <div className="text-gray-500 flex justify-between items-center my-2">
                        <p className="block text-sm font-medium leading-6 text-gray-900">
                          Quantity Purchased : {product.quantity}
                        </p>
                        <p className="block text-sm font-medium leading-6 text-gray-900">
                          Total Amount : ₹ {product.quantity * product.price}
                        </p>
                      </div>

                      <div className="text-gray-500">
                        <p className="block text-sm font-medium leading-6 text-gray-900">
                          Order Id : {order.id}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
      <div className="px-4 py-6 sm:px-6 sm:w-1/2 mx-auto bg-white rounded-b-md">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total {totalItems > 0 ? `(${totalItems} items)` : ""}</p>
          <p>₹{Math.round(totalAmount * 100) / 100}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes included.
        </p>
      </div>
    </>
  );
}