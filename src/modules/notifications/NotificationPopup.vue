<template>
  <BasePopup
    :item="notification"
    :isOpen="isOpen"
    dateLabel="Đăng"
    updateLabel="Cập nhật"
    markReadLabel="Đánh dấu đã đọc"
    @close="$emit('close')"
    @mark-read="$emit('mark-read', notification.id)"
  >
    <template #additional-content>
      <!-- Hiển thị file đính kèm -->
      <div v-if="notification.attachments && notification.attachments.length > 0" class="attachments-section">
        <FileList :files="notification.attachments" :showDelete="false" />
      </div>
    </template>
  </BasePopup>
</template>

<script>
import BasePopup from '@/components/common/BasePopup.vue';
import FileList from '@/components/common/FileList.vue';

export default {
  name: 'NotificationPopup',
  components: {
    BasePopup,
    FileList
  },
  props: {
    notification: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        title: '',
        content: '',
        date: '',
        updateDate: null,
        useHtml: false,
        read: false,
        attachments: []
      })
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.attachments-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style>