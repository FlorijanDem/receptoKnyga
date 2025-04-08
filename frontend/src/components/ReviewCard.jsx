import { format } from "date-fns";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  return (
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
        {/* {(user?.id === review.user_id || user?.role === "admin") && (
          <button
            className="bg-[var(--color-recipe-fourth)] text-[var(--color-recipe-fifth)] px-4 py-1 rounded-lg"
            // onClick={() => handleDeleteClick(review.id)}
          >
            Delete
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ReviewCard;
