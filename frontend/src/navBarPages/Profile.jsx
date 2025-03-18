import { useState } from "react";
import CharacteristicsForm from "../components/CharacteristicsForm";
import LogoutButton from "./LogoutButton";
const Profile = () => {
  const [setError] = useState(null);
  return (
    <>
      <CharacteristicsForm />
      <LogoutButton setError={setError} />
    </>
  );
};

export default Profile;
