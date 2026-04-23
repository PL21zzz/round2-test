import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteBook, getAuthors, getBooks, updateBook } from "../services/api";
import Modal from "./Modal";

const BookList = ({ refresh, onUpdated }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]); // Để hiện tên tác giả
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 5;

  useEffect(() => {
    // Lấy danh sách sách và danh sách tác giả (để map tên)
    const fetchData = async () => {
      const skip = (page - 1) * LIMIT;
      const resBooks = await getBooks(skip, LIMIT); // Đảm bảo hàm này nhận tham số
      const resAuthors = await getAuthors(); // Lấy all authors để map tên

      setBooks(resBooks.data.data || []);
      setTotal(resBooks.data.total || 0);
      setAuthors(resAuthors.data.data || []); // Dùng cho dropdown
    };
    fetchData();
  }, [refresh, page]);

  const handleUpdate = async () => {
    try {
      await updateBook(editModal.data.id, {
        title: editModal.data.title,
        author_id: editModal.data.author_id,
      });
      setEditModal({ isOpen: false, data: null });
      onUpdated(); // Trigger reload list
    } catch (err) {
      console.error("Lỗi update:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      onUpdated(); // Trigger reload list
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title="Edit Book"
      >
        {/* Input Title */}
        <input
          value={editModal.data?.title || ""}
          onChange={(e) =>
            setEditModal({
              ...editModal,
              data: { ...editModal.data, title: e.target.value },
            })
          }
          className="w-full border p-2 mb-4 rounded"
        />

        {/* Select Author (Dropdown) */}
        <select
          value={editModal.data?.author_id || ""}
          onChange={(e) =>
            setEditModal({
              ...editModal,
              data: { ...editModal.data, author_id: Number(e.target.value) },
            })
          }
          className="w-full border p-2 mb-4 rounded"
        >
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </Modal>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title="Delete Book"
      >
        <p>Are you sure you want to delete this book?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setDeleteModal({ isOpen: false, id: null })}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>
      <h1 className="text-2xl font-bold mb-6">Books List</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            {/* 1. THÊM CỘT NO Ở ĐÂY */}
            <th className="p-3 w-16 text-center">No.</th>
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* 2. THÊM INDEX VÀO MAP */}
          {books?.map((book, index) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                {(page - 1) * LIMIT + index + 1}
              </td>
              <td className="p-3">{book.title}</td>

              <td className="p-3">
                {authors.find((a) => a.id === book.author_id)?.name ||
                  "Chưa xác định"}
              </td>

              <td className="p-3">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setEditModal({ isOpen: true, data: book })}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({ isOpen: true, id: book.id })
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ĐỪNG QUÊN PHẦN PAGINATION NHƯ BÊN AUTHOR ĐỂ ĐỒNG BỘ NHÉ */}
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

export default BookList;
