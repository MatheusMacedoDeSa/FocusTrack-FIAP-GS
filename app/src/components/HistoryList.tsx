import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Session, Theme } from '../types';
import { formatDate } from '../utils/dateHelpers';

interface HistoryListProps {
  sessions: Session[];
  theme: Theme;
}

export const HistoryList: React.FC<HistoryListProps> = ({ sessions, theme }) => {
  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>📝 Histórico Recente</Text>
        <View style={[styles.emptyState, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Nenhuma sessão registrada ainda.
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Complete sua primeira sessão de foco!
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>📝 Histórico Recente</Text>
      {sessions.slice(0, 10).map((session) => (
        <View key={session.id} style={[styles.item, { backgroundColor: theme.cardBg }]}>
          <View style={styles.left}>
            <Text style={[styles.type, { color: theme.text }]}>
              {session.type}
            </Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(session.date)}
            </Text>
            {session.note && (
              <Text style={[styles.note, { color: theme.textSecondary }]}>
                📝 {session.note}
              </Text>
            )}
          </View>
          <Text style={[styles.duration, { color: theme.primary }]}>
            {session.duration} min
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  item: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
  },
  note: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  duration: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
  },
});