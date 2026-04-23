import { useEffect, useState } from "react";
import { createReview, getBooks } from "../services/api";

const ReviewCreate = ({ onCreated }) => {
  const [content, setContent] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState([]);

  // Lấy danh sách sách để đổ vào dropdown
  useEffect(() => {
    getBooks(0, 1000).then((res) => setBooks(res.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookId) {
      alert("Vui lòng chọn sách!");
      return;
    }
    try {
      await createReview({ content, book_id: Number(bookId) });
      setContent("");
      setBookId("");
      onCreated(); // Gọi để reload lại list
    } catch (err) {
      console.error("Lỗi tạo review:", err);
      alert("Có lỗi xảy ra khi tạo review!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-6 rounded-xl mb-8 flex gap-4 items-end"
    >
      <div className="flex-1">
        <label className="block text-sm font-bold mb-1">Review Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows="2"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-bold mb-1">Book</label>
        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select a Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-bold"
      >
        Add Review
      </button>
    </form>
  );
};

export default ReviewCreate;
