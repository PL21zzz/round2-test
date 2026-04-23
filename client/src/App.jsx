import { useState } from "react";
import AuthorCreate from "./components/AuthorCreate";
import AuthorList from "./components/AuthorList";
import BookCreate from "./components/BookCreate";
import BookList from "./components/BookList";
import ReviewCreate from "./components/ReviewCreate";
import ReviewList from "./components/ReviewList";

function App() {
  const [activeTab, setActiveTab] = useState("authors");
  const [refresh, setRefresh] = useState(Date.now());

  const tabs = [
    { id: "authors", label: "Authors" },
    { id: "books", label: "Books" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Book Review System
      </h1>

      {/* --- Tab Buttons --- */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      <div className="min-h-100">
        {activeTab === "authors" && (
          <>
            <AuthorCreate onCreated={() => setRefresh(Date.now())} />
            <AuthorList
              refresh={refresh}
              onUpdated={() => setRefresh(Date.now())}
            />
          </>
        )}
        {activeTab === "books" && (
          <>
            <BookCreate onCreated={() => setRefresh(Date.now())} />
            <BookList
              refresh={refresh}
              onUpdated={() => setRefresh(Date.now())}
            />
          </>
        )}
        {activeTab === "reviews" && (
          <>
            <ReviewCreate onCreated={() => setRefresh(Date.now())} />
            <ReviewList
              refresh={refresh}
              onUpdated={() => setRefresh(Date.now())}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
