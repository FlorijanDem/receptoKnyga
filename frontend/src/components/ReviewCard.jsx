// import axios from "axios";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import ReviewControls from "./ReviewControls";

const API_URL = import.meta.env.VITE_API_URL;

const ReviewCard = ({ review, setRefresh }) => {
  const [currentReview, setCurrentReview] = useState(review);

  return (
    <div
      key={currentReview.id}
      className="border-b-[var(--color-recipe-third)] bg-white pb-3 mb-3 shadow-md rounded-lg p-4"
    >
      <div className="flex justify-between">
        <p className="font-bold pl-1 text-[var(--color-recipe-third)]">
          {currentReview.username}
        </p>
        <p className="text-[var(--color-recipe-secondary)] text-sm">
          {format(new Date(currentReview.created_at), "yyyy MMMM dd HH:mm")}
        </p>
      </div>

      <div className="flex justify-between">
        <p className="text-[var(--color-recipe-third)] pl-1">
          {currentReview.review_text}
        </p>
        <p className="flex">
          {Array.from({ length: currentReview.rating }, (_, index) => (
            <FaStar
              key={index}
              className="text-2xl mt-0.5 mb-2 text-yellow-400"
            />
          ))}
        </p>
      </div>
      <ReviewControls
        review={currentReview}
        setReview={setCurrentReview}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default ReviewCard;
