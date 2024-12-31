import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderAsync, selectViewOrder } from "../../order/orderSlice";

export default function AdminOrderDetail() {
  const dispatch = useDispatch();
  const order = useSelector(selectViewOrder);

  const handleUpdate = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return string;
    } // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      {order ? (
        <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8 rounded-lg">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between">
              <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                Order ID # {order?.id}
              </h1>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4"
                onChange={(e) => handleUpdate(e, order)}
              >
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-between">
              <h3 className="text-xl my-5 font-bold tracking-tight text-red-900">
                Order Status :{" "}
                <span
                  className={`${chooseColor(
                    order?.status
                  )} px-2 py-1 rounded-md`}
                >
                  {capitalizeFirstLetter(order.status)}
                </span>
              </h3>
              <h3 className="my-5 font-bold tracking-tight text-red-900">
                Payment Method :{" "}
                <span className="font-bold text-green-500 bg-green-200 px-2 py-1 rounded-md">
                  {capitalizeFirstLetter(order?.payment?.paymentMethod)}
                </span>
              </h3>
            </div>
            <div className="flex justify-between">
              <h3 className="my-5 font-bold tracking-tight text-red-900">
                Order Date :{" "}
                <span className="font-bold text-blue-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                  {" at "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </h3>
              <h3 className="my-5 font-bold tracking-tight text-red-900">
                Last Updated :{" "}
                <span className="font-bold text-blue-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                  {" at "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </h3>
            </div>
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {order.items?.map((item) => (
                  <li key={item?.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item?.product.thumbnail}
                        alt={item?.product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/product-detail/${item?.product.id}`}>
                              {item?.product.title}
                            </Link>
                          </h3>
                          <p className="ml-4">
                            ₹ {item?.product.discountedPrice}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item?.product.brand}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex mr-5 text-sm font-medium leading-6 text-gray-900">
                          <div>Qty : {item?.quantity}</div>
                          <div className="flex flex-col ml-12 h-full font-semibold gap-2 justify-start items-start">
                            <div className="flex justify-center items-center gap-2">
                              Color :{" "}
                              <div
                                className="rounded-full bg-gray-100 aspect-square p-4 border-2 border-gray-200"
                                style={{ backgroundColor: item.color }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex ml-4 justify-center items-center gap-2">
                            Size :{" "}
                            <div className="group relative flex items-center justify-center rounded-md border-2 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-2 cursor-pointer}">
                              {item.size}
                            </div>
                          </div>
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
              <p> {order?.totalAmount}</p>
            </div>
            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Total Items in Cart</p>
              <p>{order?.totalItems} items</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping Address :</p>
            <div className="flex justify-between items-center gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 rounded-lg my-4">
              <div className="flex gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {order?.selectedAddress?.name}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {order?.selectedAddress?.street}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {order?.selectedAddress?.pinCode}
                </p>
              </div>

              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  Phone: {order?.selectedAddress?.phone}
                </p>
                <p className="text-sm leading-6 text-gray-500">
                  {order?.selectedAddress?.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
}
