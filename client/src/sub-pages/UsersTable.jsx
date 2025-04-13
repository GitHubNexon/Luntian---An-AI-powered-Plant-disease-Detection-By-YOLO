import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  FaSort,
  FaTrash,
  FaArchive,
  FaUndo,
  FaLockOpen,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import userApi from "../api/userApi";
import { showToast } from "../utils/toastNotifications";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { unlockAccount } from "../api/authApi";
import SkeletonTableLoader from "../helper/SkeletonTableLoader";
import UserFormModal from "../Modal/UserFormModal";
import Dialog from "../components/Dialog";

// Configuration for sortable columns
const sortableColumns = {
  username: true,
  name: true,
  email: true,
  userType: true,
  createdAt: true,
  status: true,
  "#": false,
  actions: false,
};

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "createdAt",
    sortOrder: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    action: null,
    userId: null,
    email: null,
    title: "",
    description: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers(
        pagination.currentPage,
        pagination.limit,
        keyword,
        sortConfig.sortBy || "createdAt",
        sortConfig.sortOrder,
        "",
        status
      );
      setUsers(response.users);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Error fetching users", "error");
    } finally {
      if (isInitialLoad) {
        setTimeout(() => {
          setLoading(false);
          setIsInitialLoad(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setIsInitialLoad(true);
    fetchUsers();
  }, [pagination.currentPage, sortConfig, keyword, status]);

  const handleSort = (field) => {
    if (!sortableColumns[field]) return;
    setSortConfig((prev) => ({
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (field) => {
    if (!sortableColumns[field]) {
      return null;
    }
    if (sortConfig.sortBy === field) {
      return (
        <FaSort
          className={sortConfig.sortOrder === "asc" ? "rotate-180" : ""}
        />
      );
    }
    return <FaSort className="text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleAction = async (action, id, email) => {
    setDialogConfig({
      isOpen: true,
      action,
      userId: id,
      email,
      title: `Confirm ${action}`,
      description: `Are you sure you want to ${action} this user? This action cannot be undone.`,
    });
  };

  const confirmAction = async () => {
    try {
      switch (dialogConfig.action) {
        case "delete":
          await userApi.softDeleteUser(dialogConfig.userId);
          showToast("User deleted successfully", "success");
          break;
        case "archive":
          await userApi.softArchiveUser(dialogConfig.userId);
          showToast("User archived successfully", "success");
          break;
        case "undoDelete":
          await userApi.undoDeleteUser(dialogConfig.userId);
          showToast("User restore from delete successful", "success");
          break;
        case "undoArchive":
          await userApi.undoArchiveUser(dialogConfig.userId);
          showToast("User restored from archive successfully", "success");
          break;
        case "unlock":
          await unlockAccount(dialogConfig.email);
          showToast("User unlocked successfully", "success");
          break;
        default:
          break;
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error performing ${dialogConfig.action}:`, error);
      showToast(`Failed to ${dialogConfig.action} user`, "error");
    } finally {
      setDialogConfig({ ...dialogConfig, isOpen: false });
    }
  };

  const cancelAction = () => {
    setDialogConfig({ ...dialogConfig, isOpen: false });
  };

  const handleUnlock = (email) => {
    handleAction("unlock", null, email);
  };

  // const handleUnlock = async (email) => {
  //   try {
  //     await unlockAccount(email);
  //     handleAction("unlock", null, email);
  //     showToast("User unlocked successfully", "success");
  //     fetchUsers();
  //   } catch (error) {
  //     showToast("Failed to unlock user", "error");
  //   }
  // };

  const toggleRow = (userId) => {
    setExpandedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const shouldShowActions = (email) => {
    const protectedEmails = ["admin@mail.com"];
    return !protectedEmails.includes(email.toLowerCase());
  };

  const ExpandedRowContent = ({ user }) => (
    <tr className="bg-gray-100">
      <td colSpan="8" className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <div>
            <strong>Last Login:</strong>{" "}
            {user.lastLogin
              ? moment(user.lastLogin).format("MMM DD, YYYY HH:mm")
              : "Never"}
          </div>
          <div>
            <strong>Account Created:</strong>{" "}
            {moment(user.createdAt).format("MMM DD, YYYY HH:mm")}
          </div>
          <div>
            <strong>Full Status:</strong>{" "}
            {user.lockoutUntil
              ? "Locked"
              : user.status.isDeleted
              ? "Deleted"
              : user.status.isArchived
              ? "Archived"
              : "Active"}
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className=" mx-auto px-4 py-8 overflow-scroll m-2">
      <h2 className="text-2xl mb-2 font-bold">ALL USERS</h2>

      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search by keyword"
          className="px-4 py-2 border rounded-md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-r-md ml-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="isDeleted">Deleted</option>
          <option value="isArchived">Archived</option>
        </select>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus />
          <span className="max-md:hidden">Create User</span>
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 text-[0.7rem]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {[
                "Expand",
                "#",
                "username",
                "name",
                "email",
                "userType",
                "created At",
                "status",
                "actions",
              ].map((header) => (
                <th key={header} className="px-6 py-4">
                  <div className="flex items-center gap-2 text-center">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                    <button
                      onClick={() => handleSort(header)}
                      disabled={!sortableColumns[header]}
                    >
                      {renderSortIcon(header)}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <SkeletonTableLoader rows={10} columns={9} duration={1.5} />
          ) : (
            <tbody>
              {users.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 w-12">
                      <button
                        onClick={() => toggleRow(user._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {expandedRows.includes(user._id) ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-center">{index + 1}</td>
                    <td className="responsive-td">{user.username}</td>
                    <td className="responsive-td">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="responsive-td">{user.email}</td>
                    <td className="responsive-td">{user.userType}</td>
                    <td className="responsive-td">
                      {moment(user.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.lockoutUntil
                            ? "bg-gray-400 text-white"
                            : user.status.isDeleted
                            ? "bg-red-100 text-red-800"
                            : user.status.isArchived
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.lockoutUntil
                          ? "Locked"
                          : user.status.isDeleted
                          ? "Deleted"
                          : user.status.isArchived
                          ? "Archived"
                          : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {shouldShowActions(user.email) && (
                        <>
                          {!user.status.isDeleted &&
                            !user.status.isArchived && (
                              <button
                                onClick={() => setEditUser(user)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                            )}
                          {!user.status.isDeleted &&
                            !user.status.isArchived && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction("delete", user._id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction("archive", user._id)
                                  }
                                  className="text-yellow-600 hover:text-yellow-800"
                                  title="Archive"
                                >
                                  <FaArchive />
                                </button>
                              </>
                            )}
                          {(user.status.isDeleted ||
                            user.status.isArchived) && (
                            <button
                              onClick={() =>
                                handleAction(
                                  user.status.isDeleted
                                    ? "undoDelete"
                                    : "undoArchive",
                                  user._id
                                )
                              }
                              className="text-green-600 hover:text-green-800"
                              title="Undo"
                            >
                              <FaUndo />
                            </button>
                          )}
                          {user.lockoutUntil && (
                            <button
                              onClick={() => handleUnlock(user.email)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Unlock"
                            >
                              <FaLockOpen />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(user._id) && (
                    <ExpandedRowContent user={user} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
          {Math.min(
            pagination.currentPage * pagination.limit,
            pagination.totalItems
          )}{" "}
          of {pagination.totalItems} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <MdKeyboardDoubleArrowLeft />
          </button>
          <span className="px-4 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>

      <UserFormModal
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
        mode="add"
      />
      <UserFormModal
        open={!!editUser}
        close={() => setEditUser(null)}
        onSuccess={fetchUsers}
        initialData={editUser}
        mode="edit"
      />

      <Dialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />
    </div>
  );
};

export default UsersTable;
