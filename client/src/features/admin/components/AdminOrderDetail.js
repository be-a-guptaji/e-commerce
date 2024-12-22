import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectViewOrder } from "../../order/orderSlice";

export default function AdminOrderDetail() {
  const dispatch = useDispatch();
  const order = useSelector(selectViewOrder);

  return (
    <>
      <div>{/* We will use to show orders on Admin Page */}</div>
    </>
  );
}
