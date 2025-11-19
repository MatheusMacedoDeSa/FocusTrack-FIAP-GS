export const formatDate = (dateString: string): string => {
    // Formata a data para 'DD/MM, HH:MM'
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };