<template>
    <div v-if="message" class="alert" :class="type">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlertMessage',
    props: {
      message: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'success',
        validator: value => ['success', 'error'].includes(value)
      }
    }
  }
  </script>
  
  <style scoped>
  .alert {
    padding: 10px 15px;
    margin-bottom: 15px;
    border-radius: 4px;
  }
  
  .alert.success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  .alert.error {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  </style>