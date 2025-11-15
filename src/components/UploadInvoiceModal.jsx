import React, { useState } from "react";
import { X, Plus, Trash2, FileText, FileSpreadsheet, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateOrderMutation } from "../app/api/ordersApiSlice";

const UploadInvoiceModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [manualFormData, setManualFormData] = useState({
    order_id: "",
    order_datetime: "",
    total_amount: "",
    items: [{ product_name: "", quantity: "", price: "", amount: "" }],
  });
  const [file, setFile] = useState(null);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = manualFormData.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setManualFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddItem = () => {
    setManualFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_name: "", quantity: "", price: "", amount: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    setManualFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "manual") {
        await createOrder({
          input_type: "manual",
          formData: {
            ...manualFormData,
            total_amount: parseFloat(manualFormData.total_amount),
            items: manualFormData.items.map((item) => ({
              ...item,
              quantity: parseFloat(item.quantity),
              price: parseFloat(item.price),
              amount: parseFloat(item.amount),
            })),
          },
        }).unwrap();
      } else if (activeTab === "pdf" && file) {
        const formData = new FormData();
        formData.append("input_type", "pdf");
        formData.append("file", file);
        await createOrder({ input_type: "pdf", formData }).unwrap();
      } else if (activeTab === "excel" && file) {
        const formData = new FormData();
        formData.append("input_type", "excel");
        formData.append("file", file);
        await createOrder({ input_type: "excel", formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ y: "-50vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-50vh", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-card p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Upload New Invoice</h2>

            {/* Tab Switcher */}
            <div className="flex border-b border-border mb-6">
              <TabButton icon={Edit} label="Manual Entry" isActive={activeTab === "manual"} onClick={() => setActiveTab("manual")} />
              <TabButton icon={FileText} label="PDF Upload" isActive={activeTab === "pdf"} onClick={() => setActiveTab("pdf")} />
              <TabButton icon={FileSpreadsheet} label="Excel Upload" isActive={activeTab === "excel"} onClick={() => setActiveTab("excel")} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "manual" && (
                <ManualEntryForm
                  formData={manualFormData}
                  onChange={handleManualChange}
                  onItemChange={handleItemChange}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  isLoading={isLoading}
                />
              )}
              {activeTab === "pdf" && (
                <FileUploadForm
                  fileType="PDF"
                  onFileChange={handleFileChange}
                  isLoading={isLoading}
                />
              )}
              {activeTab === "excel" && (
                <FileUploadForm
                  fileType="Excel"
                  onFileChange={handleFileChange}
                  isLoading={isLoading}
                />
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    } transition-colors duration-200`}
    onClick={onClick}
  >
    <Icon size={18} />
    {label}
  </button>
);

const ManualEntryForm = ({
  formData,
  onChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  isLoading,
}) => (
  <>
    <div>
      <label htmlFor="order_id" className="block text-sm font-medium text-foreground mb-1">Order ID</label>
      <input
        type="text"
        id="order_id"
        name="order_id"
        value={formData.order_id}
        onChange={onChange}
        className="input-field"
        required
      />
    </div>
    <div>
      <label htmlFor="order_datetime" className="block text-sm font-medium text-foreground mb-1">Date & Time</label>
      <input
        type="datetime-local"
        id="order_datetime"
        name="order_datetime"
        value={formData.order_datetime}
        onChange={onChange}
        className="input-field"
        required
      />
    </div>
    <div>
      <label htmlFor="total_amount" className="block text-sm font-medium text-foreground mb-1">Total Amount</label>
      <input
        type="number"
        id="total_amount"
        name="total_amount"
        value={formData.total_amount}
        onChange={onChange}
        className="input-field"
        step="0.01"
        required
      />
    </div>

    <h3 className="text-lg font-semibold mt-6 mb-3">Order Items</h3>
    <div className="space-y-4">
      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-border rounded-md relative">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={item.product_name}
              onChange={(e) => onItemChange(index, e)}
              className="input-field-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => onItemChange(index, e)}
              className="input-field-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => onItemChange(index, e)}
              className="input-field-sm"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={item.amount}
              onChange={(e) => onItemChange(index, e)}
              className="input-field-sm"
              step="0.01"
              required
            />
          </div>
          {formData.items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove Item"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
    <button type="button" onClick={onAddItem} className="btn-secondary flex items-center gap-2 mt-4">
      <Plus size={16} /> Add Item
    </button>
    <button type="submit" className="btn-primary w-full mt-6" disabled={isLoading}>
      {isLoading ? "Submitting..." : "Create Order"}
    </button>
  </>
);

const FileUploadForm = ({ fileType, onFileChange, isLoading }) => (
  <>
    <div>
      <label htmlFor="file-upload" className="block text-sm font-medium text-foreground mb-1">Upload {fileType}</label>
      <input
        type="file"
        id="file-upload"
        accept={fileType === "PDF" ? ".pdf" : ".xlsx,.xls"}
        onChange={onFileChange}
        className="input-field"
        required
      />
    </div>
    <button type="submit" className="btn-primary w-full mt-6" disabled={isLoading}>
      {isLoading ? "Uploading..." : `Upload ${fileType}`}
    </button>
  </>
);

export default UploadInvoiceModal;
