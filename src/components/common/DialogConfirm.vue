<template>
    <div v-if="show" class="dialog-overlay" @click="closeOnOverlayClick">
      <div class="dialog-content delete-dialog" @click.stop>
        <div class="dialog-header">
          <h2>{{ title }}</h2>
          <button @click="$emit('close')" class="close-button">&times;</button>
        </div>
        
        <div class="dialog-body">
          <p>{{ message }}</p>
          <p v-if="warningText" class="warning">{{ warningText }}</p>
        </div>
        
        <div class="dialog-actions">
          <button @click="$emit('close')" class="cancel-button">{{ cancelText }}</button>
          <button @click="$emit('confirm')" class="delete-button" :disabled="confirmDisabled">
            <span v-if="confirmDisabled">{{ loadingText }}</span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DialogConfirm',
    props: {
      show: Boolean,
      title: {
        type: String,
        default: 'Xác nhận'
      },
      message: {
        type: String, 
        required: true
      },
      warningText: String,
      confirmText: {
        type: String,
        default: 'Xác nhận'
      },
      cancelText: {
        type: String,
        default: 'Hủy'
      },
      loadingText: {
        type: String,
        default: 'Đang xử lý...'
      },
      confirmDisabled: Boolean,
      closeOnClickOutside: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      closeOnOverlayClick(event) {
        if (this.closeOnClickOutside && event.target === event.currentTarget) {
          this.$emit('close');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-content {
    background-color: white;
    border-radius: 6px;
    max-width: 80%;
    width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: dialog-fade-in 0.2s;
  }
  
  @keyframes dialog-fade-in {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  
  .dialog-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .close-button {
    background: transparent;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
  }
  
  .dialog-body {
    padding: 20px;
  }
  
  .dialog-body .warning {
    color: #f44336;
    font-weight: 500;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    border-top: 1px solid #eee;
  }
  
  .cancel-button,
  .delete-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .cancel-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .cancel-button:hover {
    background-color: #e0e0e0;
  }
  
  .delete-button {
    background-color: #f44336;
    color: white;
    border: none;
  }
  
  .delete-button:hover:not(:disabled) {
    background-color: #d32f2f;
  }
  
  .delete-button:disabled {
    background-color: #ffccbc;
    cursor: not-allowed;
  }
  
  @media screen and (max-width: 768px) {
    .dialog-content {
      max-width: 95%;
      width: 95%;
    }
  }
  </style>