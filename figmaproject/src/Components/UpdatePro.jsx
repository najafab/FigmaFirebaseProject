import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "./Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./UpdatePro.css";

const UpdatePro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    desc: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null); // error state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const data = productDoc.data();
          setProduct(data);
          setImagePreview(data.image || ""); // Show existing image if available
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Error fetching product data.");
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = { ...product };

      // Upload new image if available
      if (newImage) {
        const imageRef = ref(storage, `products/${id}/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        updatedData.image = imageUrl;
      }

      // Update the product in Firestore
      await updateDoc(doc(db, "products", id), updatedData);
      navigate("/products"); // Navigate back to the products list after updating
    } catch (err) {
      setError("Error updating product.");
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="update-product">
      <h2>Update Product</h2>
      <div className="update-product-box">
        {imagePreview && (
          <img src={imagePreview} alt="Product" className="product-image" />
        )}
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={product.desc}
          onChange={(e) => setProduct({ ...product, desc: e.target.value })}
        />
        <input type="file" onChange={handleImageChange} />
        <button
          className="update-button"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
        <button
          className="go-back-button"
          onClick={() => navigate("/products")}
        >
          Go Back
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default UpdatePro;
