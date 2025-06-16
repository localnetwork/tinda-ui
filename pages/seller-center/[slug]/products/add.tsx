import BaseApi from "@/lib/api/_base.api";
import siteConfig from "@/site.config";
import { GetServerSidePropsContext } from "next";
import { setContext } from "@/lib/api/interceptor";
import SellerLayout from "@/components/tinda-minimal/modules/seller-center/SellerLayout";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import FormField from "@/components/tinda-minimal/forms/FormField";

export const getServerSideProps = async ({
  params,
  req,
  res,
}: GetServerSidePropsContext) => {
  setContext({
    req,
    res,
    query: {},
    resolvedUrl: "",
  });

  const uuid = params?.slug || "";

  try {
    const response = await BaseApi.get(
      `${siteConfig.APIURL}/seller-center/${uuid}`
    );

    return {
      props: {
        data: response?.data || {},
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      notFound: true,
    };
  }
};

interface UploadResponse {
  data: Array<{
    media: {
      id: string;
      formats: string;
    };
  }>;
}

interface PageProps {
  data: object;
}

export default function Page({ data }: PageProps) {
  const [payload, setPayload] = useState({
    productImages: [],
    productName: "",
    productDescription: "",
    productPrice: "",
    productCategory: "",
    productStock: "",
    productShipping: {
      shippingMethod: "",
      shippingCost: "",
    },
    productTags: [],
    productStatus: "active",
    productSKU: "",
    productBrand: "",
    productAttributes: [],
    productVariations: [],
    productVideos: [],
    productWarranty: "",
    productReturnPolicy: "",
    productMeta: {
      title: "",
      description: "",
      keywords: [],
    },
  });

  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const staticSuggestions = [
    {
      id: "product-images",
      name: "Add at least 3 images",
    },
    {
      id: "product-name",
      name: "Add characters for name to 25~100",
    },
    {
      id: "product-description",
      name: "Add at least 100 characters or 1 image for description",
    },
  ];

  // Inline validation functions
  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case "productName":
        if (!value.trim()) {
          newErrors.productName = "Product name is required";
        } else if (value.trim().length < 10) {
          newErrors.productName = "Product name must be at least 10 characters";
        } else if (value.trim().length > 200) {
          newErrors.productName =
            "Product name must be less than 200 characters";
        } else {
          delete newErrors.productName;
        }
        break;

      case "productDescription":
        if (!value.trim()) {
          newErrors.productDescription = "Product description is required";
        } else if (value.trim().length < 50) {
          newErrors.productDescription =
            "Description must be at least 50 characters";
        } else if (value.trim().length > 2000) {
          newErrors.productDescription =
            "Description must be less than 2000 characters";
        } else {
          delete newErrors.productDescription;
        }
        break;

      case "productPrice":
        const price = parseFloat(value);
        if (!value.trim()) {
          newErrors.productPrice = "Product price is required";
        } else if (isNaN(price) || price <= 0) {
          newErrors.productPrice =
            "Price must be a valid number greater than 0";
        } else if (price > 999999) {
          newErrors.productPrice = "Price cannot exceed 999,999";
        } else {
          delete newErrors.productPrice;
        }
        break;

      case "productStock":
        if (value.trim()) {
          const stock = parseInt(value);
          if (isNaN(stock) || stock < 0) {
            newErrors.productStock =
              "Stock must be a valid number (0 or greater)";
          } else if (stock > 999999) {
            newErrors.productStock = "Stock cannot exceed 999,999";
          } else {
            delete newErrors.productStock;
          }
        } else {
          delete newErrors.productStock;
        }
        break;

      case "productCategory":
        if (!value) {
          newErrors.productCategory = "Product category is required";
        } else {
          delete newErrors.productCategory;
        }
        break;

      case "productSKU":
        if (value.trim() && value.trim().length < 3) {
          newErrors.productSKU = "SKU must be at least 3 characters";
        } else if (value.trim().length > 50) {
          newErrors.productSKU = "SKU must be less than 50 characters";
        } else {
          delete newErrors.productSKU;
        }
        break;

      case "productBrand":
        if (value.trim() && value.trim().length < 2) {
          newErrors.productBrand = "Brand must be at least 2 characters";
        } else if (value.trim().length > 100) {
          newErrors.productBrand = "Brand must be less than 100 characters";
        } else {
          delete newErrors.productBrand;
        }
        break;

      case "shippingCost":
        if (value.trim()) {
          const cost = parseFloat(value);
          if (isNaN(cost) || cost < 0) {
            newErrors.shippingCost =
              "Shipping cost must be a valid number (0 or greater)";
          } else if (cost > 9999) {
            newErrors.shippingCost = "Shipping cost cannot exceed 9,999";
          } else {
            delete newErrors.shippingCost;
          }
        } else {
          delete newErrors.shippingCost;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImages = () => {
    const newErrors = { ...errors };

    if (uploadedImages.length === 0) {
      newErrors.productImages = "At least 1 product image is required";
    } else if (uploadedImages.length > 10) {
      newErrors.productImages = "Maximum 10 images allowed";
    } else {
      delete newErrors.productImages;
    }

    setErrors(newErrors);
    return !newErrors.productImages;
  };

  const imageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "productImages"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return;
      }
    }

    // Check total images limit
    if (uploadedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("media", file);

        const res = await BaseApi.post<UploadResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/media`,
          formData
        );

        const mediaId = res?.data?.data?.[0]?.media?.id;
        const formats = JSON.parse(
          res?.data?.data?.[0]?.media?.formats || "{}"
        );
        const imageUrl = formats?.large;

        if (mediaId && imageUrl) {
          uploadedUrls.push({
            id: mediaId,
            url: imageUrl,
            file: file.name,
          });
        }
      }

      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
      setPayload((prev) => ({
        ...prev,
        productImages: [
          ...prev.productImages,
          ...uploadedUrls.map((img) => img.id),
        ],
      }));

      // Clear image validation error if images are uploaded
      const newErrors = { ...errors };
      delete newErrors.productImages;
      setErrors(newErrors);

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error(() => {
        return (
          <div>
            {error &&
            typeof error === "object" &&
            "data" in error &&
            Array.isArray((error as any).data?.errors) ? (
              (error as any).data.errors.map((err: any, index: number) => (
                <div key={index}>{err.message}</div>
              ))
            ) : (
              <div>Something went wrong!</div>
            )}
          </div>
        );
      });
    } finally {
      setUploading(false);

      // Reset file input
      const input = document.getElementById(
        "product-images"
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    }
  };

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setPayload((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Validate field on change
      validateField(field, value);
    },
    [errors]
  );

  const handleNestedInputChange = useCallback(
    (parentField: string, childField: string, value: any) => {
      setPayload((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: value,
        },
      }));

      // Validate nested field
      validateField(childField, value);
    },
    [errors]
  );

  const removeImage = useCallback(
    (index: number) => {
      setUploadedImages((prev) => {
        const newImages = prev.filter((_, i) => i !== index);
        setPayload((prevPayload) => ({
          ...prevPayload,
          productImages: newImages.map((img) => img.id),
        }));

        // Validate images after removal
        setTimeout(() => validateImages(), 0);

        return newImages;
      });
    },
    [uploadedImages, errors]
  );

  const validateForm = () => {
    let isValid = true;

    // Validate all fields
    Object.keys(payload).forEach((key) => {
      if (key === "productShipping") {
        Object.keys(payload.productShipping).forEach((nestedKey) => {
          if (!validateField(nestedKey, payload.productShipping[nestedKey])) {
            isValid = false;
          }
        });
      } else if (key !== "productImages") {
        if (!validateField(key, payload[key])) {
          isValid = false;
        }
      }
    });

    // Validate images
    if (!validateImages()) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix all validation errors before submitting");
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await BaseApi.post(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          payload
        );

        if (response.data) {
          toast.success("Product created successfully!");
          // Reset form or redirect
        }
      } catch (error: unknown) {
        console.error("Submit error:", error);
        toast.error(() => {
          return (
            <div>
              {error &&
              typeof error === "object" &&
              "data" in error &&
              Array.isArray((error as any).data?.errors) ? (
                (error as any).data.errors.map((err: any, index: number) => (
                  <div key={index}>{err.message}</div>
                ))
              ) : (
                <div>Failed to create product. Please try again.</div>
              )}
            </div>
          );
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [payload]
  );

  // Function to handle drag start
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Function to handle drag enter
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // Function to handle drag leave
  const handleDragLeave = (e) => {
    // Only clear dragOverIndex if we're leaving the entire drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  // Function to handle drop
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...uploadedImages];
    const draggedImage = newImages[draggedIndex];

    // Remove the dragged image from its original position
    newImages.splice(draggedIndex, 1);

    // Insert the dragged image at the new position
    newImages.splice(dropIndex, 0, draggedImage);

    // Update the state with reordered images
    setUploadedImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Function to handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <SellerLayout data={data}>
      <form onSubmit={handleSubmit}>
        <div className="grid mt-[15px] gap-[15px] grid-cols-4">
          <div className="col-span-1 bg-white p-[15px] border-t-[5px] border-[#2673dd] rounded-[5px]">
            <div className="bg-[#E5EEFB] p-[20px] mx-[-15px] mt-[-15px] font-bold">
              Filling Suggestion
            </div>
            {staticSuggestions?.map((item, index) => {
              // Check validation status for each suggestion
              const getValidationStatus = (id: string) => {
                switch (id) {
                  case "product-images":
                    return uploadedImages.length >= 3;
                  case "product-name":
                    return (
                      payload.productName.length >= 25 &&
                      payload.productName.length <= 100
                    );
                  case "product-description":
                    return payload.productDescription.length >= 100;
                  default:
                    return false;
                }
              };

              const isValid = getValidationStatus(item.id);

              return (
                <div
                  className="px-[15px] py-[15px] hover:bg-[#f3f3f3] text-[13px] flex gap-x-[5px] mx-[-15px]"
                  key={index}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="min-w-[20px] h-[20px]"
                  >
                    <path
                      fill={isValid ? "#22c55e" : "#e5e5e5"}
                      fillRule="evenodd"
                      d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M11.1464466,5.92870864 L7.097234,9.97792125 L4.85355339,7.73424065 C4.65829124,7.5389785 4.34170876,7.5389785 4.14644661,7.73424065 C3.95118446,7.92950279 3.95118446,8.24608528 4.14644661,8.44134743 L6.7436806,11.0385814 C6.93894275,11.2338436 7.25552524,11.2338436 7.45078739,11.0385814 L11.8535534,6.63581542 C12.0488155,6.44055327 12.0488155,6.12397078 11.8535534,5.92870864 C11.6582912,5.73344649 11.3417088,5.73344649 11.1464466,5.92870864 Z"
                    />
                  </svg>
                  <span
                    className={isValid ? "text-green-600" : "text-gray-600"}
                  >
                    {item?.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="col-span-2">
            <div className="bg-white p-4 mb-[15px] rounded-[5px]">
              <div className="flex gap-x-[15px]">
                <div className="cursor-pointer px-3 py-1 bg-blue-100 rounded">
                  Basic Information
                </div>
                <div className="cursor-pointer px-3 py-1 hover:bg-gray-100 rounded">
                  Sales Information
                </div>
                <div className="cursor-pointer px-3 py-1 hover:bg-gray-100 rounded">
                  Shipping
                </div>
                <div className="cursor-pointer px-3 py-1 hover:bg-gray-100 rounded">
                  Others
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white p-4 rounded-[5px] mb-[15px]">
              <h2 className="font-bold text-[20px] mb-[15px]">
                Basic information
              </h2>
              {/* Product Images */}
              <div className="mb-6">
                <h3 className="text-[14px] mb-2">Product Images</h3>
                <label className="text-[12px] block mb-2">
                  <span className="text-red-500">*</span> 1:1 Image (Max 10
                  images, 5MB each)
                </label>

                <div className="relative mb-4">
                  <label
                    htmlFor="product-images"
                    className={`cursor-pointer w-full flex justify-center items-center flex-col py-[15px] min-h-[50px] rounded-[5px] border-2 border-dashed transition-colors ${
                      errors.productImages
                        ? "border-red-300 bg-red-50"
                        : uploading
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                      </svg>
                    )}
                    <div className="flex gap-x-[5px] mt-2">
                      {uploading ? (
                        "Uploading..."
                      ) : (
                        <>
                          Drag and Drop or{" "}
                          <span className="text-blue-600 underline">
                            Browse
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                  <input
                    id="product-images"
                    name="product-images"
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="absolute cursor-pointer top-0 left-0 w-full h-full opacity-0"
                    onChange={(e) => imageUpload(e, "productImages")}
                    disabled={uploading}
                  />
                </div>

                {errors.productImages && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.productImages}
                  </p>
                )}

                {/* Display uploaded images with drag-and-drop rearrangement */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">
                      Drag images to reorder them
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedImages.map((image, index) => {
                        const isDragging = draggedIndex === index;
                        const isDropTarget =
                          dragOverIndex === index && !isDragging;

                        return (
                          <div
                            key={`${image.url}-${index}`}
                            className="relative"
                          >
                            {/* Drop placeholder */}
                            {isDropTarget && (
                              <div className="absolute inset-0 z-10 border-2 border-dashed border-blue-400 bg-blue-50 rounded flex items-center justify-center animate-pulse">
                                <div className="text-blue-500 text-xs font-medium">
                                  Drop here
                                </div>
                              </div>
                            )}

                            {/* Image container */}
                            <div
                              className={`relative group cursor-move transition-all duration-200 ${
                                isDragging
                                  ? "opacity-50 scale-95 rotate-2 z-20"
                                  : ""
                              } ${isDropTarget ? "opacity-30" : ""}`}
                              draggable={!uploading}
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={handleDragOver}
                              onDragEnter={(e) => handleDragEnter(e, index)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_DOMAIN}${image.url}`}
                                alt={`Product ${index + 1}`}
                                className="w-full aspect-square object-cover rounded border"
                                draggable={false} // Prevent image drag
                              />

                              {/* Drag handle indicator */}
                              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white rounded px-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                ⋮⋮
                              </div>

                              {/* Image order number */}
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium pointer-events-none">
                                {index + 1}
                              </div>

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-30"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <FormField
                name="productName"
                label="Product Name"
                type="text"
                value={payload.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
                required
                error={errors.productName}
                placeholder="Enter product name (10-200 characters)"
              />
              {/* Product Description */}
              <FormField
                name="productDescription"
                label="Product Description"
                type="textarea"
                value={payload.productDescription}
                onChange={(e) =>
                  handleInputChange("productDescription", e.target.value)
                }
                error={errors.productDescription}
              />
            </div>

            {/* Sales Information */}
            <div className="bg-white p-4 rounded-[5px] mb-[15px]">
              <h2 className="font-bold text-[20px] mb-4">Sales Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Price
                  </label>
                  <input
                    type="number"
                    value={payload.productPrice}
                    onChange={(e) =>
                      handleInputChange("productPrice", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.productPrice
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="999999"
                    required
                  />
                  {errors.productPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={payload.productStock}
                    onChange={(e) =>
                      handleInputChange("productStock", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.productStock
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="0"
                    min="0"
                    max="999999"
                  />
                  {errors.productStock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productStock}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-4 rounded-[5px] mb-[15px]">
              <h2 className="font-bold text-[20px] mb-4">Shipping</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Method
                  </label>
                  <select
                    value={payload.productShipping.shippingMethod}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "productShipping",
                        "shippingMethod",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select method</option>
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="overnight">Overnight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Cost
                  </label>
                  <input
                    type="number"
                    value={payload.productShipping.shippingCost}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "productShipping",
                        "shippingCost",
                        e.target.value
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.shippingCost
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="9999"
                  />
                  {errors.shippingCost && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingCost}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Others */}
            <div className="bg-white p-4 rounded-[5px] mb-[15px]">
              <h2 className="font-bold text-[20px] mb-4">Others</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <input
                    type="text"
                    value={payload.productSKU}
                    onChange={(e) =>
                      handleInputChange("productSKU", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.productSKU
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Enter SKU (optional)"
                    maxLength={50}
                  />
                  {errors.productSKU && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productSKU}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={payload.productBrand}
                    onChange={(e) =>
                      handleInputChange("productBrand", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.productBrand
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Enter brand (optional)"
                    maxLength={100}
                  />
                  {errors.productBrand && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productBrand}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-white p-4 rounded-[5px]">
            <div className="sticky top-[120px]">
              <h3 className="font-bold mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 ${
                    isSubmitting || Object.keys(errors).length > 0
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Product"
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 ${
                    isSubmitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
                  }`}
                >
                  Save as Draft
                </button>
              </div>

              {/* Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form Progress */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Form Progress
                </h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Images:</span>
                    <span
                      className={
                        uploadedImages.length > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {uploadedImages.length}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required fields:</span>
                    <span
                      className={
                        payload.productName &&
                        payload.productDescription &&
                        payload.productPrice &&
                        uploadedImages.length > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {
                        [
                          payload.productName,
                          payload.productDescription,
                          payload.productPrice,
                          uploadedImages.length > 0,
                        ].filter(Boolean).length
                      }
                      /4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </SellerLayout>
  );
}
