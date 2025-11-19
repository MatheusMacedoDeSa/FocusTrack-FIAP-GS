import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, Badge } from '../types';

interface BadgeItemProps {
  badge: Badge;
  isEarned: boolean;
  theme: Theme;
}

export const BadgeItem: React.FC<BadgeItemProps> = ({ badge, isEarned, theme }) => {
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: theme.cardBg },
        !isEarned && styles.locked
      ]}
    >
      <Text style={styles.icon}>{badge.icon}</Text>
      <Text style={[styles.name, { color: theme.textSecondary }]}>
        {badge.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  locked: {
    opacity: 0.3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});