import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrderAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";

function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});
  const [sortedOrders, setSortOrders] = useState([]);

  useEffect(() => {
    setSortOrders([...orders]);
  }, [orders]);

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };
  const handleShow = () => {
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

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(fetchAllOrderAsync({ sort: sort, pagination }));
  }, [dispatch, page, sort]);

  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th
                    className="py-3 text-center cursor-pointer"
                    onClick={(e) =>
                      handleSort({
                        sort: "id",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    Order #{" "}
                    {sort._sort === "id" &&
                      (sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      ))}
                  </th>
                  <th className="py-3 text-center">Items</th>
                  <th
                    className="py-3 text-center cursor-pointer"
                    onClick={(e) =>
                      handleSort({
                        sort: "totalAmount",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    Total Amount{" "}
                    {sort._sort === "totalAmount" &&
                      (sort._order === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                      ))}
                  </th>
                  <th className="py-3 text-center">Shipping Address</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders?.map((order) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-100"
                    key={order.id}
                  >
                    <td className="py-3 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="pl-4"></div>
                        <span className="font-medium">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-3 text-left flex flex-col items-center justify-center">
                      {order.items?.map((item) => (
                        <div className="flex items-center" key={item.id}>
                          <div className="mr-2">
                            <img
                              className="w-12 aspect-square rounded-full"
                              src={item.product.thumbnail}
                              alt="thumbnail"
                            />
                          </div>
                          <div className="font-medium flex flex-col items-center justify-center gap-2 my-4">
                            <div>{item.product.title}</div>
                            <div>
                              Qty : {item.quantity} - $
                              {discountedPrice(item.product)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center font-bold">
                        ${order.totalAmount}
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
                      {order.id === editableOrderId ? (
                        <select onChange={(e) => handleUpdate(e, order)}>
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
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex item-center justify-center">
                        <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-120">
                          <EyeIcon
                            className="w-8 h-8"
                            onClick={(e) => handleShow(order)}
                          ></EyeIcon>
                        </div>
                        <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-120">
                          <PencilIcon
                            className="w-8 h-8"
                            onClick={(e) => handleEdit(order)}
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
