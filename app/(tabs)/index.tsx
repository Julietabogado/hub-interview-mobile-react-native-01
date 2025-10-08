import NoResultsFound from "@/components/NoResultsFound";
import { Recipe } from "@/types/recipe.js";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../../assets/styles/home.styles.js";
import Loader from "../../components/Loader.jsx";
import RecipeCard from "../../components/RecipeCard";
import { recipesAPI } from "../../services/recipesAPI";

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const isMounted = useRef(false); // Track if component is mounted

  const loadData = async (refresh = false) => {
    if (loading || (!refresh && !hasMore)) return;

    try {
      setLoading(true);
      const currentSkip = refresh ? 0 : skip;
      const response = await recipesAPI.getAllRecipes(LIMIT, currentSkip);

      const newRecipes = response.recipes || [];

      if (refresh) {
        setRecipes(newRecipes);
      } else {
        setRecipes((prev) => [...prev, ...newRecipes]);
      }
      setSkip(currentSkip + newRecipes.length);
      setHasMore(newRecipes.length === LIMIT);
    } catch (error) {
      console.log("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEasyRecipesButton = () => {};

  useEffect(() => {
    isMounted.current = true;
    loadData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading && !refreshing && recipes.length === 0) {
    return <Loader message="Loading yummy recipes..." />;
  }

  return (
    <View style={[homeStyles.container, { minHeight: "100%" }]}>
      <View style={homeStyles.recipesSection}>
        <View style={homeStyles.sectionHeader}>
          <TouchableOpacity
            onPress={handleEasyRecipesButton}
            style={homeStyles.selectButtonContainer}
          >
            <Text style={homeStyles.sectionTitle} numberOfLines={2}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.selectButtonContainer}>
            <Text style={homeStyles.sectionTitle}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.selectButtonContainer}>
            <Text style={homeStyles.sectionTitle}>Medium</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recipes}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={homeStyles.recipesGrid}
          scrollEnabled={true}
          ListEmptyComponent={
            <NoResultsFound
              iconName="restaurant-outline"
              title="No recipes found"
              subtitle=""
            />
          }
          onEndReached={() => {
            if (hasMore && !loading && recipes.length >= LIMIT) {
              loadData();
            }
          }}
          onEndReachedThreshold={0.1} 
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadData(true);
            setRefreshing(false);
          }}
        />
      </View>
    </View>
  );
}