import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Search, ArrowUpDown, X } from "lucide-react";
import { useGetInventoryQuery, useCreateInventoryMutation, useUpdateInventoryMutation, useDeleteInventoryMutation, useGetMedicinesQuery, useCreateMedicineMutation } from "../app/api/inventoryApiSlice";
import { toast } from 'react-toastify';

// --- Dummy Shadcn UI Components (for illustration - replace with actual imports if shadcn is set up) ---
const Button = ({ children, onClick, className, type = "button", disabled }) => (
  <button type={type} onClick={onClick} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${className}`} disabled={disabled}>
    {children}
  </button>
);
const Dialog = ({ isOpen, onOpenChange, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children, className }) => <div className={`relative ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => <h3 className="text-xl font-bold mb-2 text-gray-800">{children}</h3>;
const DialogFooter = ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>;
const Input = ({ id, value, onChange, className, type = "text", required, step, placeholder }) => (
  <input id={id} value={value} onChange={onChange} className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} type={type} required={required} step={step} placeholder={placeholder} />
);
const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>
);
const Select = ({ value, onValueChange, disabled, children, className }) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} disabled={disabled} className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white ${className}`}>
    {children}
  </select>
);
const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
const SelectValue = ({ children, placeholder }) => <span>{children || placeholder}</span>;
const SelectContent = ({ children }) => <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 mt-1">{children}</div>;
const SelectItem = ({ value, children, disabled }) => <option value={value} disabled={disabled} className="p-2 hover:bg-gray-100 cursor-pointer">{children}</option>;
const Checkbox = ({ id, checked, onCheckedChange }) => (
  <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
);

// --- Modals ---
const CreateMedicineModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [generic_name, setGenericName] = useState("");
  const [requires_prescription, setRequiresPrescription] = useState(false);
  const [category, setCategory] = useState("");

  const [createMedicine, { isLoading }] = useCreateMedicineMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicine({ name, generic_name: generic_name || null, requires_prescription, category: category || null }).unwrap();
      toast.success("Medicine created successfully!");
      onClose();
      setName("");
      setGenericName("");
      setRequiresPrescription(false);
      setCategory("");
    } catch (err) {
      console.error("Failed to create medicine: ", err);
      toast.error("Failed to create medicine.");
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Medicine</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="generic_name" className="text-right">Generic Name</Label>
            <Input id="generic_name" value={generic_name} onChange={(e) => setGenericName(e.target.value)} className="col-span-3" placeholder="Optional" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" placeholder="Optional" />
          </div>
          <div className="flex items-center gap-2 mt-4 col-span-4 justify-end">
            <Checkbox id="requires_prescription" checked={requires_prescription} onCheckedChange={setRequiresPrescription} />
            <Label htmlFor="requires_prescription">Requires Prescription</Label>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Medicine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CreateInventoryModal = ({ isOpen, onClose }) => {
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit_price, setUnitPrice] = useState("");

  const { data: medicines, isLoading: isLoadingMedicines } = useGetMedicinesQuery();
  const [createInventory, { isLoading }] = useCreateInventoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventory({
        medicine: parseInt(medicineId),
        quantity: parseInt(quantity),
        unit_price: parseFloat(unit_price),
      }).unwrap();
      toast.success("Inventory entry created successfully!");
      onClose();
      setMedicineId("");
      setQuantity("");
      setUnitPrice("");
    } catch (err) {
      console.error("Failed to create inventory entry: ", err);
      toast.error("Failed to create inventory entry.");
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Existing Medicine to Inventory</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="medicine" className="text-right">Medicine</Label>
            <Select value={medicineId} onValueChange={setMedicineId} disabled={isLoadingMedicines} className="col-span-3">
              <SelectTrigger>
                <SelectValue placeholder="Select a medicine">
                  {medicines?.find(med => String(med.id) === medicineId)?.name || "Select a medicine"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {isLoadingMedicines ? (
                  <SelectItem value="" disabled>Loading medicines...</SelectItem>
                ) : (
                  medicines?.map((med) => (
                    <SelectItem key={med.id} value={String(med.id)}>{med.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_price" className="text-right">Unit Price (₹)</Label>
            <Input id="unit_price" type="number" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} className="col-span-3" step="0.01" required />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading || isLoadingMedicines || !medicineId || !quantity || !unit_price}>
              {isLoading ? "Adding..." : "Add to Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditInventoryModal = ({ isOpen, onClose, inventoryItem }) => {
  const [quantity, setQuantity] = useState(inventoryItem?.quantity || "");
  const [unit_price, setUnitPrice] = useState(inventoryItem?.unit_price || "");
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();

  useEffect(() => {
    if (inventoryItem) {
      setQuantity(inventoryItem.quantity);
      setUnitPrice(inventoryItem.unit_price);
    }
  }, [inventoryItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateInventory({
        id: inventoryItem.id,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unit_price),
      }).unwrap();
      toast.success("Inventory updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update inventory: ", err);
      toast.error("Failed to update inventory.");
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory: {inventoryItem?.medicine_detail?.name}</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_price" className="text-right">Unit Price (₹)</Label>
            <Input id="unit_price" type="number" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} className="col-span-3" step="0.01" required />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading || !quantity || !unit_price}>
              {isLoading ? "Updating..." : "Update Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function InventoryPage({
  inventoryData, isLoadingInventory, isErrorInventory, inventoryError
}) {
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  const [isCreateMedicineModalOpen, setIsCreateMedicineModalOpen] = useState(false);
  const [isCreateInventoryModalOpen, setIsCreateInventoryModalOpen] = useState(false);
  const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await deleteInventory(id).unwrap();
        toast.success("Inventory item deleted successfully!");
      } catch (err) {
        console.error("Failed to delete inventory item: ", err);
        toast.error("Failed to delete inventory item.");
      }
    }
  };

  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventoryData || [];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.medicine_detail?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.medicine_detail?.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "name":
            aValue = a.medicine_detail?.name || "";
            bValue = b.medicine_detail?.name || "";
            break;
          case "quantity":
            aValue = a.quantity || 0;
            bValue = b.quantity || 0;
            break;
          case "unit_price":
            aValue = parseFloat(a.unit_price) || 0;
            bValue = parseFloat(b.unit_price) || 0;
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
  }, [inventoryData, searchTerm, sortBy, sortDirection]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  if (isLoadingInventory) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 flex justify-center items-center min-h-screen text-lg font-medium">
        Loading Inventory...
      </div>
    );
  }

  if (isErrorInventory) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 text-red-600 text-lg font-medium">
        Error: {inventoryError?.data?.detail || "Failed to load inventory."}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <Button onClick={() => setIsCreateMedicineModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <Plus size={20} /> New Medicine
            </Button>
            <Button onClick={() => setIsCreateInventoryModalOpen(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-2">
              <Plus size={20} /> Add Existing to Inventory
            </Button>
          </div>
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredAndSortedInventory?.length === 0 ? (
          <div className="dashboard-card p-6 text-center text-gray-500">
            No inventory items found. Add some medicines or inventory entries!
          </div>
        ) : (
          <div className="dashboard-card p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-gray-600 uppercase tracking-wider bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">Medicine Name {sortBy === "name" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4">Generic Name</th>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("quantity")}>
                      <div className="flex items-center gap-1">Quantity {sortBy === "quantity" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("unit_price")}>
                      <div className="flex items-center gap-1">Unit Price {sortBy === "unit_price" && <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />}</div>
                    </th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedInventory?.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{item.medicine_detail?.name}</td>
                      <td className="py-3 px-4">{item.medicine_detail?.generic_name || "N/A"}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {format(new Date(item.last_updated), "PPP p")}
                      </td>
                      <td className="py-3 px-4">
                        {item.mock_expiry_date ? format(new Date(item.mock_expiry_date), "PPP") : "N/A"}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedInventoryItem(item);
                            setIsEditInventoryModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 bg-transparent hover:bg-transparent p-0"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      <CreateMedicineModal isOpen={isCreateMedicineModalOpen} onClose={() => setIsCreateMedicineModalOpen(false)} />
      <CreateInventoryModal isOpen={isCreateInventoryModalOpen} onClose={() => setIsCreateInventoryModalOpen(false)} />
      <EditInventoryModal isOpen={isEditInventoryModalOpen} onClose={() => setIsEditInventoryModalOpen(false)} inventoryItem={selectedInventoryItem} />
    </div>
  );
}
