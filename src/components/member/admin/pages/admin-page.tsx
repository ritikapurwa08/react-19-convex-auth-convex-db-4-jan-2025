import BlogPage from "../../../blogs/pages/blog-main-page";
import UsersPage from "../user-table/users-page";
import { PasskeyModal } from "../password-modal/passkey-modal";

const AdminPage = () => {
  return (
    <div>
      <PasskeyModal />
      <main>
        <UsersPage />
        <BlogPage showRemoveButton={true} showUpdateButton={true} />
      </main>
    </div>
  );
};

export default AdminPage;
