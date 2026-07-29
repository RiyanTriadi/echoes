import { useState } from "react";
import { MainLayout } from "./components/MainLayout";
import { Editor } from "./components/Editor";

function App() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-16 px-8 flex flex-col h-full relative">
        <div className="mb-8">
          <p className="text-zinc-500 font-sans text-sm tracking-widest uppercase mb-2">
            {handleDate()}
          </p>
          <input
            type="text"
            placeholder="Title your entry..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-serif text-zinc-100 placeholder-zinc-700 outline-none border-none mb-4"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pb-32">
           <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
