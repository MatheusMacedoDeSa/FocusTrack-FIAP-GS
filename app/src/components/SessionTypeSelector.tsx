import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SessionType, Theme } from '../types';

interface SessionTypeSelectorProps {
  sessionType: SessionType;
  onSelect: (type: SessionType) => void;
  theme: Theme;
}

export const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({
  sessionType,
  onSelect,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.cardBg },
          sessionType === 'focus' && { borderColor: theme.primary, borderWidth: 2 }
        ]}
        onPress={() => onSelect('focus')}
      >
        <Text style={[styles.text, { color: theme.text }]}>
          🎯 Foco (25min)
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.cardBg },
          sessionType === 'break' && { borderColor: theme.primary, borderWidth: 2 }
        ]}
        onPress={() => onSelect('break')}
      >
        <Text style={[styles.text, { color: theme.text }]}>
          ☕ Pausa (5min)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});