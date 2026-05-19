import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import LessonPlans from './pages/LessonPlans';
import LessonPlanForm from './pages/LessonPlanForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>


              <Route path="lesson-plans" element={<LessonPlans />} />
              <Route path="lesson-plans/new" element={<LessonPlanForm />} />
              <Route path="lesson-plans/:id/edit" element={<LessonPlanForm />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
