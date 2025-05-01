import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import RecipeFormLayout from "./layout/RecipeFormLayout";
import {
  NON_VEGETARIAN_CATEGORIES,
  NON_VEGETARIAN_KEYWORDS,
} from "../utils/validation/recipeValidation";

const API_URL = import.meta.env.VITE_API_URL;

function AddRecipe({ action }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState({ data: [], index: -1 });
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const [error, setError] = useState(null);

  const recipe = location.state?.recipe || null;

  const methods = useForm({
    // defaultValues: {
    //   title: "",
    //   description: "",
    //   method: "",
    //   preparation_time: "",
    //   servings: "",
    //   type: "non-veg",
    //   photo: "",
    //   products: [{ title: "", amount: "" }],
    // },
    mode: "onBlur",
  });

  const { control, watch, setValue, trigger, reset } = methods;

  const recipeType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const filterProductsByType = useCallback((products, type) => {
    if (!products || products.length === 0) return [];

    if (type === "veg") {
      return products.filter((product) => {
        if (!product.category) return true;

        const isNonVeg = NON_VEGETARIAN_CATEGORIES.some((category) =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );

        const containsNonVegKeyword = NON_VEGETARIAN_KEYWORDS.some((keyword) =>
          product.title.toLowerCase().includes(keyword.toLowerCase())
        );

        return !isNonVeg && !containsNonVegKeyword;
      });
    }

    return products;
  }, []);

  const searchProducts = useCallback(
    async (query, index, recipeType) => {
      if (!query || query.length < 2) {
        setSearchResults({ data: [], index });
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`${API_URL}/products`, {
          params: { q: query },
          withCredentials: true,
        });

        let products = response.data.data || [];

        const filteredProducts = filterProductsByType(products, recipeType);

        setSearchResults({ data: filteredProducts, index });
        setActiveIndex(-1);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults({ data: [], index });
      } finally {
        setIsSearching(false);
      }
    },
    [filterProductsByType]
  );

  const handleProductSearch = useCallback(
    (e, index) => {
      const value = e.target.value;
      setValue(`products.${index}.title`, value);

      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }

      if (value.length >= 2) {
        window.searchTimeout = setTimeout(() => {
          searchProducts(value, index, recipeType);
        }, 300);
      } else {
        setSearchResults({ data: [], index: -1 });
        setIsSearching(false);
        setActiveIndex(-1);
      }
    },
    [setValue, searchProducts, recipeType]
  );

  const selectProduct = useCallback(
    (product, index) => {
      setValue(`products.${index}.title`, product.title);
      setSearchResults({ data: [], index: -1 });

      trigger(`products.${index}.title`);
    },
    [setValue, trigger]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      if (!searchResults.data || searchResults.data.length === 0) return;

      if (searchResults.index !== index) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < searchResults.data.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        selectProduct(searchResults.data[activeIndex], index);
        setActiveIndex(-1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSearchResults({ data: [], index: -1 });
        setActiveIndex(-1);
      }
    },
    [searchResults, activeIndex, selectProduct]
  );

  const addProductField = useCallback(async () => {
    const isValid = await trigger("products");
    if (!isValid) return;

    append({ title: "", amount: "" });
  }, [trigger, append]);

  const onSubmit = useCallback(
    async (data) => {
      setError(null);

      try {
        const response =
          action === "edit"
            ? await axios.patch(`${API_URL}/recipes/${recipe.id}`, data, {
                withCredentials: true,
              })
            : await axios.post(`${API_URL}/recipes`, data, {
                withCredentials: true,
              });
        navigate(`/recipe/${response.data.data.id}`);
      } catch (err) {
        setError(
          err.response?.data?.message
            ? `Failed to add recipe: ${err.response.data.message}`
            : "Failed to add recipe. Please try again."
        );
      }
    },
    [navigate]
  );
  useEffect(() => {
    if (action === "edit") {
      reset({
        title: recipe?.title,
        description: recipe?.description,
        method: recipe?.method,
        preparation_time: recipe?.preparation_time,
        servings: recipe?.servings,
        type: recipe?.type,
        photo: recipe?.photo,
        products: recipe?.products,
      });
    } else {
      reset({
        title: "",
        description: "",
        method: "",
        preparation_time: "",
        servings: "",
        type: "non-veg",
        photo: "",
        products: [{ title: "", amount: "" }],
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [action]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchResults({ data: [], index: -1 });
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  return (
    <RecipeFormLayout
      methods={methods}
      onSubmit={onSubmit}
      error={error}
      searchResults={searchResults}
      activeIndex={activeIndex}
      handleProductSearch={handleProductSearch}
      handleKeyDown={handleKeyDown}
      isSearching={isSearching}
      selectProduct={selectProduct}
      setActiveIndex={setActiveIndex}
      addProductField={addProductField}
      remove={remove}
      fields={fields}
      recipeType={recipeType}
      action={action}
      reset={reset}
    />
  );
}

export default AddRecipe;
