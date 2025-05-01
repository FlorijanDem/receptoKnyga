import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function WriteReview({ recipe_id, isLoggedIn, setRefresh }) {
  const { user } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
    },
  });
  const navigate = useNavigate();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [error, setError] = useState(null);
  const [hover, setHover] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const rating = watch("rating");

  useEffect(() => {
    reset();
    if (user?.id && recipe_id) {
      setValue("user_id", user.id);
      setValue("recipe_id", recipe_id);

      const checkReview = async () => {
        try {
          const response = await axios.get(`${API_URL}/reviews/${recipe_id}`, {
            withCredentials: true,
          });
          const userReview = response.data.data.find(
            (review) => review.user_id === user.id
          );
          setHasReviewed(!!userReview);
        } catch (err) {
          setError(err);
          setHasReviewed(false);
        }
      };
      checkReview();
    }
  }, [user, recipe_id, setValue]);

  const isZalgo = (value) => {
    const zalgoRegex = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\uFE20-\uFE2F]/;
    return !zalgoRegex.test(value) || "Special characters are not allowed!";
  };
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/reviews/${recipe_id}`,
        data,
        {
          withCredentials: true,
        }
      );
      setHasReviewed(true);
      setRefresh((prev) => !prev);

      navigate(`/recipe/${response.data.data.recipe_id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-[var(--color-recipe-third)] text-center">
        Log in to leave a review.
      </p>
    );
  }

  if (hasReviewed) {
    return <></>;
  }

  return (
    <>
      {!showForm && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[var(--color-recipe-primary)] text-white px-4 py-2 rounded-md mt-4 cursor-pointer disabled:bg-[var(--color-recipe-secondary)] disabled:cursor-not-allowed"
            disabled={hasReviewed || user.role === "admin" || user?.banned}
          >
            {" "}
            Leave a Review
          </button>
        </div>
      )}

      {showForm && (
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="pt-2 text-3xl font-bold mb-2">Leave a Review</h2>

          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                type="button"
                className={`text-3xl cursor-pointer transition ${
                  (hover || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                onClick={() =>
                  setValue("rating", star, { shouldValidate: true })
                }
              />
            ))}
            <input
              type="hidden"
              {...register("rating", {
                required: "Rating is required",
                min: { value: 1, message: "Please select a rating" },
              })}
            />
          </div>

          {errors.rating && (
            <p className="text-[var(--color-recipe-fourth)]">
              {errors.rating.message}
            </p>
          )}

          <textarea
            {...register("review_text", {
              validate: isZalgo,
              required: "Review text is required",
              maxLength: {
                value: 500,
                message:
                  "Review cannot exceed 500 characters and cannot contain special characters",
              },
            })}
            placeholder="Write your review here..."
            className="border border-[var(--color-recipe-secondary)] bg-white rounded-md p-2 w-full"
          />

          {errors.review_text && (
            <p className="text-[var(--color-recipe-fourth)]">
              {errors.review_text.message}
            </p>
          )}

          {error && (
            <p className="text-[var(--color-recipe-fourth)] mt-2">{error}</p>
          )}
          <div className="flex justify-center mt-4 gap-2">
            <button
              type="submit"
              className="bg-[var(--color-recipe-primary)] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Submit Review
            </button>
            <button
              className="bg-[var(--color-recipe-secondary)] text-[var(--color-recipe-fifth)] px-4 py-2 rounded-md cursor-pointer"
              onClick={() => {
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default WriteReview;
