<!-- modules/notifications/NotificationItem.vue -->
<template>
  <div
    class="notification-item"
    :class="{ 'notification-read': notification.read }"
  >
    <div class="notification-checkbox">
      <input
        type="checkbox"
        :checked="notification.read"
        @change="toggleRead"
      />
    </div>

    <div class="notification-content">
      <div class="notification-title">
        <a href="#" @click.prevent="openPopup">
          {{ notification.title }}
        </a>

        <div class="notification-badges">
          <span v-if="notification.isNew" class="notification-badge new-badge"
            >New</span
          >
          <span
            v-if="!notification.read"
            class="notification-badge unread-badge"
            >Chưa đọc</span
          >
          <span
            v-if="notification.isImportant"
            class="notification-badge important-badge"
            >Quan trọng</span
          >
        </div>
      </div>

      <div class="notification-brief" v-if="notification.brief">
        {{ notification.brief }}
      </div>

      <div class="notification-date">
        <template v-if="notification.updateDate">
          <span>ngày cập nhật {{ notification.updateDate }}</span>
          <span>ngày đăng {{ notification.date }}</span>
        </template>
        <template v-else>
          <span>ngày đăng {{ notification.date }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationItem",
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openPopup() {
      this.$emit("open-popup", this.notification);
    },
    toggleRead() {
      this.$emit("toggle-read", this.notification.id);
    },
  },
};
</script>

<style scoped>
.notification-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  background-color: #f9f9f9;
}

.notification-item:hover {
  background-color: #f0f5ff;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-read {
  background-color: transparent;
}

.notification-read:hover {
  background-color: #f0f0f0;
}

.notification-checkbox {
  margin-right: 10px;
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.notification-title a {
  color: #0066b3;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
}

.notification-read .notification-title a {
  font-weight: normal;
  color: #444;
}

.notification-title a:hover {
  text-decoration: underline;
}

.notification-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.notification-badge {
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

.notification-brief {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.notification-date {
  display: flex;
  justify-content: flex-end;
  color: #777;
  font-size: 12px;
  flex-wrap: wrap;
}

.important-badge {
  background-color: #f44336;
  color: #fff;
}

.notification-date span {
  margin-left: 15px;
}

@media screen and (max-width: 768px) {
  .notification-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .notification-badges {
    margin-top: 5px;
  }

  .notification-date {
    flex-direction: column;
    align-items: flex-end;
  }

  .notification-date span {
    margin-left: 0;
    margin-bottom: 5px;
  }
}
</style>