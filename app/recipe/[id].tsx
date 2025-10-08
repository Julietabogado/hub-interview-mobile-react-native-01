import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Loader from "@/components/Loader";
import { COLORS } from "@/constants/colors";
import { recipesAPI } from "@/services/recipesAPI";
import { Recipe } from "@/types/recipe";
import { recipeDetailStyles } from "../../assets/styles/recipe.styles";

const FAVORITES_KEY = "@favorites_recipes";

export default function RecipeDetailScreen() {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await recipesAPI.searchRecipesById(recipeId);
      setRecipe(response);

      // Load favorite status
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setIsSaved(favorites.includes(String(recipeId)));
    } catch (error) {
      console.log("Error loading the recipe details or favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isSaved) {
        // Remove from favorites
        favorites = favorites.filter((id: string) => id !== String(recipeId));
        setIsSaved(false);
      } else {
        // Add to favorites
        favorites.push(String(recipeId));
        setIsSaved(true);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.log("Error toggling favorite:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await recipesAPI.deleteRecipebyId(recipeId);
      if (response.isDeleted === true) {
        // Remove from favorites
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        favorites = favorites.filter((id: string) => id !== String(recipeId));
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        router.back();
      }
    } catch (error) {
      console.log("Error deleting recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [recipeId]);

  if (loading) return <Loader message="Loading recipe details..." />;

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe?.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.shadow : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={
                  isSaving ? "hourglass" : isSaved ? "heart" : "heart-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe?.name}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe?.title}</Text>
            {recipe?.cuisine && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe?.cuisine} Cuisine
                </Text>
              </View>
            )}
            {recipe?.difficulty && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe?.difficulty}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/*  STATS, COOKTIME AND SERVINGS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <Text style={recipeDetailStyles.statValue}>
                {recipe?.cookTimeMinutes}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <Text style={recipeDetailStyles.statValue}>
                {recipe?.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {/* INGREDIENTS  */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="restaurant" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe?.ingredients.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe?.ingredients.map((ingredient, index) => (
                <View key={index + 1} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* INSTRUCTIONS  */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe?.instructions.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe?.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={20}
                color={COLORS.white}
              />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleDelete}
            disabled={isSaving}
          >
            <View style={recipeDetailStyles.buttonGradient}>
              <Ionicons name="trash-bin" size={20} color={COLORS.text} />
              <Text
                style={[
                  recipeDetailStyles.secondaryButtonText,
                  { color: COLORS.text },
                ]}
              >
                Delete recipe
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
