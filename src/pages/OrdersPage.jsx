import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetOrdersQuery } from "../app/api/ordersApiSlice";
import { format } from "date-fns";
import UploadInvoiceModal from "../components/UploadInvoiceModal";
import OrderDetailDrawer from "../components/OrderDetailDrawer";

const OrdersPage = ({ ordersData, isLoadingOrders, isErrorOrders, ordersError }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading, isError, error } = useGetOrdersQuery();

  if (isLoadingOrders) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 flex justify-center items-center min-h-screen text-lg font-medium">
        Loading Orders...
      </div>
    );
  }

  if (isErrorOrders) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 text-red-600 text-lg font-medium">
        Error: {ordersError?.data?.detail || "Failed to load orders."}
      </div>
    );
  }

  const ordersToDisplay = ordersData || [];

  return (
    <div className="ml-72 pt-10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <FileUp size={20} /> Upload Invoice
          </button>
        </div>

        {ordersToDisplay.length === 0 ? (
          <div className="dashboard-card p-6 text-center text-gray-500">
            No orders found. Upload an invoice to get started!
          </div>
        ) : (
          <div className="dashboard-card p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-gray-600 uppercase tracking-wider bg-gray-50">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersToDisplay.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{order.order_id}</td>
                      <td className="py-3 px-4">
                        {format(new Date(order.order_datetime), "PPP p")}
                      </td>
                      <td className="py-3 px-4">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="py-3 px-4 capitalize">{order.source}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-0 bg-transparent hover:bg-transparent"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <UploadInvoiceModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <OrderDetailDrawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} order={selectedOrder} />
    </div>
  );
};

export default OrdersPage;
