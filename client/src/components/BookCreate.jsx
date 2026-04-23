import { useEffect, useState } from "react";
import { createBook, getAuthors } from "../services/api";

const BookCreate = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // Lấy toàn bộ tác giả để làm dropdown
    getAuthors(0, 1000).then((res) => setAuthors(res.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("* Please enter title");
      return;
    }
    try {
      await createBook({ title, author_id: Number(authorId) });
      setTitle("");
      setAuthorId("");
      onCreated();
    } catch (err) {
      alert("Lỗi khi tạo sách!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-6 rounded-xl mb-8 flex gap-4 items-end"
    >
      <div className="flex-1">
        <label className="block text-sm font-bold mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-bold mb-1">Author</label>
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-bold"
      >
        Add Book
      </button>
    </form>
  );
};

export default BookCreate;
