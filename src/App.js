import React, { useState, useEffect } from "react";

const ramenShops = [
  { name: { zh: "一蘭拉麵", en: "Ichiran Ramen" }, address: { zh: "台北市110台北市信義區松仁路97號", en: "97 Songren Rd, Xinyi District, Taipei" } },
  { name: { zh: "一風堂拉麵", en: "Ippudo Ramen" }, address: { zh: "台北市中山區中山北路一段85號", en: "85 Zhongshan North Rd, Zhongshan District, Taipei" } },
  { name: { zh: "武藏拉麵", en: "Musashi Ramen" }, address: { zh: "台北市中正區忠孝西路一段36號B1", en: "B1, No. 36, Sec. 1, Zhongxiao W Rd, Zhongzheng District, Taipei" } },
  { name: { zh: "拉麵凪", en: "Ramen Nagi" }, address: { zh: "台北市大安區大安路一段75巷5號", en: "No. 5, Lane 75, Sec. 1, Da'an Rd, Da'an District, Taipei" } },
  { name: { zh: "山頭火拉麵", en: "Santouka Ramen" }, address: { zh: "台北市大同區承德路一段1號B3", en: "B3, No. 1, Sec. 1, Chengde Rd, Datong District, Taipei" } },
];

const translations = {
  zh: {
    title: "拉麵搜尋器",
    selectLabel: "選擇一家拉麵店：",
    selectPlaceholder: "請選擇",
    infoTitle: "拉麵店資訊：",
    todoTitle: "待辦事項",
    addTodoPlaceholder: "新增待辦事項...",
    addButton: "新增",
    jokeTitle: "笑話生成",
    jokeButton: "生成笑話",
  },
  en: {
    title: "Ramen Shop Finder",
    selectLabel: "Select a ramen shop:",
    selectPlaceholder: "Please select",
    infoTitle: "Ramen Shop Info:",
    todoTitle: "To-Do List",
    addTodoPlaceholder: "Add a new task...",
    addButton: "Add",
    jokeTitle: "Joke Generator",
    jokeButton: "Generate Joke",
  },
};

function App() {
  const [selectedShop, setSelectedShop] = useState(null);
  const [language, setLanguage] = useState("zh");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [joke, setJoke] = useState(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    const savedShopName = localStorage.getItem("selectedShopName");
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    if (savedShopName) {
      const savedShop = ramenShops.find(
        (shop) => shop.name[language] === savedShopName
      );
      if (savedShop) setSelectedShop(savedShop);
    }

    setTodos(savedTodos);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
    }

    if (selectedShop) {
      localStorage.setItem("selectedShopName", selectedShop.name[language]);
    }

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [language, selectedShop, todos]);

  const handleSelectChange = (e) => {
    const selectedName = e.target.value;
    const shop = ramenShops.find((shop) => shop.name[language] === selectedName);
    setSelectedShop(shop);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setSelectedShop(null); // Reset selected shop when language changes
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://official-joke-api.appspot.com/jokes/random");
      const data = await response.json();
      setJoke(data);
    } catch (error) {
      setJoke({ setup: "Oops!", punchline: "Failed to fetch a joke." });
    }
  };

  const t = translations[language];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1>{t.title}</h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="language-select" style={{ fontSize: "16px", marginRight: "10px" }}>
          Language / 語言：
        </label>
        <select
          id="language-select"
          onChange={handleLanguageChange}
          style={{ padding: "10px", fontSize: "16px" }}
          value={language}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <label htmlFor="ramen-select" style={{ fontSize: "16px", marginRight: "10px" }}>
        {t.selectLabel}
      </label>
      <select
        id="ramen-select"
        onChange={handleSelectChange}
        style={{ padding: "10px", fontSize: "16px" }}
        value={selectedShop ? selectedShop.name[language] : ""}
      >
        <option value="" disabled>
          {t.selectPlaceholder}
        </option>
        {ramenShops.map((shop, index) => (
          <option key={index} value={shop.name[language]}>
            {shop.name[language]}
          </option>
        ))}
      </select>

      {selectedShop && (
        <div style={{ marginTop: "20px" }}>
          <h2>{t.infoTitle}</h2>
          <div
            style={{
              background: "#f8f8f8",
              padding: "10px",
              margin: "10px auto",
              width: "400px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong>{selectedShop.name[language]}</strong>
            <p>{selectedShop.address[language]}</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2>{t.todoTitle}</h2>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder={t.addTodoPlaceholder}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", width: "300px" }}
          />
          <button
            onClick={handleAddTodo}
            style={{ padding: "10px 20px", fontSize: "16px", marginLeft: "10px" }}
          >
            {t.addButton}
          </button>
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {todos.map((todo, index) => (
            <li
              key={index}
              style={{
                background: "#f8f8f8",
                padding: "10px",
                margin: "5px auto",
                width: "400px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {todo}
              <button
                onClick={() => handleDeleteTodo(index)}
                style={{ background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "4px", padding: "5px 10px" }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>{t.jokeTitle}</h2>
        <button
          onClick={fetchJoke}
          style={{ padding: "10px 20px", fontSize: "16px", background: "#4caf50", color: "white", border: "none", borderRadius: "4px" }}
        >
          {t.jokeButton}
        </button>
        {joke && (
          <div
            style={{
              background: "#f8f8f8",
              padding: "10px",
              margin: "20px auto",
              width: "400px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p><strong>{joke.setup}</strong></p>
            <p>{joke.punchline}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;











