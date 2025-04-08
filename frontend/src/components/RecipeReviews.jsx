import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const RecipeReviews = ({ refresh }) => {
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [editingReview, setEditingReview] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      review_text: "",
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/${id}`, {
          withCredentials: true,
        });
        setReviews(response.data.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id, refresh]);

  const isZalgo = (value) => {
    const zalgoRegex = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\uFE20-\uFE2F]/;
    return !zalgoRegex.test(value) || "Special characters are not allowed!";
  };

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setValue("rating", review.rating, { shouldValidate: true });
    setValue("review_text", review.review_text, { shouldValidate: true });
  };

  const handleUpdateReview = async (data) => {
    try {
      const response = await axios.patch(
        `${API_URL}/reviews/${id}/${editingReview}`,
        data,
        { withCredentials: true }
      );
      setReviews(
        reviews.map((r) => (r.id === editingReview ? response.data.data : r))
      );
      setEditingReview(null);
      reset();
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  const handleDeleteClick = (reviewId) => {
    setDeleteReviewId(reviewId);
    setOpenDelete(true);
  };

  const handleDeleteReview = async () => {
    if (!deleteReviewId) return;

    try {
      await axios.delete(`${API_URL}/reviews/${id}/${deleteReviewId}`, {
        withCredentials: true,
      });
      setReviews(reviews.filter((r) => r.id !== deleteReviewId));
      setOpenDelete(false);
      setDeleteReviewId(null);
      navigate(`/recipe/${id}`);
    } catch (error) {
      setError(error.response?.data?.message);
      setOpenDelete(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleReviews(reviews.length);
  };

  const handleShowLess = () => {
    setVisibleReviews(2);
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error)
    return <p className="text-[var(--color-recipe-fourth)]">{error}</p>;

  return (
    <>
      <div className="pt-2">
        <h1 className="text-2xl pb-2 pl-1 font-bold">Reviews</h1>
        {reviews.length === 0 ? (
          <p className="text-[var(--color-recipe-secondary)] pl-1">
            No reviews yet.
          </p>
        ) : null}
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review.id}
            className="border-b-[var(--color-recipe-third)] bg-white pb-3 mb-3 shadow-md rounded-lg p-4"
          >
            <div className="flex justify-between">
              <p className="font-bold pl-1 text-[var(--color-recipe-third)]">
                {review.username}
              </p>
              <p className="text-[var(--color-recipe-secondary)] text-sm">
                {format(new Date(review.created_at), "yyyy MMMM dd HH:mm")}
              </p>
            </div>
            {editingReview === review.id ? (
              <form onSubmit={handleSubmit(handleUpdateReview)}>
                <div className="flex mt-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl cursor-pointer ${
                        watch("rating") >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
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
                  <p className="text-[var(--color-recipe-fourth)] mb-2">
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
                  className="border border-[var(--color-recipe-secondary)] bg-[var(--color-recipe-fifth)] rounded-md p-2 w-full"
                />
                {errors.review_text && (
                  <p className="text-[var(--color-recipe-fourth)] mt-2">
                    {errors.review_text.message}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReview(null);
                      reset();
                    }}
                    className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between">
                  <p className="text-[var(--color-recipe-third)] pl-1">
                    {review.review_text}
                  </p>
                  <p className="flex">
                    {Array.from({ length: review.rating }, (_, index) => (
                      <FaStar
                        key={index}
                        className="text-2xl mt-0.5 mb-2 text-yellow-400"
                      />
                    ))}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  {user?.id === review.user_id && (
                    <button
                      onClick={() => handleEditClick(review)}
                      className="bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  {(user?.id === review.user_id || user?.role === "admin") && (
                    <button
                      className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
                      onClick={() => handleDeleteClick(review.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {reviews.length > 2 && (
          <div className="flex justify-center">
            {visibleReviews < reviews.length && (
              <button
                onClick={handleLoadMore}
                className="pt-2 bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-5 py-2 rounded-md"
              >
                Load More
              </button>
            )}
            {visibleReviews > 2 && (
              <button
                onClick={handleShowLess}
                className="pt-2 bg-[var(--color-recipe-primary)] text-[var(--color-recipe-fifth)] px-5 py-2 rounded-md"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>

      {openDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-recipe-fifth)] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p className="text-sm text-[var(--color-recipe-third)] mb-4">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-2 rounded-lg mr-2"
                onClick={handleDeleteReview}
              >
                Delete
              </button>
              <button
                className="bg-[var(--color-recipe-secondary)] text-[var(--color-recipe-fifth)] px-4 py-2 rounded-lg"
                onClick={() => {
                  setOpenDelete(false);
                  setDeleteReviewId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeReviews;
