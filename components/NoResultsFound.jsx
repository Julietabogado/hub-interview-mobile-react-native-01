import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { searchStyles } from "../assets/styles/search.styles";
import { COLORS } from "../constants/colors";

export default function NoResultsFound({iconName, title, subtitle}) {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name={iconName} size={64} color={COLORS.textLight} />
      {title !== "" && <Text style={searchStyles.emptyTitle}>{title}</Text>}
      <Text style={searchStyles.emptyDescription}>{subtitle}</Text>
    </View>
  );
}
