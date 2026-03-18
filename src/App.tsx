import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../src/components/Layout";
import Dashboard from "../src/pages/Dashboard";
import Schools from "../src/pages/School";
import Users from "../src/pages/Users";
import Messaging from "../src/pages/Messaging";
import Settings from "../src/pages/Setting";
import Report from "../src/pages/Report"
import ContentModeration from "../src/pages/ContentModeration"
import Paying from "../src/pages/Paying"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Report />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/moderation" element={<ContentModeration/>} />
          <Route path="/users" element={<Users />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payments" element={<Paying/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;