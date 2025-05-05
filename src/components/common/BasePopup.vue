<template>
    <transition name="fade">
      <div class="popup-overlay" v-if="isOpen" @click="closeOnOverlayClick">
        <transition name="slide">
          <div class="popup-content" @click.stop>
            <div class="popup-header">
              <h2>{{ item.title }}</h2>
              <button class="close-button" @click="$emit('close')">&times;</button>
            </div>
            
            <div class="popup-body">
              <div v-if="item.useHtml" v-html="item.content"></div>
              <p v-else>{{ item.content }}</p>
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
        </transition>
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
    },
    beforeUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown);
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
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: #fff;
    border-radius: 5px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
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
  }
  
  .popup-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: transform 0.2s;
  }
  
  .close-button:hover {
    transform: scale(1.2);
  }
  
  .popup-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    line-height: 1.5;
  }
  
  .popup-body p {
    margin-bottom: 15px;
  }
  
  .popup-footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(-30px);
  }
  
  @media screen and (max-width: 768px) {
    .popup-content {
      width: 95%;
      max-height: 80vh;
    }
    
    .popup-footer {
      flex-direction: column-reverse;
      gap: 10px;
      align-items: flex-start;
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
      font-size: 14px;
    }
  }
  </style>