import { useState } from "react";
import { Link } from "react-router-dom";
import { FaComments, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const Header = () => {
  const {
    user,
    logout,
    isAuthenticated,
    loading,
    showLoginModal,
    setShowLoginModal,
  } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition"
            >
              <FaComments className="text-3xl" />
              <div>
                <h1 className="text-2xl font-bold">Learnato Forum</h1>
                <p className="text-sm text-blue-100">
                  Empower learning through conversation
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="hidden md:block hover:text-blue-200 transition font-medium"
              >
                Home
              </Link>

              {loading ? (
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse"></div>
              ) : isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    + New Post
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 hover:opacity-90 transition"
                    >
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-10 h-10 rounded-full border-2 border-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center">
                          <FaUser />
                        </div>
                      )}
                      <span className="hidden md:block font-medium">
                        {user?.displayName || "User"}
                      </span>
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-200">
                            <p className="font-semibold text-gray-800">
                              {user?.displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;
