import BlogPage from "../blogs/blog-main-page";
import UsersPage from "./components/users-page";
import { PasskeyModal } from "./passkey-modal";

const AdminPage = () => {
  return (
    <div>
      <PasskeyModal />
      <main>
        <UsersPage />
        <BlogPage showRemoveButton={true} showUpdateButton={false} />
      </main>
    </div>
  );
};

export default AdminPage;
