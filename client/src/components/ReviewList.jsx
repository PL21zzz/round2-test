import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteReview,
  getBooks,
  getReviews,
  updateReview,
} from "../services/api";
import Modal from "./Modal";

const ReviewList = ({ refresh, onUpdated }) => {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 5;

  useEffect(() => {
    const fetchData = async () => {
      const skip = (page - 1) * LIMIT;
      const resReviews = await getReviews(skip, LIMIT);
      const resBooks = await getBooks(0, 1000);
      setReviews(resReviews.data.data || []);
      setTotal(resReviews.data.total || 0);
      setBooks(resBooks.data.data || []);
    };
    fetchData();
  }, [refresh, page]);

  const handleUpdate = async () => {
    await updateReview(editModal.data.id, {
      content: editModal.data.content,
      book_id: editModal.data.book_id,
    });
    setEditModal({ isOpen: false, data: null });
    onUpdated();
  };

  const handleDelete = async () => {
    await deleteReview(deleteModal.id);
    setDeleteModal({ isOpen: false, id: null });
    onUpdated();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      {/* Modal Edit */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title="Edit Review"
      >
        <textarea
          value={editModal.data?.content || ""}
          onChange={(e) =>
            setEditModal({
              ...editModal,
              data: { ...editModal.data, content: e.target.value },
            })
          }
          className="w-full border p-2 mb-4 rounded"
          rows="3"
        />
        <select
          value={editModal.data?.book_id || ""}
          onChange={(e) =>
            setEditModal({
              ...editModal,
              data: { ...editModal.data, book_id: Number(e.target.value) },
            })
          }
          className="w-full border p-2 mb-4 rounded bg-gray-100 cursor-not-allowed" // Thêm style để trông như bị khóa
          disabled
        >
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </Modal>

      {/* Modal Delete */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title="Delete Review"
      >
        <p>Are you sure?</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
        >
          Confirm
        </button>
      </Modal>

      <h1 className="text-2xl font-bold mb-6">Reviews List</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 w-16 text-center">No.</th>
            <th className="p-3">Content</th>
            <th className="p-3">Book</th>
            <th className="p-3">Author</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews?.map((r, index) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                {(page - 1) * LIMIT + index + 1}
              </td>
              <td className="p-3 italic">"{r.content}"</td>
              <td className="p-3">{r.book_title}</td>
              <td className="p-3 font-semibold text-gray-700">
                {r.author_name}
              </td>
              <td className="p-3">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setEditModal({ isOpen: true, data: r })}
                  >
                    <Pencil size={18} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: r.id })}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / LIMIT) || 1}
        </span>
        <button
          disabled={page * LIMIT >= total}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
