import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../types';

interface StatCardProps {
  number: number;
  label: string;
  theme: Theme;
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, theme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <Text style={[styles.number, { color: theme.primary }]}>{number}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  number: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});