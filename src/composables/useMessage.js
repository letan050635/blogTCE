import { ref } from 'vue';

export default function useMessage() {
  const successMessage = ref('');
  const errorMessage = ref('');
  
  const showSuccess = (message, duration = 3000) => {
    successMessage.value = message;
    
    if (duration > 0) {
      setTimeout(() => {
        clearSuccess();
      }, duration);
    }
  };
  
  const showError = (error, prefix = 'Lỗi: ') => {
    const message = error instanceof Error ? error.message : error;
    errorMessage.value = prefix + message;
  };
  
  const clearSuccess = () => {
    successMessage.value = '';
  };
  
  const clearError = () => {
    errorMessage.value = '';
  };
  
  const clearMessages = () => {
    clearSuccess();
    clearError();
  };
  
  return {
    successMessage,
    errorMessage,
    showSuccess,
    showError,
    clearSuccess,
    clearError,
    clearMessages
  };
}