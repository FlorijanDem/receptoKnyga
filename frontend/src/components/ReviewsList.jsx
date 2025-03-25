import { useContext } from "react";
import { AdminFilterContext } from "../contexts/AdminFilterContext";

const ReviewsList = () => {
  const { adminFilters } = useContext(AdminFilterContext);
  console.log("adminFilters", adminFilters);

  return <h1>ReviewsList</h1>;
};

export default ReviewsList;
