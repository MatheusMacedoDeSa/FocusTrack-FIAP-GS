// components/TimerModal.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Theme } from '../types';

interface TimerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  sessionType: 'focus' | 'break';
  theme: Theme;
}

export const TimerModal: React.FC<TimerModalProps> = ({ 
  isVisible, 
  onClose, 
  onSave,
  sessionType,
  theme 
}) => {
  const [sessionNote, setSessionNote] = React.useState('');

  const handleSave = () => {
    onSave(sessionNote);
    setSessionNote('');
  };

  const handleSkip = () => {
    onSave(''); // Salva com nota vazia
    setSessionNote('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            🎉 Sessão de {sessionType === 'focus' ? 'Foco' : 'Pausa'} Completa!
          </Text>
          <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
            Adicione uma nota (opcional):
          </Text>
          
          <TextInput
            style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.text }]}
            placeholder="Ex: Refatorei o componente GoalCard"
            placeholderTextColor={theme.textSecondary}
            value={sessionNote}
            onChangeText={setSessionNote}
            multiline
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnSecondary]}
              onPress={handleSkip}
            >
              <Text style={styles.modalBtnText}>Pular</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnPrimary]}
              onPress={handleSave}
            >
              <Text style={styles.modalBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnPrimary: {
    backgroundColor: '#22c55e',
  },
  modalBtnSecondary: {
    backgroundColor: '#64748b',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});