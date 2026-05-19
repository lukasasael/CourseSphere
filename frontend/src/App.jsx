import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CreateLesson from './pages/CreateLesson';
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
              <Route path="courses" element={<Courses />} />
              <Route path="courses/new" element={<CreateCourse />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              <Route path="courses/:id/edit" element={<EditCourse />} />
              <Route path="courses/:id/lessons/new" element={<CreateLesson />} />

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
