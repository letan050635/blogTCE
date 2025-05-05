<template>
  <BaseItem 
    :item="notification" 
    @open-popup="$emit('open-popup', notification)"
    @toggle-read="$emit('toggle-read', notification.id)"
  >
    <template #badges>
      <BaseItemBadge v-if="notification.isNew" type="new" text="New" />
      <BaseItemBadge v-if="!notification.read" type="unread" text="Chưa đọc" />
      <BaseItemBadge v-if="notification.isImportant" type="important" text="Quan trọng" />
    </template>
  </BaseItem>
</template>

<script>
import BaseItem from '@/components/common/BaseItem.vue';
import BaseItemBadge from '@/components/common/BaseItemBadge.vue';

export default {
  name: 'NotificationItem',
  components: {
    BaseItem,
    BaseItemBadge
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>