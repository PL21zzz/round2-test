import axios from "axios";
import { useState } from "react";

const AuthorCreate = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("* Please enter name");
      return;
    }

    try {
      await axios.post("http://localhost:8000/author", { name });
      setName("");
      setError("");
      onCreated(); // Gọi lại hàm để reload list
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu dữ liệu!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded shadow-sm bg-gray-50"
    >
      <h2 className="text-lg font-bold mb-3">Add New Author</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Author Name"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default AuthorCreate;
