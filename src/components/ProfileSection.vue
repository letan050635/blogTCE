<template>
    <div class="profile-section">
      <div class="profile-avatar"></div>
      <div class="profile-info"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfileSection'
  }
  </script>
  
  <style scoped>
  .profile-section {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e0e0e0;
    margin-right: 15px;
  }
  
  .profile-info {
    height: 18px;
    width: 150px;
    background-color: #e0e0e0;
  }
  </style>