import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./view/login/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;