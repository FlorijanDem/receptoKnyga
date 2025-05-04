import { useState } from "react";
import CharacteristicsForm from "../components/CharacteristicsForm";
import LogoutButton from "./LogoutButton";
import WeightChart from "../components/WeightChart";
const Profile = () => {
  const [setError] = useState(null);
  return (
    <>
      <CharacteristicsForm />
      <LogoutButton setError={setError} />
      <div className="w-full max-w-[800px] h-[400px] mx-auto">
        <WeightChart />
      </div>
    </>
  );
};

export default Profile;
