import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../types';

interface GoalCardProps {
  todaySessions: number;
  dailyGoal: number;
  theme: Theme;
}

export const GoalCard: React.FC<GoalCardProps> = ({ todaySessions, dailyGoal, theme }) => {
  const progress = Math.min((todaySessions / dailyGoal) * 100, 100);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>🎯 Meta Diária</Text>
        <Text style={[styles.progress, { color: theme.primary }]}>
          {todaySessions}/{dailyGoal}
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: '#334155' }]}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%`, backgroundColor: theme.primary }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  progress: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});