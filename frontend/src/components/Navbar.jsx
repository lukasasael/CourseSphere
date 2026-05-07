import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold tracking-wider">
          CourseSphere
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-indigo-200 transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
