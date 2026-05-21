import axios from "axios";

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export default fetchProducts;
