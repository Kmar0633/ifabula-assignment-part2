import { HashRouter, Route, Routes } from "react-router-dom";

import { Login,Home,Register } from "./pages";

function App() {
  return (
    <HashRouter>
      <Routes>
      <Route path="/signup" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />


      
      </Routes>
    </HashRouter>
  );
}

export default App;
