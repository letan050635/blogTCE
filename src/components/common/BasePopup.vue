<template>
  <transition name="fade">
    <div class="popup-overlay" v-if="isOpen" @click="closeOnOverlayClick">
      <div class="popup-container">
        <div class="popup-content">
          <div class="popup-header">
            <h2>{{ item.title }}</h2>
            <button class="close-button" @click="$emit('close')">&times;</button>
          </div>
          
          <div class="popup-body">
            <div v-if="item.useHtml" class="content-text" v-html="item.content"></div>
            <div v-else class="content-text">{{ item.content }}</div>
          </div>
          
          <div class="popup-footer">
            <div class="popup-date">
              <template v-if="item.updateDate">
                <span>{{ updateLabel }}: {{ item.updateDate }}</span>
                <span>{{ dateLabel }}: {{ item.date }}</span>
              </template>
              <template v-else>
                <span>{{ dateLabel }}: {{ item.date }}</span>
              </template>
            </div>
            <div class="popup-actions" v-if="!item.read">
              <button class="mark-read-button" @click="$emit('mark-read', item.id)">
                {{ markReadLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BasePopup',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        title: '',
        content: '',
        date: '',
        updateDate: null,
        useHtml: false,
        read: false
      })
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    dateLabel: {
      type: String,
      default: 'Đăng'
    },
    updateLabel: {
      type: String,
      default: 'Cập nhật'
    },
    markReadLabel: {
      type: String,
      default: 'Đánh dấu đã đọc'
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
  },
  watch: {
    isOpen(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    closeOnOverlayClick(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close');
      }
    },
    handleKeyDown(event) {
      if (this.isOpen && event.key === 'Escape') {
        this.$emit('close');
      }
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.popup-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.popup-content {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.popup-header {
  background-color: #0066b3;
  color: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  flex-shrink: 0;
}

.popup-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  word-break: break-word;
  max-width: calc(100% - 40px);
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-body {
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  max-height: calc(90vh - 140px);
}

.content-text {
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  display: block;
  max-width: 100%;
  overflow-x: hidden;
}

.popup-footer {
  padding: 10px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  flex-shrink: 0;
  background-color: #fff;
}

.popup-date {
  display: flex;
  flex-direction: column;
  color: #777;
  font-size: 13px;
  text-align: right;
}

.popup-date span {
  margin-bottom: 5px;
}

.popup-actions {
  display: flex;
}

.mark-read-button {
  background-color: #0066b3;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.mark-read-button:hover {
  background-color: #004e8c;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .popup-container {
    width: 95%;
    max-height: 85vh;
  }
  
  .popup-footer {
    flex-direction: column-reverse;
    gap: 10px;
    align-items: flex-start;
    padding-bottom: 15px;
  }
  
  .popup-actions {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .mark-read-button {
    width: 100%;
    padding: 10px;
  }
  
  .popup-date {
    width: 100%;
    text-align: left;
  }
}

@media screen and (max-width: 480px) {
  .popup-header h2 {
    font-size: 16px;
  }
  
  .popup-body {
    padding: 15px;
  }
}
</style>