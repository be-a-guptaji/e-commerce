import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrderAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
  setViewOrder,
  resetViewOrder,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/components/Pagination";

function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});
  const [visibleItemsCount, setVisibleItemsCount] = useState(2);

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };
  const handleShow = (order) => {
    dispatch(setViewOrder(order));
    navigate(`/admin/order-detail`, { replace: true });
  };

  const handleUpdate = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    setSort((prevSort) => {
      const isSameColumn = prevSort._sort === sortOption.sort;
      const newOrder =
        isSameColumn && prevSort._order === "asc" ? "desc" : "asc";
      return { _sort: sortOption.sort, _order: newOrder };
    });
  };

  const handleShowMore = (length) => {
    if (visibleItemsCount === 2) {
      setVisibleItemsCount(length); // Show all items
    } else {
      setVisibleItemsCount(2); // Show 2 items
    }
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
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(fetchAllOrderAsync({ sort: sort, pagination }));
  }, [dispatch, page, sort]);

  useEffect(() => {
    dispatch(resetViewOrder());
  }, [dispatch]);

  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 text-center cursor-default">Items</th>
                  <th
                    className="py-3 text-center cursor-pointer"
                    onClick={(e) =>
                      handleSort({
                        sort: "totalAmount",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Total</p>
                        <p>Amount</p>
                      </div>
                      <div className="arrow">
                        {sort._sort === "totalAmount" &&
                          (sort._order === "asc" ? (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ) : (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ))}
                      </div>
                    </div>
                  </th>
                  <th className="py-3 text-center cursor-default">
                    <div>
                      <p>Shipping</p>
                      <p>Address</p>
                    </div>
                  </th>
                  <th className="py-3 text-center cursor-pointer">
                    <div
                      className="flex justify-center items-center gap-2"
                      onClick={(e) =>
                        handleSort({
                          sort: "paymentMethod",
                          order: sort?._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      <div>
                        <p>Payment</p>
                        <p>Method</p>
                      </div>
                      <div className="arrow">
                        {sort._sort === "paymentMethod" &&
                          (sort._order === "asc" ? (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ) : (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ))}
                      </div>
                    </div>
                  </th>
                  <th
                    className="py-3 text-center cursor-pointer"
                    onClick={(e) =>
                      handleSort({
                        sort: "createdAt",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Order</p>
                        <p>Time</p>
                      </div>
                      <div className="arrow">
                        {sort._sort === "createdAt" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </div>
                    </div>
                  </th>
                  <th
                    className="py-3 text-center cursor-default"
                    onClick={(e) =>
                      handleSort({
                        sort: "updatedAt",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Last</p>
                        <p>Updated</p>
                      </div>
                      <div className="arrow">
                        {sort._sort === "updatedAt" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </div>
                    </div>
                  </th>
                  <th className="py-3 text-center cursor-default">Status</th>
                  <th className="py-3 text-center cursor-default">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders?.map((order) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-100"
                    key={order.id}
                  >
                    <td className="py-3 flex flex-col items-center justify-center">
                      {order.items
                        ?.slice(0, visibleItemsCount || 2)
                        .map((item) => (
                          <div
                            className="flex items-center justify-center"
                            key={item.id}
                          >
                            <div>
                              <img
                                className="w-12 aspect-square rounded-full"
                                src={item.product.thumbnail}
                                alt="thumbnail"
                              />
                            </div>
                            <div className="font-medium flex flex-col items-center justify-center gap-2 my-4">
                              <div>{item.product.title}</div>
                              <div>
                                Qty : {item.quantity} - ₹
                                {item.product.discountedPrice}
                              </div>
                            </div>
                          </div>
                        ))}
                      {/* Show more button */}
                      {order.items?.length >
                        (visibleItemsCount[order.id] || 2) && (
                        <button
                          className="text-blue-400 font-medium"
                          onClick={() => handleShowMore(order.items.length)}
                        >
                          {`${
                            visibleItemsCount === 2 ? "Show More" : "Show Less"
                          }`}
                        </button>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center font-bold">
                        ₹{order.totalAmount}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="font-medium">
                        <strong>{order.selectedAddress?.name}</strong>,
                        <div>{order.selectedAddress?.street},</div>
                        <div>{order.selectedAddress?.city}, </div>
                        <div>{order.selectedAddress?.state}, </div>
                        <div>{order.selectedAddress?.pinCode}, </div>
                        <div>{order.selectedAddress?.phone}, </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className={`${
                            order.payment.paymentMethod === "cash"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          } py-1 px-3 rounded-md text-xs`}
                        >
                          {capitalizeFirstLetter(order.payment.paymentMethod)}
                        </span>
                      </div>
                    </td>
                    <td className="space-y-4 py-2">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="font-medium">Order Placed on: </p>
                        <span className="font-bold block">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold block">at</span>
                        <span className="font-bold block">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="space-y-4 py-2">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="font-medium block">Last Updated on: </p>
                        <span className="font-bold block">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold block">at</span>
                        <span className="font-bold block">
                          {new Date(order.updatedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {order.id === editableOrderId ? (
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-4"
                          onChange={(e) => handleUpdate(e, order)}
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={`${chooseColor(
                            order.status
                          )} py-1 px-3 rounded-full text-xs`}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex item-center justify-center">
                        <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-120">
                          <EyeIcon
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => handleShow(order)}
                          ></EyeIcon>
                        </div>
                        <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-120">
                          <PencilIcon
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => handleEdit(order)}
                          ></PencilIcon>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        handlePage={handlePage}
        totalItems={totalOrders}
      ></Pagination>
    </div>
  );
}

export default AdminOrders;
