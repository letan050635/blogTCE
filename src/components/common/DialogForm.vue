<template>
  <div v-if="show" class="dialog-overlay" @click="closeOnOverlayClick">
    <div class="dialog-content" :class="{ 'dialog-large': large, 'dialog-extra-large': extraLarge }" @click.stop>
      <div class="dialog-header">
        <h2>{{ title }}</h2>
        <button @click="$emit('close')" class="close-button">&times;</button>
      </div>
      
      <form @submit.prevent="$emit('submit')" class="dialog-form">
        <slot></slot>
        
        <div class="dialog-actions">
          <button type="button" @click="$emit('close')" class="cancel-button">Hủy</button>
          <button type="submit" class="save-button" :disabled="submitDisabled">
            <span v-if="submitDisabled">{{ loadingText }}</span>
            <span v-else>{{ submitText }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogForm',
  props: {
    show: Boolean,
    title: String,
    submitDisabled: Boolean,
    submitText: {
      type: String,
      default: 'Lưu'
    },
    loadingText: {
      type: String,
      default: 'Đang lưu...'
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    large: {
      type: Boolean,
      default: false
    },
    extraLarge: {
      type: Boolean,
      default: false
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
  width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dialog-fade-in 0.2s;
}

.dialog-content.dialog-large {
  width: 900px;
}

.dialog-content.dialog-extra-large {
  width: 1200px;
  max-width: 95%;
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
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  background-color: #0066b3;
  color: white;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: white;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.dialog-form {
  padding: 25px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-button,
.save-button {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
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

.save-button {
  background-color: #0066b3;
  color: white;
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: #004e8c;
}

.save-button:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
  .dialog-content,
  .dialog-content.dialog-large,
  .dialog-content.dialog-extra-large {
    max-width: 95%;
    width: 95%;
  }
  
  .dialog-form {
    padding: 20px;
  }
}
</style>