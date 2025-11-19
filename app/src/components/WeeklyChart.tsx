import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Theme } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface WeeklyChartProps {
  weekSessions: number[];
  theme: Theme;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ weekSessions, theme }) => {
  if (!weekSessions || weekSessions.length === 0) return null;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        📊 Produtividade Semanal
      </Text>
      <LineChart
        data={{
          labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          datasets: [{ data: weekSessions.length > 0 ? weekSessions : [0] }]
        }}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={{
          backgroundColor: theme.cardBg,
          backgroundGradientFrom: theme.cardBg,
          backgroundGradientTo: theme.cardBg,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.primary,
          labelColor: (opacity = 1) => theme.textSecondary,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: theme.primary
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});