<template>
  <div class="link-dialog-overlay" @click.self="$emit('close')">
    <div class="link-dialog">
      <div class="link-dialog-header">
        <h3>Chèn Link</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="link-dialog-body">
        <div class="form-group">
          <label><span class="field-index">1.</span> Văn bản hiển thị:</label>
          <input 
            :value="form.text"
            @input="updateForm('text', $event.target.value)"
            type="text" 
            placeholder="Nhập văn bản hiển thị"
            @keyup.enter="$emit('insert')"
          />
        </div>
        <div class="form-group">
          <label><span class="field-index">2.</span> URL:</label>
          <input 
            :value="form.url"
            @input="updateForm('url', $event.target.value)"
            type="text" 
            placeholder="https://example.com"
            @keyup.enter="$emit('insert')"
          />
        </div>
        <div class="form-group checkbox">
          <label>
            <span class="field-index">3.</span>
            <input 
              :checked="form.newTab"
              @change="updateForm('newTab', $event.target.checked)"
              type="checkbox" 
            />
            Mở trong tab mới
          </label>
        </div>
      </div>
      <div class="link-dialog-footer">
        <button class="cancel-btn" @click="$emit('close')">Hủy</button>
        <button class="insert-btn" @click="$emit('insert')">Chèn Link</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkDialog',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  emits: ['update:show', 'close', 'insert', 'update:form'],
  methods: {
    updateForm(field, value) {
      this.$emit('update:form', {
        ...this.form,
        [field]: value
      });
    }
  }
}
</script>

<style scoped>
/* Link dialog styles */
.link-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.link-dialog {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 98%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 16px;
}

.link-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid #eee;
}

.link-dialog-header h3 {
  margin: 0;
  font-size: 22px;
  color: #333;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
}

.close-btn:hover {
  color: #666;
}

.link-dialog-body {
  padding: 28px;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
  color: #222;
  font-size: 16px;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background: #fafbfc;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #0066b3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
}

.form-group.checkbox input[type="checkbox"] {
  margin-right: 10px;
}

.link-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 28px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.insert-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.insert-btn {
  background-color: #0066b3;
  color: white;
}

.insert-btn:hover {
  background-color: #004e8c;
}

@media screen and (max-width: 768px) {
  .link-dialog {
    width: 98%;
    padding: 0;
  }
  .link-dialog-body, .link-dialog-header, .link-dialog-footer {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.field-index {
  font-weight: bold;
  margin-right: 6px;
  color: #0066b3;
  font-size: 16px;
}
</style> 