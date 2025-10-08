import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { recipeCardStyles } from "../assets/styles/home.styles";

export default function RecipeCard({ recipe }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={300}
        />
      </View>
      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.description} numberOfLines={2}>
          {recipe.name}
        </Text>
        {recipe.difficulty && (
          <Text style={recipeCardStyles.description} numberOfLines={2}>
            {recipe.difficulty}
          </Text>
        )}
        <View style={recipeCardStyles.footer}>
          {recipe.cookTimeMinutes ? (
            <View style={recipeCardStyles.timeContainer}>
              <Ionicons name="time-outline" size={14} c />
              <Text>{recipe.cookTimeMinutes}</Text>
            </View>
          ) : null}
          {recipe?.servings ? (
            <View style={recipeCardStyles.servingsContainer}>
              <Ionicons name="people-outline" size={14} />
              <Text style={recipeCardStyles.servingsText}>
                {recipe.servings}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
