import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function DangerZone() {
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const clearAllTodos = useMutation(api.todos.clearAllTodos);

    const handleDeleteAllTodos = async () => {
        Alert.alert("Reset App",
            "⚠️ This action will delete ALL your todos permanently. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await clearAllTodos();
                            Alert.alert("App Reset",
                                `Successfully deleted ${result.deletedCount} todo${result.deletedCount > 1 ? "s" : ""}. Your app has been reset.`,
                            )
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Error", "Failed to delete todos. Please try again.");
                        }

                    }
                }
            ]
        )
    }

    return (
        <LinearGradient colors={colors.gradients.surface} style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>

            <TouchableOpacity style={[
                styles.actionButton, { borderBottomWidth: 0 }]}
                onPress={handleDeleteAllTodos}
                activeOpacity={0.7}
            >
                <View style={styles.actionLeft}>
                    <LinearGradient colors={colors.gradients.danger} style={styles.actionIcon}>
                        <Ionicons name='trash' size={20} color={"#fff"} />
                    </LinearGradient>
                    <Text style={styles.actionText}>Delete All Data</Text>
                </View>
                <Ionicons name='chevron-forward' size={18} color={colors.text} />

            </TouchableOpacity>
        </LinearGradient>
    )
}