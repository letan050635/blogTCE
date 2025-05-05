<template>
  <BaseItem 
    :item="regulation" 
    @open-popup="$emit('open-popup', regulation)"
    @toggle-read="$emit('toggle-read', regulation.id)"
  >
    <template #badges>
      <BaseItemBadge v-if="regulation.isNew" type="new" text="New" />
      <BaseItemBadge v-if="!regulation.read" type="unread" text="Chưa đọc" />
      <BaseItemBadge v-if="regulation.isImportant" type="important" text="Quan trọng" />
    </template>
  </BaseItem>
</template>

<script>
import BaseItem from '@/components/common/BaseItem.vue';
import BaseItemBadge from '@/components/common/BaseItemBadge.vue';

export default {
  name: 'RegulationItem',
  components: {
    BaseItem,
    BaseItemBadge
  },
  props: {
    regulation: {
      type: Object,
      required: true
    }
  }
}
</script>