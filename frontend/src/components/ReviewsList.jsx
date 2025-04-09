import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { AdminFilterContext } from "../contexts/AdminFilterContext";
import ListPagination from "./ListPagination";
// import RecipeReviews from "./RecipeReviews";
import ReviewCard from "./ReviewCard";

const API_URL = import.meta.env.VITE_API_URL;

const ReviewsList = () => {
  const { user } = useContext(UserContext);
  const { adminFilters } = useContext(AdminFilterContext);
  const [filter, setFilter] = useState({ page: 1, limit: 12 });
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", filter.page);
        params.append("limit", filter.limit);
        if (adminFilters?.value !== "all" && user?.role === "admin") {
          params.append(adminFilters.name, adminFilters.value);
        }

        const { data: response } = await axios.get(
          `${API_URL}/reviews?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        setReviews(response.data);
        setCount(response.count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
    console.log(`xxx`);
  }, [adminFilters, filter, refresh]);

  return (
    <section className="w-9/12 max-w-[1200px] mx-auto py-4">
      <h1 className="text-center text-3xl">Reviews List</h1>
      <ListPagination filter={filter} setFilter={setFilter} count={count} />
      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewCard review={review} key={review.id} setRefresh={setRefresh} />
        ))}
      </div>
      <ListPagination filter={filter} setFilter={setFilter} count={count} />
    </section>
  );
};

export default ReviewsList;
