<template>
    <span class="status-badge" :class="badgeClass">
      {{ text }}
    </span>
  </template>
  
  <script>
  export default {
    name: 'StatusBadge',
    props: {
      type: {
        type: String,
        required: true,
        validator: value => ['active', 'inactive', 'important', 'admin', 'user'].includes(value)
      },
      text: {
        type: String,
        required: true
      }
    },
    computed: {
      badgeClass() {
        return `status-${this.type}`;
      }
    }
  }
  </script>
  
  <style scoped>
  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-inactive {
    background-color: #f5f5f5;
    color: #757575;
  }
  
  .status-important {
    background-color: #ffebee;
    color: #c62828;
  }
  
  .status-admin {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-user {
    background-color: #f5f5f5;
    color: #757575;
  }
  </style>