import { HashRouter, Route, Routes } from "react-router-dom";

import { Login } from "./pages";

function App() {
  return (
    <HashRouter>
      <Routes>
      <Route path="/" element={<Login />} />
   

      
      </Routes>
    </HashRouter>
  );
}

export default App;
