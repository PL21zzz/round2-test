import axios from "axios";
import { useEffect, useState } from "react";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // Fetch dữ liệu từ API FastAPI
    axios
      .get("http://localhost:8000/authors")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Authors List</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">No</th>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, index) => (
            <tr key={author.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{author.name}</td>
              <td className="p-3 border-b flex gap-2">
                <button className="text-blue-500 hover:underline">
                  Update
                </button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorList;
