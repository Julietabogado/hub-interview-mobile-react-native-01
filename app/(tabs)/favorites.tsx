import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import Loader from "@/components/Loader";
import NoResultsFound from "@/components/NoResultsFound";
import { recipesAPI } from "@/services/recipesAPI";
import { Recipe } from "@/types/recipe";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import RecipeCard from "../../components/RecipeCard";

const FAVORITES_KEY = "@favorites_recipes";

export default function FavoritesScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load favorite recipes
  const loadFavoriteRecipes = async (isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);

      // Load favorite IDs from AsyncStorage
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

      // Fetch recipe details for each favorite ID
      const recipes: Recipe[] = [];
      for (const id of favoriteIds) {
        try {
          const recipe = await recipesAPI.searchRecipesById(id);
          if (recipe) {
            recipes.push(recipe);
          }
        } catch (error) {
          console.log(`Error fetching recipe with ID ${id}:`, error);
        }
      }

      setFavoriteRecipes(recipes);
    } catch (error) {
      console.log("Error loading favorite recipes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteRecipes();
    }, [])
  );

  if (loading && !refreshing) {
    return <Loader message="Loading favorite recipes..." />;
  }

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorite Recipes</Text>
        </View>
        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.recipesGrid}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <NoResultsFound
                iconName="heart-dislike"
                title=""
                subtitle="You have no favorite recipes."
              />
            }
            refreshing={refreshing}
            onRefresh={() => loadFavoriteRecipes(true)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
