import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, storage } from "./Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Products.css";

const Products = () => {
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const productCollectionRef = collection(db, "products");
  const navigate = useNavigate();

  const productImages = {
    "Chicken Delight Pizza":
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUArIdJdFxRCC09u0zNT2ZIClxbT-ZiFS1Q&s",
    "Bagel Pizza":
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtdbcN_48HYHYDYdttsEj8TeJxXJ0kapCBsg&s",
    "Greek Pizza": "https://path-to-greek-pizza-image.jpg",
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (newProductName && productImages[newProductName]) {
      setNewProductImageUrl(productImages[newProductName]);
      setNewProductImage(null);
    } else {
      setNewProductImageUrl(
        "https://static.vecteezy.com/system/resources/thumbnails/022/149/342/small_2x/hot-italian-pizza-cutout-png.png"
      );
    }
  }, [newProductName]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProductImage(file);
      setNewProductImageUrl(URL.createObjectURL(file));
    }
  };

  const addProduct = async () => {
    if (!newProductName || !newProductPrice || !newProductDesc) {
      alert("Please fill out all fields before adding the product.");
      return;
    }

    let imageUrl = newProductImageUrl;

    try {
      if (newProductImage && !productImages[newProductName]) {
        const imageRef = ref(storage, `products/${newProductImage.name}`);
        await uploadBytes(imageRef, newProductImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newProduct = {
        name: newProductName,
        price: newProductPrice,
        desc: newProductDesc,
        imageUrl,
      };

      const newProductRef = await addDoc(productCollectionRef, newProduct);
      setProducts((prevProducts) => [
        ...prevProducts,
        { ...newProduct, id: newProductRef.id },
      ]);

      setNewProductName("");
      setNewProductPrice("");
      setNewProductDesc("");
      setNewProductImage(null);
      setNewProductImageUrl("");
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("There was an error adding the product. Please try again.");
    }
  };

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="container">
      <div className="navbar">
        <h2>Admin Panel</h2>
        <ul className="menu">
          <li>Products</li>
          <li>Menu</li>
          <li>Orders</li>
        </ul>
        <FaUser className="user-icon" />
      </div>

      <div className="hero-section">
        <h1>Add Product</h1>
        <div className="box">
          <input
            type="text"
            placeholder="Enter product name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter product price"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter product description"
            value={newProductDesc}
            onChange={(e) => setNewProductDesc(e.target.value)}
          />
          <label className="file-upload-label">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
          {/* <span>
            {newProductImage ? newProductImage.name : "No file chosen"}
          </span> */}
          <button onClick={addProduct}>ADD PRODUCT</button>
        </div>
        <h2 className="head">PRODUCT ADDED</h2>

        <div className="products-section">
          <div className="cards">
            <div className="product-cards">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <h3 className="he3">{product.name}</h3>
                  <p>{product.desc}</p>
                  <div className="product-price">${product.price}</div>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      style={{
                        height: "60px",
                        width: "60px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="product-actions">
                    <button
                      className="update "
                      onClick={() => navigate(`/update/${product.id}`)}
                    >
                      Update{" "}
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
