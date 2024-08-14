import { Link } from "react-router-dom";

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <img src="src\assets\react.svg" alt="Logo" className="h-8 w-auto" />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-blue-600 hover:text-blue-800">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-blue-600 hover:text-blue-800"
              >
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-blue-600 hover:text-blue-800">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Nav;
