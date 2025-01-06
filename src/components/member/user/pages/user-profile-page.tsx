import { UseGetCurrentUserQueryHook } from "@/hooks/member/user/user-query-hooks";
import UserProfileCard from "../ui/user-profile-card";

const UserProfilePage = () => {
  const { user } = UseGetCurrentUserQueryHook();
  if (!user) {
    return <div>Not found </div>;
  }

  if (!user) {
    return (
      <div>
        <h1>Loding...</h1>
      </div>
    );
  }

  return (
    <div>
      <UserProfileCard {...user} />
    </div>
  );
};

export default UserProfilePage;
