import { useParams } from "react-router-dom";
import BlogUpdatePage from "./blog-update-page";
import { Id } from "@convex/_generated/dataModel";

const BlogFromUpdatePage = () => {
  // Use the useParams hook to extract the blogId from the URL
  const { blogId } = useParams<{ blogId: Id<"blogs"> }>();

  // If blogId is not present, handle it accordingly
  if (!blogId) {
    return <div>Error: Blog ID is missing in the URL.</div>;
  }

  return (
    <div>
      {/* Pass the blogId to the BlogUpdatePage component */}
      <BlogUpdatePage blogId={blogId} />
    </div>
  );
};

export default BlogFromUpdatePage;
