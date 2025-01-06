import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LikedBlogs from "../components/blogs/pages/blog-liked-page";
import SavedBlogs from "../components/blogs/pages/blog-saved-page";
import BlogTestPage from "../components/blogs/pages/blog-test-page";
import MobileNavigation from "../components/ui/mobile-navigation";
import BlogDetailPage from "@/components/blogs/pages/searched-blog-page";
import { Toaster } from "@/components/ui/toaster";
import { LoaderIcon } from "lucide-react";
import BlogLayout from "@/components/blogs/pages/blog-layout";
import BlogPage from "../components/blogs/pages/blog-main-page";
import BlogCreatePage from "@/components/blogs/pages/blog-create-page";
import BlogFromUpdatePage from "@/components/blogs/pages/show-blog-update-page";
import Auth from "@/components/auth/pages/auth-page";
import HeroPage from "@/components/app/hero-page";
import UserProfilePage from "@/components/member/user/pages/user-profile-page";
import AuthorProfilePage from "@/components/member/author/pages/author-profile-page";

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
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes (only accessible when authenticated) */}
        {isAuthenticated && (
          <>
            <Route index path="/" element={<HeroPage />} />
            <Route path="/blogs/create" element={<BlogCreatePage />} />
            <Route
              path="/blog-update/:blogId"
              element={<BlogFromUpdatePage />}
            />
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
            <Route
              path="/member/user/user-profile"
              element={<UserProfilePage />}
            />
            <Route
              path="author-profile/:authorId"
              element={<AuthorProfilePage />}
            />
          </>
        )}
      </Routes>

      {/* Conditional rendering for debugging or loading state */}
      {isLoading && (
        <div className=" h-full min-h-screen w-screen flex justify-center items-center">
          <LoaderIcon className="animate-spin size-20" />
        </div>
      )}

      {isAuthenticated && <MobileNavigation />}
      <Toaster />
    </div>
  );
};

export default App;
