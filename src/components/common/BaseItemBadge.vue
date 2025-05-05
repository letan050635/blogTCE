<template>
    <span class="item-badge" :class="badgeClass">
      {{ text }}
    </span>
  </template>
  
  <script>
  export default {
    name: 'BaseItemBadge',
    props: {
      type: {
        type: String,
        required: true,
        validator: value => ['new', 'unread', 'important'].includes(value)
      },
      text: {
        type: String,
        required: true
      }
    },
    computed: {
      badgeClass() {
        return `${this.type}-badge`;
      }
    }
  }
  </script>
  
  <style scoped>
  .item-badge {
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
    background-color: #4caf50;
    color: #fff;
  }
  
  .important-badge {
    background-color: #f44336;
    color: #fff;
  }
  </style>