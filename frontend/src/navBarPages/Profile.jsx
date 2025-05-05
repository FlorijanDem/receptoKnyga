import { useState } from "react";
import CharacteristicsForm from "../components/CharacteristicsForm";
import LogoutButton from "./LogoutButton";
import WeightChart from "../components/WeightChart";
const Profile = () => {
  const [setError] = useState(null);
  return (
    <>

      <div className="flex flex-col md:flex-row w-full max-w-[1200px] mx-auto gap-4">
        <div className="md:w-1/2">
          <CharacteristicsForm />
        </div>
        <div className="md:w-1/2 h-[400px]">
          <WeightChart />
        </div>
      </div>
      <LogoutButton setError={setError} />
    </>
  );
};

export default Profile;
