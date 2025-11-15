import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

const OrderDetailDrawer = ({ isOpen, onClose, order }) => {
  const [isRawTextExpanded, setIsRawTextExpanded] = useState(false);

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="bg-card w-full max-w-lg h-full shadow-2xl p-6 relative overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Order Details</h2>

            <div className="space-y-4 mb-8">
              <DetailItem label="Order ID" value={order.order_id} />
              <DetailItem
                label="Date & Time"
                value={format(new Date(order.order_datetime), "PPP p")}
              />
              <DetailItem
                label="Total Amount"
                value={`₹${parseFloat(order.total_amount).toFixed(2)}`}
              />
              <DetailItem label="Source" value={order.source} className="capitalize" />
            </div>

            {order.raw_receipt_text && (
              <div className="mb-8 border-t border-border pt-6">
                <button
                  onClick={() => setIsRawTextExpanded(!isRawTextExpanded)}
                  className="flex items-center justify-between w-full text-lg font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Raw OCR Text
                  {isRawTextExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {isRawTextExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden mt-3"
                    >
                      <p className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                        {order.raw_receipt_text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="border-t border-border pt-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Order Items</h3>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <ItemDetail label="Product Name" value={item.product_name} />
                      <ItemDetail label="Quantity" value={item.quantity} />
                      <ItemDetail label="Price" value={`₹${parseFloat(item.price).toFixed(2)}`} />
                      <ItemDetail label="Amount" value={`₹${parseFloat(item.amount).toFixed(2)}`} />
                      {item.normalized_name && (
                        <ItemDetail label="Normalized Name" value={item.normalized_name} />
                      )}
                      {item.medicine && (
                        <ItemDetail label="Medicine" value={item.medicine.name} />
                      )}
                      {item.confidence && (
                        <ItemDetail label="Confidence" value={`${item.confidence}%`} />
                      )}
                      {item.mock_expiry_date && (
                        <ItemDetail label="Expiry Date" value={format(new Date(item.mock_expiry_date), "PPP")} />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items found for this order.</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DetailItem = ({ label, value, className }) => (
  <div className={`flex justify-between items-center text-foreground ${className}`}>
    <span className="font-medium text-lg">{label}:</span>
    <span className="text-lg">{value}</span>
  </div>
);

const ItemDetail = ({ label, value }) => (
  <div className="flex justify-between text-sm text-gray-700 py-1">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default OrderDetailDrawer;
