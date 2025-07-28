import { createHomeStyles } from '@/assets/styles/home.styles';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import TodoInput from '@/components/TodoInput';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Todo = Doc<"todos">

export default function HomeScreen() {
    const { colors, toggleDarkMode } = useTheme()
    const styles = createHomeStyles(colors)

    const [edittingId, setEdittingId] = React.useState<Id<"todos"> | null>(null);
    const [editText, setEditText] = React.useState<string>("");

    const toggleTodo = useMutation(api.todos.toggleTodo);
    const deleteTodo = useMutation(api.todos.deleteTodo);
    const updateTodo = useMutation(api.todos.updateTodo);

    const todos = useQuery(api.todos.getTodos);
    const isLoading = todos === undefined;
    if (isLoading) return <LoadingSpinner />

    const handleToggleTodo = async (id: Id<"todos">) => {
        try {
            await toggleTodo({ id });
        } catch (error) {
            console.error('Error toggling todo:', error);
            Alert.alert('Error', 'Failed to toggle todo');
        }
    }

    const handleDeleteTodo = async (id: Id<"todos">) => {
        try {
            Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteTodo({ id });
                    }
                }
            ])
        } catch (error) {
            console.error('Error deleting todo:', error);
            Alert.alert('Error', 'Failed to delete todo');
        }
    }

    const handleEditTodo = (todo: Todo) => {
        setEdittingId(todo._id);
        setEditText(todo.text);
    }
    const handleSaveEdit = async () => {
        if (!edittingId) return;
        try {
            await updateTodo({ id: edittingId, text: editText.trim() });
            setEdittingId(null);
            setEditText("");
        } catch (error) {
            console.error('Error editing todo:', error);
            Alert.alert('Error', 'Failed to edit todo');
        }
    }
    const handleCancelEdit = (todo: Todo) => {
        setEdittingId(null);
        setEditText("");
    }

    const renderTodoItem = ({ item }: { item: Todo }) => {
        const isEditing = edittingId === item._id;
        return <View style={styles.todoItemWrapper}>
            <LinearGradient
                colors={colors.gradients.surface}
                style={styles.todoItem}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity style={styles.checkbox} activeOpacity={0.7} onPress={() => handleToggleTodo(item._id)}>
                    <LinearGradient
                        colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
                        style={[
                            styles.checkboxInner,
                            { borderColor: item.isCompleted ? "transparent" : colors.border }
                        ]}
                    >
                        {
                            item.isCompleted &&
                            <Ionicons name='checkmark' size={18} color={"#fff"} />
                        }
                    </LinearGradient>
                </TouchableOpacity>

                {
                    isEditing ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.editInput}
                                value={editText}
                                onChangeText={setEditText}
                                autoFocus
                                placeholder='Edit todo...'
                                placeholderTextColor={colors.textMuted}
                            />
                           <View style={styles.editButtons}>
                                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8} >
                                    <LinearGradient colors={colors.gradients.success} style={styles.editButton}>
                                        <Ionicons name='checkmark' size={16} color={"#fff"} />
                                        <Text style={styles.editButtonText}>Save</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleCancelEdit(item)} activeOpacity={0.8} >
                                    <LinearGradient colors={colors.gradients.muted} style={styles.editButton}>
                                        <Ionicons name='close' size={16} color={"#fff"} />
                                        <Text style={styles.editButtonText}>Cancel</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </View>
                    ) : (
                        <View style={styles.todoTextContainer}>
                            <Text
                                style={[
                                    styles.todoText,
                                    item.isCompleted && {
                                        textDecorationLine: 'line-through',
                                        color: colors.textMuted,
                                        opacity: 0.6
                                    }
                                ]}
                            >
                                {item.text}
                            </Text>

                            <View style={styles.todoActions}>
                                <TouchableOpacity onPress={() => handleEditTodo(item)} activeOpacity={0.8}>
                                    <LinearGradient colors={colors.gradients.warning} style={styles.actionButton}>
                                        <Ionicons name='pencil' size={14} color={"#fff"} />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} activeOpacity={0.8}>
                                    <LinearGradient colors={colors.gradients.danger} style={styles.actionButton}>
                                        <Ionicons name='trash' size={14} color={"#fff"} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </LinearGradient>
        </View>
    }

    return (
        <LinearGradient colors={colors.gradients.background} style={styles.container}>
            <StatusBar barStyle={colors.statusBarStyle} />
            <SafeAreaView style={styles.safeArea}>
                <Header />
                <TodoInput />

                <FlatList
                    data={todos}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderTodoItem}
                    style={styles.todoList}
                    contentContainerStyle={styles.todoListContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyState />

                    }
                />

            </SafeAreaView>
        </LinearGradient>
    )
}