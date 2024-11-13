import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import "./UpdateProduct.css";

const UpdateProduct = () => {
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

  useEffect(() => {
    const fetchProduct = async () => {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        const data = productDoc.data();
        setProduct(data);
        setImagePreview(data.image || ""); // Set initial image preview if available
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    const updatedData = { ...product };
    if (newImage) {
      // Assume the image is handled (uploaded) here. Placeholder code for now.
      updatedData.image = "uploaded_image_url"; // Replace with actual image URL after upload
    }
    await updateDoc(doc(db, "products", id), updatedData);
    navigate("/products"); // Redirect to products page
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="update-product">
      <h2>UPDATE PRODUCT</h2>
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
        <button className="update-button" onClick={handleUpdate}>
          Update Product
        </button>
        <button
          className="go-back-button"
          onClick={() => navigate("/products")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
