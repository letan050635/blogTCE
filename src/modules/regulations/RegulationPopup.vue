<template>
  <BasePopup
    :item="regulation"
    :isOpen="isOpen"
    dateLabel="Đăng"
    updateLabel="Cập nhật"
    markReadLabel="Đánh dấu đã đọc"
    @close="$emit('close')"
    @mark-read="$emit('mark-read', regulation.id)"
  />
</template>

<script>
import BasePopup from '@/components/common/BasePopup.vue';

export default {
  name: 'RegulationPopup',
  components: {
    BasePopup
  },
  props: {
    regulation: {
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
    }
  }
}
</script>