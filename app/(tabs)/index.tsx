// index.tsx (Tela Principal Refatorada)
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  StatusBar,
  Switch,
  Dimensions
} from 'react-native';
import { useDataAnalytics } from '../src/hooks/useDataAnalytics';
import { usePomodoro } from '../src/hooks/usePomodoro';
import { darkTheme, lightTheme } from '../src/config/themes';
import { BADGE_DEFINITIONS } from '../src/config/constants';
import { Session, SessionType, BadgeType } from '../src/types';

// Componentes modulares
import { SessionTypeSelector } from '../src/components/SessionTypeSelector';
import { GoalCard } from '../src/components/GoalCard';
import { StatCard } from '../src/components/StatCard';
import { WeeklyChart } from '../src/components/WeeklyChart';
import { HistoryList } from '../src/components/HistoryList';
import { TimerModal } from '../src/components/TimerModal';
import { BadgeItem } from '../src/components/BadgeItem';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  // 1. Lógica de Dados e Persistência
  const { 
    sessions,
    stats,
    badges: earnedBadges,
    dailyGoal,
    darkMode,
    loadData,
    saveSession,
    clearAllData,
    setDarkMode,
  } = useDataAnalytics();

  // Estados de UI
  const [modalVisible, setModalVisible] = useState(false);
  const [completedSessionType, setCompletedSessionType] = useState<SessionType>('focus');

  // 2. Lógica do Timer
  const handleTimerComplete = useCallback(() => {
    // Registra o tipo de sessão que acabou de ser concluída
    setCompletedSessionType(pomodoro.sessionType);
    setModalVisible(true);
  }, []);

  const pomodoro = usePomodoro(handleTimerComplete);
  
  // Tema
  const theme = darkMode ? darkTheme : lightTheme;

  // Carregar dados na inicialização
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função para salvar a sessão após o Modal
  const handleSaveSession = useCallback(async (note: string) => {
    const duration = completedSessionType === 'focus' ? 25 : 5;
    
    const newSession: Session = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: duration,
      type: completedSessionType === 'focus' ? 'Foco Profundo' : 'Pausa',
      note: note,
    };
    
    await saveSession(newSession);

    setModalVisible(false);

    Alert.alert(
      '🎉 Sessão Completa!',
      `Parabéns! Você completou uma sessão de ${duration} minutos.`,
      [{ text: 'OK', onPress: () => {
          // Automaticamente muda para o próximo tipo de sessão após salvar
          pomodoro.switchSessionType(completedSessionType === 'focus' ? 'break' : 'focus');
      } }]
    );
  }, [completedSessionType, saveSession, pomodoro]);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const clearDataConfirmed = () => {
    Alert.alert(
      'Confirmar',
      'Deseja limpar todos os dados? Isso é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          onPress: async () => {
            await clearAllData();
            Alert.alert('✅', 'Dados limpos!');
          }
        }
      ]
    );
  };
  
  const allBadges = Object.keys(BADGE_DEFINITIONS).map(key => ({
    key: key,
    ...BADGE_DEFINITIONS[key as BadgeType]
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header (Manteve-se aqui por ser específico da tela) */}
        <View style={[styles.header, { backgroundColor: theme.cardBg }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.primary }]}>FocusTrack</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                DataWork Analytics
              </Text>
            </View>
            <View style={styles.themeToggle}>
              <Text style={{ color: theme.text, marginRight: 10 }}>{darkMode ? '🌙' : '☀️'}</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: theme.primary }}
              />
            </View>
          </View>
        </View>

        {/* Tipo de Sessão */}
        <SessionTypeSelector
          sessionType={pomodoro.sessionType}
          onSelect={pomodoro.switchSessionType}
          theme={theme}
        />

        {/* Timer */}
        <View style={[styles.timerCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>
            {pomodoro.sessionType === 'focus' ? 'Sessão de Foco' : 'Pausa Curta'}
          </Text>
          <Text style={[styles.timerDisplay, { color: theme.primary }]}>
            {formatTime(pomodoro.seconds)}
          </Text>
          
          <View style={styles.buttonRow}>
            {!pomodoro.isActive ? (
              <TouchableOpacity style={styles.btnStart} onPress={pomodoro.startTimer}>
                <Text style={styles.btnText}>▶ Iniciar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnPause} onPress={pomodoro.pauseTimer}>
                <Text style={styles.btnText}>⏸ Pausar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.btnReset, { backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.textSecondary }]} 
              onPress={pomodoro.resetTimer}
            >
              <Text style={[styles.btnTextSecondary, { color: theme.text }]}>↻ Resetar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meta Diária */}
        <GoalCard todaySessions={stats.todaySessions} dailyGoal={dailyGoal} theme={theme} />

        {/* Estatísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard number={stats.todaySessions} label="Hoje" theme={theme} />
            <StatCard number={stats.totalSessions} label="Total" theme={theme} />
            <StatCard number={stats.currentStreak} label="Dias Seguidos" theme={theme} />
          </View>
        </View>

        {/* Conquistas */}
        <View style={styles.badgesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🏆 Conquistas</Text>
          <View style={styles.badgesGrid}>
            {allBadges.map(({ key, icon, name }) => (
              <View 
                key={key}
                style={{ width: (SCREEN_WIDTH - 60) / 2 }}
              >
                <BadgeItem
                  badge={{ icon, name }}
                  isEarned={earnedBadges.includes(key as BadgeType)}
                  theme={theme}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Gráfico Semanal */}
        <WeeklyChart weekSessions={stats.weekSessions} theme={theme} />

        {/* Histórico */}
        <HistoryList sessions={sessions} theme={theme} />

        {/* Botão Limpar */}
        <TouchableOpacity style={styles.btnClear} onPress={clearDataConfirmed}>
          <Text style={styles.btnClearText}>🗑️ Limpar Dados</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            DataWork - GS 2025.2
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>
            Engenharia da Computação - FIAP
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Nota */}
      <TimerModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveSession}
        sessionType={completedSessionType}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  headerSubtitle: { fontSize: 14 },
  themeToggle: { flexDirection: 'row', alignItems: 'center' },
  timerCard: { margin: 20, marginTop: 10, padding: 30, borderRadius: 20, alignItems: 'center' },
  timerLabel: { fontSize: 16, marginBottom: 15 },
  timerDisplay: { fontSize: 64, fontWeight: 'bold', marginBottom: 30 },
  buttonRow: { flexDirection: 'row', gap: 15 },
  btnStart: { backgroundColor: '#22c55e', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 12 },
  btnPause: { backgroundColor: '#f59e0b', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 12 },
  btnReset: { paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnTextSecondary: { fontSize: 15, fontWeight: '600' },
  badgesContainer: { margin: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  statsContainer: { margin: 20, marginTop: 10 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  btnClear: { margin: 20, marginTop: 10, padding: 15, backgroundColor: '#991b1b', borderRadius: 12, alignItems: 'center' },
  btnClearText: { color: '#fecaca', fontSize: 13, fontWeight: '600' },
  footer: { padding: 30, alignItems: 'center' },
  footerText: { fontSize: 12, marginBottom: 3 },
  footerSubtext: { fontSize: 11 },
});