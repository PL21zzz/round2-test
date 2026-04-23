// App.jsx
import { useState } from "react";
import AuthorCreate from "./components/AuthorCreate";
import AuthorList from "./components/AuthorList";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Book Review System</h1>
      <AuthorCreate onCreated={() => setRefresh(!refresh)} />
      <AuthorList refresh={refresh} onUpdated={() => setRefresh(Date.now())} />
    </div>
  );
}

export default App;
