"use client";
import { useState } from "react";
import { FaSun, FaMoon, FaUndo, FaRedo } from "react-icons/fa";
import { History } from "@/types";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [find, setFind] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // History stack for undo and redo
  const [history, setHistory] = useState<History[]>([{ text: "" }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  // Toggle theme between dark and light mode
  const toggleTheme = (): void => {
    document.body.classList.toggle("dark", !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  // Handle text changes and manage the history
  const handleTextChange = (newText: string): void => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, { text: newText }]);
    setHistoryIndex(newHistory.length);
    setText(newText);
  };

  // Replace function that replaces the 'find' string with 'replace' string
  const handleReplace = (): void => {
    if (find.trim()) {
      const regex = new RegExp(find, "gi");
      const updatedText = text.replace(regex, replace);
      handleTextChange(updatedText);
      setFind("");
      setReplace("");
    }
  };

  // Undo function
  const undo = (): void => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setText(history[historyIndex - 1].text);
    }
  };

  // Redo function
  const redo = (): void => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setText(history[historyIndex + 1].text);
    }
  };

  return (
    <>
      {/* Sticky Header with theme toggle */}
      <div className="header">
        <h1 className="title">Find and Replace Tool</h1>
        <div onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="container">
          <div className="inputContainer">
            {/* Draggable and Resizable Textarea */}
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type or paste text here..."
              rows={10}
              className="textarea"
              style={{
                resize: "both",
                overflow: "auto",
              }}
            />
          </div>

          <div className="controls">
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Find text"
            />
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replace with"
            />
            <button onClick={handleReplace}>Replace All</button>

            {/* Undo/Redo icons */}
            <button onClick={undo} disabled={historyIndex === 0}>
              <FaUndo />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
