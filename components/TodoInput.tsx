import { createHomeStyles } from '@/assets/styles/home.styles'
import { api } from '@/convex/_generated/api'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Alert, TextInput, TouchableOpacity, View } from 'react-native'

export default function TodoInput() {
    const { colors } = useTheme()
    const styles = createHomeStyles(colors)

    const [newTodo, setNewTodo] = React.useState('');
    const addTodo = useMutation(api.todos.addTodo);

    const handleAddTodo = async () => {
        if (newTodo.trim() === '') return;

        try {
            await addTodo({ text: newTodo })
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
            Alert.alert('Error', 'Failed to add todo');
        }
    }
    return (
        <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder='What needs to be done'
                    value={newTodo}
                    onChangeText={setNewTodo}
                    onSubmitEditing={handleAddTodo}
                    placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity onPress={handleAddTodo} activeOpacity={0.8} disabled={!newTodo.trim()}>
                    <LinearGradient
                        colors={
                            newTodo.trim()
                                ? colors.gradients.primary
                                : colors.gradients.muted
                        }
                        style={styles.addButton}
                    >
                        <Ionicons name='add' size={24} color={"#fff"}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    )
}