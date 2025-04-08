<!-- components/ContentBlock.vue - Component khối nội dung -->
<template>
  <div class="content-block">
    <div class="block-header">
      <div class="block-number">{{ number }}</div>
      <div class="block-content">
        <div class="content-line long"></div>
        <div class="content-line medium"></div>
        <div class="content-line short"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentBlock',
  props: {
    number: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.content-block {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  width: 100%;
  margin-bottom: 15px;
}

.block-header {
  display: flex;
  align-items: flex-start;
}

.block-number {
  width: 28px;
  height: 28px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #888;
  flex-shrink: 0;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.content-line {
  height: 14px;
  background-color: #e0e0e0;
  border-radius: 2px;
}

.content-line.long {
  width: 100%;
}

.content-line.medium {
  width: 70%;
}

.content-line.short {
  width: 50%;
}
</style>