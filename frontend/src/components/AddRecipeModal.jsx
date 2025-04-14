import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { format, isAfter, parse } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const AddRecipeModal = ({ isOpen, onClose, onSubmit, defaultDate }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: format(defaultDate, "yyyy-MM-dd"),
      hour: format(new Date(), "HH"),
      minute: format(new Date(), "mm"),
      recipeTitle: "",
    },
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [datetimeError, setDatetimeError] = useState("");
  const [recipeError, setRecipeError] = useState("");
  const recipeTitle = watch("recipeTitle");

  useEffect(() => {
    if (recipeTitle) {
      const fetchSuggestions = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/consumed/search?q=${recipeTitle}`,
            {
              withCredentials: true,
            }
          );
          const data = res.data?.data || [];
          setSuggestions(data);
          if (data.length === 0) {
            setRecipeError("No recipes found. Please try a different name.");
          } else {
            setRecipeError("");
          }
        } catch (error) {
          console.error(error);
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setRecipeError("");
    }
  }, [recipeTitle]);

  const onFormSubmit = (data) => {
    const datetimeString = `${data.date} ${data.hour}:${data.minute}:00`;
    const parsedDate = parse(datetimeString, "yyyy-MM-dd HH:mm:ss", new Date());

    if (isAfter(parsedDate, new Date())) {
      setDatetimeError("You can't add a recipe to a future time.");
      return;
    }

    setDatetimeError("");

    if (!data.recipeTitle || suggestions.length === 0) {
      setRecipeError("Please select a valid recipe.");
      return;
    }

    onSubmit({
      recipeTitle: data.recipeTitle,
      datetime: datetimeString,
    });

    setValue("recipeTitle", "");
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div className="add-recipe-modal">
      <div className="add-recipe-modal__content">
        <h3 className="add-recipe-modal__title">Add Consumed Recipe</h3>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="add-recipe-modal__section">
            <label className="add-recipe-modal__label">Date</label>
            <input
              type="date"
              max={format(new Date(), "yyyy-MM-dd")}
              {...register("date", { required: true })}
              className="add-recipe-modal__input"
            />
            {errors.date && (
              <p className="add-recipe-modal__error">Date is required.</p>
            )}
          </div>

          <div className="add-recipe-modal__section">
            <label className="add-recipe-modal__label">Time</label>
            <div className="add-recipe-modal__time-container">
              <select
                {...register("hour", { required: true })}
                className="add-recipe-modal__select"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const val = String(i).padStart(2, "0");
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <select
                {...register("minute", { required: true })}
                className="add-recipe-modal__select"
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const val = String(i).padStart(2, "0");
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="add-recipe-modal__section">
            <label className="add-recipe-modal__label">Recipe Title</label>
            <div
              className="add-recipe-modal__recipe-container"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
              tabIndex={0}
            >
              <input
                type="text"
                {...register("recipeTitle", { required: true })}
                className="add-recipe-modal__input"
              />
              {errors.recipeTitle && (
                <p className="add-recipe-modal__error">
                  Recipe title is required.
                </p>
              )}
              {isFocused && suggestions.length > 0 && (
                <ul className="add-recipe-modal__suggestions">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="add-recipe-modal__suggestion"
                      onMouseDown={() => {
                        setValue("recipeTitle", suggestion.title);
                        setSuggestions([]);
                        setIsFocused(false);
                      }}
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {recipeError && (
            <p className="add-recipe-modal__error">{recipeError}</p>
          )}

          {datetimeError && (
            <p className="add-recipe-modal__error">{datetimeError}</p>
          )}

          <div className="add-recipe-modal__buttons">
            <button
              type="button"
              onClick={onClose}
              className="add-recipe-modal__cancel"
            >
              Cancel
            </button>
            <button type="submit" className="add-recipe-modal__submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
