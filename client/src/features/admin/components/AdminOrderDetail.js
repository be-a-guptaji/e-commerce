import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectViewOrder } from "../../order/orderSlice";

export default function AdminOrderDetail() {
  const dispatch = useDispatch();
  const order = useSelector(selectViewOrder);

  return (
    <>
       <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

        {/* General Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-medium">General Information</h2>
          <div className="space-y-4 mt-2">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span
                // className={`${chooseColor(
                //   order.status
                // )} py-1 px-3 rounded-full text-xs`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span>${order.totalAmount}</span>
            </div>
            <div className="font-medium">Shipping Address:</div>
            <div>
              <strong>{order.selectedAddress?.name}</strong>
              <div>{order.selectedAddress?.street},</div>
              <div>{order.selectedAddress?.city},</div>
              <div>{order.selectedAddress?.state},</div>
              <div>{order.selectedAddress?.pinCode},</div>
              <div>{order.selectedAddress?.phone}</div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h2 className="text-xl font-medium">Items</h2>
          <div className="space-y-4 mt-2">
            {order.items?.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={item.product.thumbnail}
                    alt={item.product.title}
                  />
                  <div className="font-medium">
                    <div>{item.product.title}</div>
                    <div>
                      {/* Qty: {item.quantity} - ${discountedPrice(item.product)} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {/* {order.items?.length > visibleItemsCount && (
            <button
              className="text-blue-500 font-bold mt-4"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )} */}
        </div>

        {/* Order Dates */}
        <div className="mb-6">
          <h2 className="text-xl font-medium">Order Dates</h2>
          <div className="space-y-4 mt-2">
            <div className="flex justify-between">
              <span className="font-medium">Order Placed On:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Updated On:</span>
              <span>{new Date(order.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            // onClick={() => navigate("/admin/orders")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
