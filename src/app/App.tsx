import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HeroPage from "./_pages/home/page";
import BlogLayout from "@/components/blogs/components/blog-layout";
import BlogPage from "./_pages/blogs/blog-main-page";
import LikedBlogs from "./_pages/blogs/blog-liked-page";
import SavedBlogs from "./_pages/blogs/blog-saved-page";
import AuthMainPage from "./_pages/auth/auth-main-page";
import BlogTestPage from "./_pages/blogs/blog-test-page";
import BlogDetailPage from "@/components/blogs/components/blog-details-page";

import { Toaster } from "@/components/ui/toaster";
import { LoaderIcon } from "lucide-react";
import ProfileLayout from "@/components/_userProfile/components/profile-layout";
import FloatingNavBar from "./_pages/home/floating-nav-bar";
import AdminPage from "./_pages/admin/page";
import AuthorProfile from "./_pages/authors/page";

const App = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && pathname === "/auth") {
        // Redirect authenticated users away from the auth page to the home page
        navigate("/");
      } else if (!isAuthenticated && pathname !== "/auth") {
        // Redirect unauthenticated users to the auth page, except when already on /auth
        navigate("/auth");
      }
    }
  }, [isAuthenticated, isLoading, pathname, navigate]);

  return (
    <div>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthMainPage />} />

        {/* Protected Routes (only accessible when authenticated) */}
        {isAuthenticated && (
          <>
            <Route index path="/" element={<HeroPage />} />
            <Route path="/blogs" element={<BlogLayout />}>
              <Route
                index
                path="/blogs"
                element={
                  <BlogPage showRemoveButton={false} showUpdateButton={false} />
                }
              />
              <Route path="saved" element={<SavedBlogs />} />
              <Route path="liked" element={<LikedBlogs />} />
              <Route path="test" element={<BlogTestPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
            </Route>
            <Route path="/user-profile" element={<ProfileLayout />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
          </>
        )}
      </Routes>

      {/* Conditional rendering for debugging or loading state */}
      {isLoading && (
        <div className=" h-full min-h-screen w-screen flex justify-center items-center">
          <LoaderIcon className="animate-spin size-20" />
        </div>
      )}

      {isAuthenticated && <FloatingNavBar />}
      <Toaster />
    </div>
  );
};

export default App;
