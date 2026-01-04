import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/sizes';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ placeholder, value, onChange }: SearchBarProps) => (
  <View style={styles.wrapper}>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      style={styles.input}
      accessibilityLabel={placeholder}
      clearButtonMode="while-editing"
      returnKeyType="search"
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  input: {
    height: 40,
  },
});
