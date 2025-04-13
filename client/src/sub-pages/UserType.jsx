import React, { useEffect, useState } from "react";
import baseApi from "../api/baseApi";
import { useLoading } from "../contexts/LoadingContext";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import Modal from "../components/Modal";
import Dialog from "../components/Dialog";
import { showToast } from "../utils/toastNotifications";

const UserType = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUserType, setEditUserType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for Dialog
  const [userTypeToDelete, setUserTypeToDelete] = useState(null); // Track user type to delete
  const { showLoading, hideLoading, setRefresh } = useLoading();

  const fetchUserTypes = async () => {
    try {
      const response = await baseApi.getBaseData();
      setUserTypes(response.userTypes || []);
      setAccessTypes(response.accessTypes || []);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleCreate = () => {
    setEditUserType(null);
    setModalOpen(true);
  };

  const handleUpdate = (userType) => {
    setEditUserType(userType);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setUserTypeToDelete(id); // Set the ID of the user type to delete
    setDialogOpen(true); // Open the dialog
  };

  const handleDeleteConfirm = async () => {
    if (userTypeToDelete) {
      try {
        showLoading(3000);
        await baseApi.deleteUserType(userTypeToDelete);
        await fetchUserTypes();
        showToast("UserType deleted successfully", "success");
        setRefresh(true);
      } catch (error) {
        console.error("Error deleting user type:", error);
      } finally {
        hideLoading(3000);
        setDialogOpen(false); // Close the dialog
        setUserTypeToDelete(null); // Reset the user type to delete
      }
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false); // Close the dialog
    setUserTypeToDelete(null); // Reset the user type to delete
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditUserType(null);
  };

  const handleFormSubmit = async (userType) => {
    showLoading(3000);
    try {
      if (editUserType) {
        await baseApi.updateUserType(editUserType._id, userType);
        showToast("UserType Updated successfully", "success");
      } else {
        await baseApi.createUserType(userType);
        showToast("UserType Created successfully", "success");
      }
      await fetchUserTypes();
      setRefresh(true);
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      hideLoading(3000);
    }
  };

  const shouldShowActions = (userType) => {
    const protectedUserType = ["Administrator"];
    return !protectedUserType.includes(userType);
  };

  return (
    <div className=" mx-auto space-y-6 p-4 sm:p-6">
      <button
        onClick={handleCreate}
        className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-400 transition duration-200"
      >
        <FaPlus /> <span>Add New User Type</span>
      </button>

      <ol className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTypes.map((userType) => (
          <li
            key={userType._id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            <span className="text-blue-600 cursor-pointer hover:underline">
              {userType.user}
            </span>
            {shouldShowActions(userType.user) && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(userType)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteClick(userType._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>

      {modalOpen && (
        <Modal
          open={modalOpen}
          close={handleModalClose}
          title={editUserType ? "Edit User Type" : "Create User Type"}
        >
          <UserTypeForm
            userType={editUserType || { user: "", access: [] }}
            accessTypes={accessTypes}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
          />
        </Modal>
      )}

      <Dialog
        isOpen={dialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user type? This action cannot be undone."
        isProceed="Yes, Delete"
        isCanceled="No, Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

// UserTypeForm remains unchanged
const UserTypeForm = ({ userType, accessTypes, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(userType);

  useEffect(() => {
    setFormData(userType);
  }, [userType]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "access") {
      const updatedAccess = checked
        ? [...formData.access, value]
        : formData.access.filter((access) => access !== value);
      setFormData({ ...formData, access: updatedAccess });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      <div>
        <label htmlFor="user" className="block text-sm font-medium">
          User Type Name
        </label>
        <input
          type="text"
          id="user"
          name="user"
          value={formData.user}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Access Types</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {accessTypes.map((accessType) => (
            <div key={accessType._id} className="flex items-center">
              <input
                type="checkbox"
                id={accessType.code}
                name="access"
                value={accessType.code}
                checked={formData.access.includes(accessType.code)}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor={accessType.code} className="text-sm">
                {accessType.access}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-400 transition duration-200"
        >
          {userType._id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default UserType;
