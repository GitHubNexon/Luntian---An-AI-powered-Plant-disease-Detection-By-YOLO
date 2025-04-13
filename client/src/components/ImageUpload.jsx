import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FaUpload } from "react-icons/fa";

const ImageUpload = forwardRef(
  (
    { enableMulti = false, onImagesChange, initialImages = [], mode = "add" },
    ref
  ) => {
    const [images, setImages] = useState([]); // Initialize as empty
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024;
    const MIN_LOADER_TIME = 2000;

    useEffect(() => {
      if (Array.isArray(initialImages) && initialImages.length > 0) {
        const validImages = initialImages.filter(
          (img) => img && typeof img === "object" && img.base64
        );
        if (JSON.stringify(validImages) !== JSON.stringify(images)) {
          setImages(validImages);
        }
      } else if (images.length > 0) {
        setImages([]);
      }
    }, [initialImages]);

    const toBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const getTotalSize = () => {
      if (!Array.isArray(images)) return 0;
      return images.reduce((total, img) => {
        if (!img || typeof img !== "object") return total;
        return total + (img.size || 0);
      }, 0);
    };

    const handleFiles = async (files) => {
      setError("");
      setIsUploading(true);

      const startTime = Date.now();

      try {
        const newImages = [];
        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed");
            continue;
          }

          const base64 = await toBase64(file);
          const imageData = {
            file,
            base64,
            size: file.size,
            name: file.name,
          };

          newImages.push(imageData);
        }

        const totalSize =
          newImages.reduce((sum, img) => sum + img.size, 0) + getTotalSize();
        if (totalSize > MAX_TOTAL_SIZE) {
          setError("Total size exceeds 25MB limit");
          setIsUploading(false);
          return;
        }

        if (enableMulti) {
          setImages((prev) => [...prev, ...newImages]);
        } else {
          setImages(newImages.slice(0, 1));
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = MIN_LOADER_TIME - elapsedTime;
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
      } catch (err) {
        setError("Error processing images");
      } finally {
        setIsUploading(false);
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true);
      } else if (e.type === "dragleave") {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleInputChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    };

    const removeImage = (index) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageClick = (image) => {
      if (!isUploading) {
        setSelectedImage(image);
      }
    };

    const closePreview = () => {
      setSelectedImage(null);
    };

    useEffect(() => {
      console.log("Uploaded images:", images);
      if (onImagesChange) {
        onImagesChange(images);
      }
    }, [images, onImagesChange]);

    useImperativeHandle(ref, () => ({
      reset: () => setImages([]),
    }));

    return (
      <div className="w-full max-w-2xl">
        {/* <div
          className={`border-2 border-dashed rounded-lg p-8 text-center
          ${
            isDragging && !isUploading
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }
          transition-colors duration-200 relative`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
              <div className="loader-bar1"></div>
              <p className="text-gray-600 mt-2">
                Processing image{enableMulti ? "s" : ""}...
              </p>
            </div>
          )}

          <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop {enableMulti ? "images" : "an image"} here or click to
            select
          </p>
          {mode !== "edit" && !isUploading && images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 mb-2">
              Total size: {(getTotalSize() / (1024 * 1024)).toFixed(2)} MB / 25
              MB
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={enableMulti}
            onChange={handleInputChange}
           className="opacity-0 absolute"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload {enableMulti ? "Images" : "Image"}
          </label>
        </div> */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center
    ${
      isDragging && !isUploading
        ? "border-blue-500 bg-blue-50"
        : "border-gray-300 bg-white"
    }
    transition-colors duration-200 relative flex flex-col items-center justify-center`} // Add flex classes
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
              <div className="loader-bar1"></div>
              <p className="text-gray-600 mt-2">
                Processing image{enableMulti ? "s" : ""}...
              </p>
            </div>
          )}

          <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop {enableMulti ? "images" : "an image"} here or click to
            select
          </p>
          {mode !== "edit" && !isUploading && images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 mb-4">
              Total size: {(getTotalSize() / (1024 * 1024)).toFixed(2)} MB / 25
              MB
            </p>
          )}
          <div className="relative inline-block">
            {" "}
            {/* Wrapper for input and label */}
            <input
              type="file"
              accept="image/*"
              multiple={enableMulti}
              onChange={handleInputChange}
              className="opacity-0 absolute w-full h-full cursor-pointer" // Ensure input covers label
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
            >
              Upload {enableMulti ? "Images" : "Image"}
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {!isUploading && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg shadow-md p-2 cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.base64}
                  alt={image.name || `image-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {!isUploading && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closePreview}
          >
            <div
              className="max-w-[90vw] max-h-[90vh] m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.base64}
                alt={selectedImage.name || "preview"}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ImageUpload;
