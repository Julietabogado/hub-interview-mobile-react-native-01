import Loader from "@/components/Loader";
import RecipeCard from "@/components/RecipeCard";
import { COLORS } from "@/constants/colors";
import { recipesAPI } from "@/services/recipesAPI";
import { Recipe } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { searchStyles } from "../../assets/styles/search.styles";
import NoResultsFound from "../../components/NoResultsFound";
import { useDebounce } from "../../hooks/useDebounce";
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); 

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (recipeName: string) => {
    const nameResults = await recipesAPI.searchRecipes(recipeName);
    let results = nameResults;

    return results;
  };
  useEffect(() => {
    // if input is empty do nothing
    if (!debouncedSearchQuery.trim()) {
      setRecipes([]);
      setSearchPerformed(false);
      return;
    }

    const handleSearch = async () => {
      setLoading(true);
      setSearchPerformed(true); // initiate search

      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error("Error searching:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : ""}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes?.length} found</Text>
        </View>

        {loading && searchPerformed ? (
          <View style={searchStyles.loadingContainer}>
            <Loader message="Searching recipes..." size="small" />
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <NoResultsFound
                iconName="search-outline"
                title="No recipes found."
                subtitle="Try a different recipe."
              />
            }
          />
        )}
      </View>
    </View>
  );
}
