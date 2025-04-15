<template>
  <div class="regulation-item" :class="{ 'regulation-read': regulation.read }">
    <div class="regulation-checkbox">
      <input type="checkbox" :checked="regulation.read" @change="toggleRead">
    </div>
    
    <div class="regulation-content">
      <div class="regulation-title">
        <a href="#" @click.prevent="openPopup">
          {{ regulation.title }}
        </a>
        
        <div class="regulation-badges">
          <span v-if="regulation.isNew" class="regulation-badge new-badge">New</span>
          <span v-if="!regulation.read" class="regulation-badge unread-badge">Chưa đọc</span>
          <span v-if="regulation.isImportant" class="regulation-badge important-badge">Quan trọng</span>
        </div>
      </div>
      
      <div class="regulation-brief" v-if="regulation.brief">
        {{ regulation.brief }}
      </div>
      
      <div class="regulation-date">
        <template v-if="regulation.updateDate">
          <span>ngày cập nhật {{ regulation.updateDate }}</span>
          <span>ngày đăng {{ regulation.date }}</span>
        </template>
        <template v-else>
          <span>ngày đăng {{ regulation.date }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegulationItem',
  props: {
    regulation: {
      type: Object,
      required: true
    }
  },
  methods: {
    openPopup() {
      this.$emit('open-popup', this.regulation);
    },
    toggleRead() {
      this.$emit('toggle-read', this.regulation.id);
    }
  }
}
</script>

<style scoped>
.regulation-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  background-color: #f9f9f9;
}

.regulation-item:hover {
  background-color: #f0f5ff;
}

.regulation-item:last-child {
  border-bottom: none;
}

.regulation-read {
  background-color: transparent;
}

.regulation-read:hover {
  background-color: #f0f0f0;
}

.regulation-checkbox {
  margin-right: 10px;
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
}

.regulation-content {
  flex: 1;
}

.regulation-title {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.regulation-title a {
  color: #0066b3;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
}

.regulation-read .regulation-title a {
  font-weight: normal;
  color: #444;
}

.regulation-title a:hover {
  text-decoration: underline;
}

.regulation-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.regulation-badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
}

.new-badge {
  background-color: #ff5722;
  color: #fff;
}

.unread-badge {
  background-color: #4CAF50;
  color: #fff;
}

.important-badge {
  background-color: #f44336;
  color: #fff;
}

.regulation-brief {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.regulation-date {
  display: flex;
  justify-content: flex-end;
  color: #777;
  font-size: 12px;
  flex-wrap: wrap;
}

.regulation-date span {
  margin-left: 15px;
}

@media screen and (max-width: 768px) {
  .regulation-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .regulation-badges {
    margin-top: 5px;
  }
  
  .regulation-date {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .regulation-date span {
    margin-left: 0;
    margin-bottom: 5px;
  }
}
</style>