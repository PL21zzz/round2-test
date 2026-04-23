import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteAuthor, updateAuthor } from "../services/api";
import Modal from "./Modal";

const AuthorList = ({ refresh, onUpdated }) => {
  const [authors, setAuthors] = useState([]); // Khởi tạo là mảng rỗng để không bị lỗi map
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 4;

  useEffect(() => {
    const fetchData = async () => {
      const skip = (page - 1) * LIMIT;
      const res = await axios.get(
        `http://localhost:8000/authors?skip=${skip}&limit=${LIMIT}`,
      );

      setAuthors(res.data.data || []);
      setTotal(res.data.total || 0);
    };
    fetchData();
  }, [refresh, page]); // Chỉ chạy lại khi refresh hoặc đổi trang

  const handleUpdate = async () => {
    await updateAuthor(editModal.data.id, { name: editModal.data.name });
    setEditModal({ isOpen: false, data: null });
    onUpdated();
  };

  const handleDelete = async () => {
    try {
      await deleteAuthor(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      onUpdated();
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title="Edit Author"
      >
        <input
          value={editModal.data?.name || ""}
          onChange={(e) =>
            setEditModal({
              ...editModal,
              data: { ...editModal.data, name: e.target.value },
            })
          }
          className="w-full border p-2 mb-4"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title="Delete Confirmation"
      >
        <p>Are you sure?</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
        >
          Confirm
        </button>
      </Modal>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Authors List</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left border-b">
            <th className="p-3 w-16 text-center">No</th>
            <th className="p-3">Name</th>
            <th className="p-3 w-24 text-center">Books</th>
            <th className="p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* SỬA LỖI: Dùng authors?.map để an toàn tuyệt đối */}
          {authors?.map((author, index) => (
            <tr key={author.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                {(page - 1) * LIMIT + index + 1}
              </td>
              <td className="p-3">{author.name}</td>
              <td className="p-3 text-center">{author.books || 0}</td>
              <td className="p-3">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setEditModal({ isOpen: true, data: author })}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({ isOpen: true, id: author.id })
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

      {/* Pagination UI */}
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

export default AuthorList;
