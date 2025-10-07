const BASE_URL = "https://dummyjson.com/recipes";

export const recipesAPI = {
  getAllRecipes: async (limit = 20, skip = 0) => {
    try {
      const response = await fetch(
        `${BASE_URL}?limit=${limit}&skip=${skip}`
      ).then((res) => res.json());
      return response || [];
    } catch (error) {
      console.log("Error fetching all recipes: ", error);
      return [];
    }
  },
  searchRecipes: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/search?q=${name}`).then((res) =>
        res.json()
      );
      return response.recipes;
    } catch (error) {
      console.log("Error searching recipes by name: ", error);
      return [];
    }
  },
  searchRecipesById: async (recipeId) => {
    try {
      const response = await fetch(`${BASE_URL}/${recipeId}`).then((res) =>
        res.json()
      );
      return response;
    } catch (error) {
      console.log("Error searching recipes by ID: ", error);
      return [];
    }
  },
  deleteRecipebyId: async (recipeId) => {
    try {
      const response = fetch(`${BASE_URL}/${recipeId}`, {
        method: "DELETE",
      }).then((res) => res.json());
      return response;
    } catch (error) {
      console.log("Error deleting recipes by ID: ", error);
      return [];
    }
  },
};
