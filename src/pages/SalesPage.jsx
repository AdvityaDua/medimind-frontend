import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Search, ArrowUpDown, X, FileText, FileSpreadsheet, DollarSign, Eye } from "lucide-react";
import { useGetSalesQuery, useCreateSaleMutation } from "../app/api/salesApiSlice";
import { toast } from 'react-toastify';

// --- Dummy Shadcn UI Components (for illustration - replace with actual imports if shadcn is set up) ---
const Button = ({ children, onClick, className, type = "button", disabled, variant = "default" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium text-sm transition-colors
      ${variant === "default" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
      ${variant === "outline" ? "border border-gray-300 text-gray-700 hover:bg-gray-100" : ""}
      ${variant === "ghost" ? "text-gray-700 hover:bg-gray-100" : ""}
      ${variant === "destructive" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
      ${className}
    `}
    disabled={disabled}
  >
    {children}
  </button>
);

const Dialog = ({ isOpen, onOpenChange, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-lg mx-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};
const DialogContent = ({ children, className }) => <div className={`relative ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => <h3 className="text-xl font-bold mb-2 text-gray-800">{children}</h3>;
const DialogFooter = ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>;
const Input = ({ id, value, onChange, className, type = "text", required, step, placeholder, autoFocus }) => (
  <input id={id} value={value} onChange={onChange} className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} type={type} required={required} step={step} placeholder={placeholder} autoFocus={autoFocus} />
);
const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>
);

// --- Modals ---
const CreateSaleModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' or 'file'
  const [manualFormData, setManualFormData] = useState({
    sale_id: "",
    sale_datetime: "",
    total_amount: 0,
    items: [{ product_name: "", quantity: 0, price: 0, amount: 0 }],
  });
  const [file, setFile] = useState(null);

  const [createSale, { isLoading }] = useCreateSaleMutation();
  const saleIdRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeTab === "manual" && saleIdRef.current) {
      saleIdRef.current.focus();
    }
  }, [isOpen, activeTab]);

  const handleManualChange = (e) => {
    const { id, value } = e.target;
    setManualFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = manualFormData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [name]: value };
        if (name === "quantity" || name === "price") {
          const quantity = parseFloat(updatedItem.quantity || 0);
          const price = parseFloat(updatedItem.price || 0);
          updatedItem.amount = (quantity * price).toFixed(2);
        }
        return updatedItem;
      }
      return item;
    });

    const newTotalAmount = updatedItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    setManualFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotalAmount.toFixed(2),
    }));
  };

  const addItemRow = () => {
    setManualFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_name: "", quantity: 0, price: 0, amount: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    setManualFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSale({ input_type: "manual", ...manualFormData }).unwrap();
      toast.success("Manual sale recorded successfully!");
      onClose();
      setManualFormData({
        sale_id: "",
        sale_datetime: "",
        total_amount: 0,
        items: [{ product_name: "", quantity: 0, price: 0, amount: 0 }],
      });
    } catch (err) {
      console.error("Failed to create manual sale: ", err);
      toast.error("Failed to create manual sale.");
    }
  };

  const handleFileUploadSubmit = async (input_type) => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    try {
      await createSale({ input_type, file }).unwrap();
      toast.success(`${input_type.toUpperCase()} file uploaded successfully!`);
      onClose();
      setFile(null);
    } catch (err) {
      console.error("Failed to upload file: ", err);
      toast.error("Failed to upload file.");
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Upload or Record Sale</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </DialogHeader>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("manual")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "manual" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Manual Entry
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("file")}
              className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "file" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              PDF / Excel Upload
            </Button>
          </nav>
        </div>

        {activeTab === "manual" ? (
          <form onSubmit={handleManualSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sale_id" className="text-right">Sale ID</Label>
              <Input id="sale_id" value={manualFormData.sale_id} onChange={handleManualChange} className="col-span-3" required autoFocus ref={saleIdRef} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sale_datetime" className="text-right">Date & Time</Label>
              <Input id="sale_datetime" type="datetime-local" value={manualFormData.sale_datetime} onChange={handleManualChange} className="col-span-3" required />
            </div>

            <div className="col-span-4 mt-4">
              <h4 className="text-lg font-semibold mb-2">Items</h4>
              {manualFormData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-10 items-center gap-2 mb-2">
                  <div className="col-span-4">
                    <Input
                      name="product_name"
                      placeholder="Product Name"
                      value={item.product_name}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      name="quantity"
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      name="price"
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <span>₹{parseFloat(item.amount).toFixed(2)}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button type="button" variant="ghost" onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItemRow} className="mt-2 w-full flex items-center justify-center gap-2">
                <Plus size={16} /> Add Item
              </Button>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4 font-bold">
              <Label className="text-right col-span-3">Total Amount:</Label>
              <span className="col-span-1">₹{parseFloat(manualFormData.total_amount).toFixed(2)}</span>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Recording..." : "Record Sale"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file_type" className="text-right">File Type</Label>
              <div className="col-span-3 flex space-x-4">
                <Button
                  variant={file?.type === "application/pdf" ? "default" : "outline"}
                  onClick={() => handleFileUploadSubmit("pdf")}
                  disabled={isLoading || !file}
                  className="flex items-center gap-2"
                >
                  <FileText size={16} /> PDF
                </Button>
                <Button
                  variant={file?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file?.type === "text/csv" ? "default" : "outline"}
                  onClick={() => handleFileUploadSubmit("excel")}
                  disabled={isLoading || !file}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} /> Excel / CSV
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">Upload File</Label>
              <Input id="file" type="file" onChange={handleFileChange} className="col-span-3" required />
            </div>

            <DialogFooter>
              <Button onClick={() => handleFileUploadSubmit(file?.type === "application/pdf" ? "pdf" : "excel")} disabled={isLoading || !file}>
                {isLoading ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SaleItemsModal = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sale Details: {sale.sale_id}</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Date & Time:</span>
            <span>{format(new Date(sale.sale_datetime), "PPP p")}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Source:</span>
            <span className="capitalize">{sale.source}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
            <span>Total Amount:</span>
            <span>₹{parseFloat(sale.total_amount).toFixed(2)}</span>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-2">Items Sold</h4>
          {sale.items && sale.items.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {sale.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 text-sm bg-gray-50 p-3 rounded-md">
                  <span className="font-medium col-span-2">{item.product_name}</span>
                  <span className="col-span-1 text-right">{item.quantity} x ₹{parseFloat(item.price).toFixed(2)}</span>
                  <span className="col-span-1 text-right font-medium">₹{parseFloat(item.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No items recorded for this sale.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function SalesPage({
  salesData, isLoadingSales, isErrorSales, salesError
}) {
  const [isCreateSaleModalOpen, setIsCreateSaleModalOpen] = useState(false);
  const [isSaleItemsModalOpen, setIsSaleItemsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredAndSortedSales = useMemo(() => {
    let filtered = salesData || [];

    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.sale_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.items?.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "sale_id":
            aValue = a.sale_id || "";
            bValue = b.sale_id || "";
            break;
          case "sale_datetime":
            aValue = new Date(a.sale_datetime).getTime();
            bValue = new Date(b.sale_datetime).getTime();
            break;
          case "total_amount":
            aValue = parseFloat(a.total_amount) || 0;
            bValue = parseFloat(b.total_amount) || 0;
            break;
          case "source":
            aValue = a.source || "";
            bValue = b.source || "";
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    }
    return filtered;
  }, [salesData, searchTerm, sortBy, sortDirection]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  if (isLoadingSales) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 flex justify-center items-center min-h-screen text-lg font-medium">
        Loading Sales Data...
      </div>
    );
  }

  if (isErrorSales) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 text-red-600 text-lg font-medium">
        Error: {salesError?.data?.detail || "Failed to load sales data."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales</h1>

        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => setIsCreateSaleModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
            <Plus size={20} /> Upload/Record Sale
          </Button>
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredAndSortedSales?.length === 0 ? (
          <div className="dashboard-card p-6 text-center text-gray-500">
            No sales recorded yet. Use "Upload/Record Sale" to add sales data.
          </div>
        ) : (
          <div className="dashboard-card p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-gray-600 uppercase tracking-wider bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("sale_id")}>
                      <div className="flex items-center gap-1">Sale ID {sortBy === "sale_id" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("sale_datetime")}>
                      <div className="flex items-center gap-1">Date & Time {sortBy === "sale_datetime" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("total_amount")}>
                      <div className="flex items-center gap-1">Total Amount {sortBy === "total_amount" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedSales?.map((sale) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{sale.sale_id}</td>
                      <td className="py-3 px-4">
                        {format(new Date(sale.sale_datetime), "PPP p")}
                      </td>
                      <td className="py-3 px-4">₹{parseFloat(sale.total_amount).toFixed(2)}</td>
                      <td className="py-3 px-4 capitalize">{sale.source}</td>
                      <td className="py-3 px-4">
                        <Button
                          onClick={() => {
                            setSelectedSale(sale);
                            setIsSaleItemsModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 bg-transparent hover:bg-transparent p-0"
                          title="View Items"
                          variant="ghost"
                        >
                          <Eye size={18} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <CreateSaleModal isOpen={isCreateSaleModalOpen} onClose={() => setIsCreateSaleModalOpen(false)} />
      <SaleItemsModal isOpen={isSaleItemsModalOpen} onClose={() => setIsSaleItemsModalOpen(false)} sale={selectedSale} />
    </div>
  );
}
