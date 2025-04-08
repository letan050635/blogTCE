<!-- components/TabContents/Tab1Content.vue - Nội dung Tab 1 -->
<template>
  <div class="tab-content-container"> 
    <div class="stats-container">
      <div class="content-blocks">
      </div>
    </div>
  </div>
</template>
 
<script>
//import ContentBlock from '@/ui/ContentBlock.vue'

export default {
  name: "Tab1Content",
  components: {
    
  }
};
</script>
 
<style scoped>
.tab-content-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tab-heading {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #333;
}

.tab-description {
  color: #666;
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
}

.content-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}
</style>