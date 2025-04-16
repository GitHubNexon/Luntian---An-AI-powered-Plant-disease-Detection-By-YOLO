import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";
import Dialog from "../components/Dialog";
import detectApi from "../api/detectApi";
import { showToast } from "../utils/toastNotifications";
import SubmitLoader from "../components/SubmitLoader";
import { useAuth } from "../contexts/AuthContext";

import ImageUpload from "../components/ImageUpload";

export const DetectionFormModal = ({
  open,
  close,
  onSuccess,
  initialData = null,
  mode = "add",
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    plantName: "",
    description: "",
    images: [],
    status: {
      isDeleted: false,
      isArchived: false,
    },
    createdBy: user._id,
  });
  const imageUploadRef = useRef(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);

  const handleImagesChange = useCallback((images) => {
    setUploadImages(images);
    setFormData((prev) => ({
      ...prev,
      images: images.map((img) => img.base64),
    }));
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const transformedImages =
        initialData.images?.map((img, index) => ({
          base64: img,
          name: `image-${index + 1}`,
          size: 0,
          file: null,
        })) || [];

      setFormData({
        plantName: initialData.plantName || "",
        description: initialData.description || "",
        images: initialData.images || [],
        status: {
          isDeleted: initialData.status?.isDeleted || false,
          isArchived: initialData.status?.isArchived || false,
        },
        createdBy: user._id,
      });

      setUploadImages(transformedImages); // this is what ImageUpload consumes
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let updatedFields = {};

      if (mode === "edit" && initialData) {
        for (let key in formData) {
          if (formData.hasOwnProperty(key)) {
            if (Array.isArray(formData[key])) {
              const originalImages = initialData[key] || [];
              const currentImages = formData[key] || [];
              if (
                originalImages.length !== currentImages.length ||
                originalImages.some(
                  (img, index) => img !== currentImages[index]
                )
              ) {
                updatedFields[key] = formData[key];
              }
            } else if (formData[key] !== initialData[key]) {
              updatedFields[key] = formData[key];
            }
          }
        }

        const plantChanged = updatedFields.hasOwnProperty("plantName");
        const descriptionChanged = updatedFields.hasOwnProperty("description");
        const imagesChanged = updatedFields.hasOwnProperty("images");

        if (!plantChanged && !descriptionChanged && !imagesChanged) {
          showToast("No changes detected ", "info");
          return;
        }
        await detectApi.updateDetections(initialData._id, updatedFields);
        console.log("Updated fields only:", updatedFields);
        showToast("Detection updated successfully", "success");
      } else {
        await detectApi.createDetections(formData);
        console.log(formData);
        showToast("Detection created successfully", "success");
      }

      onSuccess();
      close();
      if (mode === "add") {
        setFormData({
          plantName: "",
          description: "",
          images: [],
          status: {
            isDeleted: false,
            isArchived: false,
          },
          createdBy: user._id,
        });
        imageUploadRef.current?.reset();
      }
    } catch (error) {
      showToast(
        `Failed to ${mode === "edit" ? "update" : "create"} detection`,
        "error"
      );
    } finally {
      setIsLoading(false); // Hide the loader
    }
  };

  const handleClose = () => {
    setShowCloseDialog(true);
  };
  const confirmClose = () => {
    setShowCloseDialog(false);
    setFormData({
      plantName: "",
      description: "",
      images: [],
      status: {
        isDeleted: false,
        isArchived: false,
      },
      createdBy: user._id,
    });
    imageUploadRef.current?.reset();
    close();
  };

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        title={mode === "edit" ? "Edit Detections" : "Create Detections"}
      >
        <form onSubmit={handleSubmit} className="p-6 ">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <TextInput
              label="PlantName"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              isArea={true}
            />
          </div>
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Images
            </label>
            <ImageUpload
              enableMulti={true}
              onImagesChange={handleImagesChange}
              ref={imageUploadRef}
              //   initialImages={mode === "edit" ? formData.images : []}
              initialImages={uploadImages}
              mode={mode}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {mode === "edit" ? "Update Detection" : "Create Detection"}
            </button>
          </div>
        </form>
      </Modal>

      <Dialog
        isOpen={showCloseDialog}
        title="Are you sure?"
        description="Are you sure you want to close without saving?"
        isProceed="Yes, Close"
        isCanceled="Cancel"
        onConfirm={confirmClose}
        onCancel={() => setShowCloseDialog(false)}
      />

      <SubmitLoader isLoading={isLoading} />
    </>
  );
};

export default DetectionFormModal;
