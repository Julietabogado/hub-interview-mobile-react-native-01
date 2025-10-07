import { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import Loader from "@/components/Loader";
import { Recipe } from "@/types/recipe";
import RecipeCard from "../../components/RecipeCard";

import NoResultsFound from "@/components/NoResultsFound";
import { favoritesStyles } from "../../assets/styles/favorites.styles";

export default function FavoritesScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (loading && !refreshing)
    return <Loader message="Loading favorite recipes..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}> Favorite recipes</Text>
        </View>
        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`}
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
          />
        </View>
      </ScrollView>
    </View>
  );
}
