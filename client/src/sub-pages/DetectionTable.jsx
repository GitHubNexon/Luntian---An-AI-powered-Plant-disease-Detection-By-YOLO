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

import detectApi from "../api/detectApi";
import { showToast } from "../utils/toastNotifications";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import Dialog from "../components/Dialog";
import SkeletonTableLoader from "../helper/SkeletonTableLoader";
import DetectionFormModal from "../Modal/DetectionFormModal";

// Configuration for sortable columns
const sortableColumns = {
  plantName: true,
  description: true,
  createdAt: true,
  status: true,
  "#": false,
  actions: false,
};

const DetectionTable = () => {
  const [detections, setDetections] = useState([]);
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    action: null,
    detectionId: null,
    // plantName: null,
    title: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const response = await detectApi.getAllDetections(
        pagination.currentPage,
        pagination.limit,
        keyword,
        sortConfig.sortBy || "createdAt",
        sortConfig.sortOrder,
        "",
        status
      );
      setDetections(response.detections);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error fetching detection data:", error);
      showToast("error", "Failed to fetch detection data.");
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
    fetchData();
  }, [pagination.currentPage, sortConfig, keyword, status]);

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
      detectionId: id,
      // plantName,
      title: `Confirm ${action}`,
      description: `Are you sure you want to ${action} this detection? This action cannot be undone.`,
    });
  };

  const confirmAction = async () => {
    try {
      switch (dialogConfig.action) {
        case "delete":
          await detectApi.softDeleteDetection(dialogConfig.detectionId);
          showToast("Detections deleted successfully", "success");
          break;
        case "archive":
          await detectApi.softArchiveDetection(dialogConfig.detectionId);
          showToast("Detections archived successfully", "success");
          break;
        case "undoDelete":
          await detectApi.undoDeleteDetection(dialogConfig.detectionId);
          showToast("Detections restore from delete successful", "success");
          break;
        case "undoArchive":
          await detectApi.undoArchiveDetection(dialogConfig.detectionId);
          showToast("Detections restored from archive successfully", "success");
          break;
        default:
          break;
      }
      fetchData();
    } catch (error) {
      console.error(`Error performing ${dialogConfig.action}:`, error);
      showToast(`Failed to ${dialogConfig.action} detection`, "error");
    } finally {
      setDialogConfig({ ...dialogConfig, isOpen: false });
    }
  };

  const cancelAction = () => {
    setDialogConfig({ ...dialogConfig, isOpen: false });
  };

  const toggleRow = (detectionId) => {
    setExpandedRows((prev) =>
      prev.includes(detectionId)
        ? prev.filter((id) => id !== detectionId)
        : [...prev, detectionId]
    );
  };

  const ExpandedRowContent = ({ detection }) => {
    const {
      plantName = "Unknown Plant",
      description = "No description available.",
      images = [],
      results = [],
    } = detection;

    const placeholderImage =
      "https://via.placeholder.com/400x300?text=No+Image";

    const handleImageError = (e) => {
      e.target.src = placeholderImage;
    };

    return (
      <tr className="bg-gray-100">
        <td colSpan="8" className="px-6 py-6">
          <div className="flex flex-col items-center text-center mb-6">
            <h3 className="text-2xl font-bold text-[#41ab5d]">{plantName}</h3>
            <p className="text-gray-600 mt-2 max-w-2xl">{description}</p>
          </div>

          {results.length > 0 ? (
            results.map((result, idx) => {
              const predictions = result.predictions || [];
              const image = images[idx] || placeholderImage;

              return (
                <div
                  key={result.inference_id || idx}
                  className="mb-6 flex flex-col sm:flex-row gap-6"
                >
                  {/* Image Section */}
                  <div className="sm:w-1/3 w-full">
                    <img
                      src={image}
                      alt={`Detection ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />
                  </div>

                  {/* Detection Details */}
                  <div className="sm:w-2/3 w-full">
                    <div className="mb-4 text-sm text-gray-700">
                      <p>
                        <strong>Inference ID:</strong>{" "}
                        {result.inference_id || "N/A"}
                      </p>
                      <p>
                        <strong>Processing Time:</strong>{" "}
                        {typeof result.time === "number"
                          ? `${(result.time * 1000).toFixed(2)} ms`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Image Size:</strong>{" "}
                        {result.image?.width && result.image?.height
                          ? `${result.image.width}x${result.image.height}`
                          : "N/A"}
                      </p>
                    </div>

                    <h4 className="text-md font-semibold mb-2">Detections:</h4>

                    {predictions.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {predictions.map((pred, index) => (
                          <div
                            key={pred.detection_id || index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-sm"
                          >
                            <p>
                              <strong>Class:</strong> {pred.class || "Unknown"}
                            </p>
                            <p>
                              <strong>Class ID:</strong>{" "}
                              {pred.class_id ?? "N/A"}
                            </p>
                            <p>
                              <strong>Confidence:</strong>{" "}
                              {pred.confidence != null
                                ? `${(pred.confidence * 100).toFixed(2)}%`
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Box:</strong> x:{pred.x ?? "N/A"}, y:
                              {pred.y ?? "N/A"}, w:{pred.width ?? "N/A"}, h:
                              {pred.height ?? "N/A"}
                            </p>
                            <p>
                              <strong>Detection ID:</strong>{" "}
                              {pred.detection_id || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No detections available.</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No results available.</p>
          )}
          {detection.info && detection.info.length > 0 && (
  <div className="mt-10">
    <h4 className="text-xl font-semibold text-[#41ab5d] mb-4">Disease Info</h4>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 text-sm text-left">
        <thead className="bg-[#f2fdf5] text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3 border">Description</th>
            <th className="px-4 py-3 border">Plants Affected</th>
            <th className="px-4 py-3 border">Causes & Risk Factors</th>
            <th className="px-4 py-3 border">Treatment & Management</th>
            <th className="px-4 py-3 border">Important Notes</th>
          </tr>
        </thead>
        <tbody>
          {detection.info.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-3 border text-gray-800">
                {item.diseaseDescription}
              </td>
              <td className="px-4 py-3 border text-gray-800">
                {Array.isArray(item.plantsAffected)
                  ? item.plantsAffected.join(", ")
                  : "N/A"}
              </td>
              <td className="px-4 py-3 border text-gray-800">
                {Array.isArray(item.causesAndRiskFactors)
                  ? item.causesAndRiskFactors.join(", ")
                  : "N/A"}
              </td>
              <td className="px-4 py-3 border text-gray-800">
                {Array.isArray(item.treatmentAndManagement)
                  ? item.treatmentAndManagement.join(", ")
                  : "N/A"}
              </td>
              <td className="px-4 py-3 border text-gray-800">
                {item.importantNotes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        </td>
      </tr>
    );
  };

  return (
    <div className="mx-auto px-4 py-8 overflow-scroll m-2">
      {" "}
      <h2 className="text-2xl mb-2 font-bold">ALL DETECTIONS</h2>
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
          <span className="max-md:hidden">Create Detections</span>
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 text-[0.7rem]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {[
                "Expand",
                "#",
                "Plant Name",
                "Description",
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
              {detections.map((detection, index) => (
                <React.Fragment key={detection._id}>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 w-12">
                      <button
                        onClick={() => toggleRow(detection._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {expandedRows.includes(detection._id) ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-center">{index + 1}</td>
                    <td className="responsive-td">{detection.plantName}</td>
                    <td className="responsive-td">{detection.description}</td>

                    <td className="responsive-td">
                      {moment(detection.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          detection.status.isDeleted
                            ? "bg-red-100 text-red-800"
                            : detection.status.isArchived
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {detection.status.isDeleted
                          ? "Deleted"
                          : detection.status.isArchived
                          ? "Archived"
                          : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <>
                        {!detection.status.isDeleted &&
                          !detection.status.isArchived && (
                            <button
                              onClick={() => setIsEditModalOpen(detection)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          )}
                        {!detection.status.isDeleted &&
                          !detection.status.isArchived && (
                            <>
                              <button
                                onClick={() =>
                                  handleAction("delete", detection._id)
                                }
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() =>
                                  handleAction("archive", detection._id)
                                }
                                className="text-yellow-600 hover:text-yellow-800"
                                title="Archive"
                              >
                                <FaArchive />
                              </button>
                            </>
                          )}
                        {(detection.status.isDeleted ||
                          detection.status.isArchived) && (
                          <button
                            onClick={() =>
                              handleAction(
                                detection.status.isDeleted
                                  ? "undoDelete"
                                  : "undoArchive",
                                detection._id
                              )
                            }
                            className="text-green-600 hover:text-green-800"
                            title="Undo"
                          >
                            <FaUndo />
                          </button>
                        )}
                      </>
                    </td>
                  </tr>
                  {expandedRows.includes(detection._id) && (
                    <ExpandedRowContent detection={detection} />
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
      <DetectionFormModal
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        mode="add"
      />
      <DetectionFormModal
        open={!!isEditModalOpen}
        close={() => setIsEditModalOpen(null)}
        onSuccess={fetchData}
        initialData={isEditModalOpen}
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

export default DetectionTable;
