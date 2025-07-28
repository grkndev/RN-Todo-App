import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Switch, Text, View } from 'react-native';

export default function Preferences() {

    const [isAutoSync, setIsAutoSync] = React.useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
    const { colors, isDarkMode, toggleDarkMode } = useTheme();
    const styles = createSettingsStyles(colors);
    return (
        <LinearGradient colors={colors.gradients.surface} style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            {/* Dark Mode */}
            <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                    <LinearGradient colors={colors.gradients.primary} style={styles.settingIcon}>
                        <Ionicons name='moon' size={20} color={"#fff"} />
                    </LinearGradient>
                    <Text style={styles.settingText}>Dark Mode</Text>
                </View>

                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ true: colors.primary, false: colors.border }}
                    thumbColor={colors.text}
                    ios_backgroundColor={colors.border}

                />
            </View>


            {/* Notification */}
            <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                    <LinearGradient colors={colors.gradients.warning} style={styles.settingIcon}>
                        <Ionicons name='notifications' size={20} color={"#fff"} />
                    </LinearGradient>
                    <Text style={styles.settingText}>Notifications</Text>
                </View>

                <Switch
                    value={isNotificationEnabled}
                    onValueChange={setIsNotificationEnabled}
                    trackColor={{ true: colors.warning, false: colors.border }}
                    thumbColor={colors.text}
                    ios_backgroundColor={colors.border}

                />
            </View>

            
            {/* Auto Sync */}
            <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                    <LinearGradient colors={colors.gradients.success} style={styles.settingIcon}>
                        <Ionicons name='sync' size={20} color={"#fff"} />
                    </LinearGradient>
                    <Text style={styles.settingText}>Auto Sync</Text>
                </View>

                <Switch
                    value={isAutoSync}
                    onValueChange={setIsAutoSync}
                    trackColor={{ true: colors.success, false: colors.border }}
                    thumbColor={colors.text}
                    ios_backgroundColor={colors.border}

                />
            </View>


        </LinearGradient>
    )
}