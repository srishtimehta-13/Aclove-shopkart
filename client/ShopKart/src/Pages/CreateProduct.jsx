import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "10",
    imageUrl: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const previewUrls = useRef(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const availableSlots = Math.max(0, 5 - images.length);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];
    const acceptedFiles = selectedFiles
      .filter((file) => allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024)
      .slice(0, availableSlots);

    if (selectedFiles.some((file) => !allowedTypes.includes(file.type))) {
      setError("Choose JPEG, PNG, WebP, AVIF, or GIF images.");
    } else if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each image must be 5 MB or smaller.");
    } else if (acceptedFiles.length < selectedFiles.length) {
      setError("You can upload a maximum of five images.");
    } else {
      setError("");
    }

    const newPreviews = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.add(url);
      return url;
    });
    setImages((prev) => [...prev, ...acceptedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const previewToRemove = previews[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
      previewUrls.current.delete(previewToRemove);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!form.imageUrl.trim() && images.length === 0) {
      setError("Please provide an image URL or upload at least one image.");
      setLoading(false);
      return;
    }

    try {
      // If only imageUrl is provided (no files), send JSON body
      if (images.length === 0 && form.imageUrl) {
        const response = await axiosInstance.post("/products", {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          image: form.imageUrl.trim(),
        });
        setMessage(response.data?.message || "Product created successfully! 🎉");
        setTimeout(() => {
          navigate("/products");
        }, 1200);
      } else {
        // If files are provided, send FormData
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("stock", form.stock);
        if (form.imageUrl) {
          formData.append("image", form.imageUrl.trim());
        }

        for (const img of images) {
          formData.append("images", img);
        }

        const response = await axiosInstance.post("/products", formData);
        setMessage(response.data?.message || "Product created successfully! 🎉");
        setTimeout(() => {
          navigate("/products");
        }, 1200);
      }
    } catch (err) {
      console.error("Create product failed:", err);
      setError(
        err.response?.data?.message || "Failed to create product. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1 mb-2"
          >
            ← Back to Products
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New Product
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to add a new piece to the Alcove collection.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Mechanical Keyboard"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="3"
                placeholder="Detailed description of features, materials, and specifications..."
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid: Price, Stock, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    placeholder="2999"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Stock Units *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  placeholder="10"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Books">Books</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>

            </div>

            {/* Image URL Option */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Product Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/... or https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Paste an image link or upload up to five JPEG, PNG, WebP, AVIF, or GIF images (5 MB each).
              </p>
            </div>

            {/* File Upload Option */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Or Upload Image File(s)
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={handleImageChange}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Previews */}
              {previews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Messages */}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition duration-200 disabled:opacity-60 text-sm"
            >
              {loading ? "Adding Product..." : "Create Product"}
            </button>

          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default CreateProduct;
