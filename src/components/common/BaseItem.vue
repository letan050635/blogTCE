<template>
  <div class="base-item" :class="{ 'item-read': item.read }">
    <div class="item-checkbox">
      <!-- Thay đổi: Loại bỏ sự kiện @change và thêm thuộc tính readonly và disabled -->
      <input
        type="checkbox"
        :checked="item.read"
        readonly
        disabled
      />
    </div>
    
    <div class="item-content">
      <div class="item-title">
        <a href="#" @click.prevent="$emit('open-popup', item)">
          {{ item.title }}
        </a>
        
        <div class="item-badges">
          <slot name="badges"></slot>
        </div>
      </div>
      
      <div v-if="item.brief" class="item-brief">
        {{ item.brief }}
      </div>
      
      <div class="item-date">
        <template v-if="item.updateDate">
          <span>{{ updateLabel }} {{ item.updateDate }}</span>
          <span>{{ dateLabel }} {{ item.date }}</span>
        </template>
        <template v-else>
          <span>{{ dateLabel }} {{ item.date }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    dateLabel: {
      type: String,
      default: 'ngày đăng'
    },
    updateLabel: {
      type: String,
      default: 'ngày cập nhật'
    }
  }
}
</script>

<style scoped>
.base-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  background-color: #f9f9f9;
}

.base-item:hover {
  background-color: #f0f5ff;
}

.base-item:last-child {
  border-bottom: none;
}

.item-read {
  background-color: transparent;
}

.item-read:hover {
  background-color: #f0f0f0;
}

.item-checkbox {
  margin-right: 10px;
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
}

/* Thêm style mới cho checkbox không thể thay đổi */
.item-checkbox input[type="checkbox"] {
  cursor: default;
  opacity: 0.7;
}

.item-content {
  flex: 1;
}

.item-title {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.item-title a {
  color: #0066b3;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
}

.item-read .item-title a {
  font-weight: normal;
  color: #444;
}

.item-title a:hover {
  text-decoration: underline;
}

.item-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.item-brief {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.item-date {
  display: flex;
  justify-content: flex-end;
  color: #777;
  font-size: 12px;
  flex-wrap: wrap;
}

.item-date span {
  margin-left: 15px;
}

@media screen and (max-width: 768px) {
  .item-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-badges {
    margin-top: 5px;
  }
  
  .item-date {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .item-date span {
    margin-left: 0;
    margin-bottom: 5px;
  }
}
</style>