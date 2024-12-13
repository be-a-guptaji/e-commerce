import NavBar from "../features/navbar/Navbar";
import UserProfile from "../features/user/components/UserProfile";

function UserProfilePage() {
  return (
    <>
      <NavBar>
        <h1 className="mx-4 text-2xl font-bold">My Profile</h1>
        <UserProfile></UserProfile>
      </NavBar>
    </>
  );
}

export default UserProfilePage;