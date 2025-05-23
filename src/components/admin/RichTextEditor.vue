<!-- src/components/admin/RichTextEditor.vue -->
<template>
  <div class="rich-text-editor">
    <div id="toolbar" class="ql-toolbar">
      <span class="ql-formats">
        <select class="ql-font">
          <option selected="selected">Roboto</option>
          <option value="arial">Arial</option>
          <option value="times">Times New Roman</option>
          <option value="tahoma">Tahoma</option>
          <option value="verdana">Verdana</option>
          <option value="georgia">Georgia</option>
        </select>
        <select class="ql-size">
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option selected="selected">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
          <option value="72px">72px</option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold" title="In đậm"></button>
        <button class="ql-italic" title="In nghiêng"></button>
        <button class="ql-underline" title="Gạch chân"></button>
        <button class="ql-strike" title="Gạch ngang"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color" title="Màu chữ"></select>
        <select class="ql-background" title="Màu nền"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered" title="Danh sách số"></button>
        <button class="ql-list" value="bullet" title="Danh sách dấu chấm"></button>
        <button class="ql-blockquote" title="Trích dẫn"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1" title="Tiêu đề 1"></button>
        <button class="ql-header" value="2" title="Tiêu đề 2"></button>
        <button class="ql-header" value="3" title="Tiêu đề 3"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align" title="Căn lề">
          <option selected="selected"></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-link" title="Chèn link" @click="showLinkDialog = true"></button>
        <button class="ql-image" title="Chèn hình"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-clean" title="Xóa định dạng"></button>
      </span>
    </div>
    <div 
      ref="editor" 
      class="ql-editor" 
      :style="{ minHeight: minHeight + 'px' }"
    ></div>
    
    <LinkDialog
      v-if="showLinkDialog"
      v-model:show="showLinkDialog"
      v-model:form="linkForm"
      @insert="insertLink"
      @close="closeLinkDialog"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useQuillEditor } from './composables/useQuillEditor';
import { useLinkDialog } from './composables/useLinkDialog';
import LinkDialog from './LinkDialog.vue';

export default {
  name: 'RichTextEditor',
  components: {
    LinkDialog
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    minHeight: {
      type: Number,
      default: 300
    },
    placeholder: {
      type: String,
      default: 'Nhập nội dung...'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = ref(null);
    
    // Tách logic editor thành composable
    const { 
      quill,
      initQuill,
      isInternalUpdate
    } = useQuillEditor(editor, props, emit);
    
    // Tách logic link dialog thành composable
    const {
      showLinkDialog,
      linkForm,
      insertLink,
      closeLinkDialog
    } = useLinkDialog(quill);
    
    // Watch for external changes
    watch(() => props.modelValue, (newValue) => {
      if (quill.value && !isInternalUpdate.value) {
        isInternalUpdate.value = true;
        if (newValue !== quill.value.root.innerHTML) {
          quill.value.root.innerHTML = newValue || '';
        }
        nextTick(() => {
          isInternalUpdate.value = false;
        });
      }
    });
    
    onMounted(() => {
      initQuill();
    });
    
    return {
      editor,
      showLinkDialog,
      linkForm,
      insertLink,
      closeLinkDialog
    };
  }
}
</script>

<style>
/* Import Quill styles */
@import url('https://cdn.quilljs.com/1.3.6/quill.snow.css');

/* Custom fonts */
.ql-font-arial {
  font-family: Arial, sans-serif;
}

.ql-font-times {
  font-family: 'Times New Roman', serif;
}

.ql-font-tahoma {
  font-family: Tahoma, sans-serif;
}

.ql-font-verdana {
  font-family: Verdana, sans-serif;
}

.ql-font-georgia {
  font-family: Georgia, serif;
}

/* Tùy chỉnh editor */
.rich-text-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
}

.ql-toolbar {
  border: none;
  border-bottom: 1px solid #eee;
  background-color: #f8f8f8;
  padding: 8px;
}

.ql-container {
  border: none;
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

.ql-editor {
  padding: 15px;
  line-height: 1.6;
}

.ql-editor p {
  margin-bottom: 10px;
}

.ql-editor h1 {
  font-size: 2em;
  margin: 20px 0 10px;
}

.ql-editor h2 {
  font-size: 1.5em;
  margin: 15px 0 10px;
}

.ql-editor h3 {
  font-size: 1.2em;
  margin: 10px 0;
}

.ql-editor ul, .ql-editor ol {
  padding-left: 20px;
  margin: 10px 0;
}

.ql-editor blockquote {
  border-left: 4px solid #ccc;
  margin: 10px 0;
  padding-left: 16px;
  color: #666;
}

/* Custom size styles */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: attr(data-value) !important;
  font-size: 14px;
}

.ql-size-10px { font-size: 10px !important; }
.ql-size-12px { font-size: 12px !important; }
.ql-size-14px { font-size: 14px !important; }
.ql-size-16px { font-size: 16px !important; }
.ql-size-18px { font-size: 18px !important; }
.ql-size-20px { font-size: 20px !important; }
.ql-size-24px { font-size: 24px !important; }
.ql-size-28px { font-size: 28px !important; }
.ql-size-32px { font-size: 32px !important; }
.ql-size-36px { font-size: 36px !important; }
.ql-size-48px { font-size: 48px !important; }
.ql-size-72px { font-size: 72px !important; }

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
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.link-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.link-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.close-btn:hover {
  color: #666;
}

.link-dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #0066b3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  font-weight: normal;
}

.form-group.checkbox input[type="checkbox"] {
  margin-right: 8px;
}

.link-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.insert-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
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

/* Tùy chỉnh màu sắc cho toolbar */
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:focus,
.ql-snow.ql-toolbar button:focus,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar.ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected {
  color: #0066b3;
}

.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill {
  fill: #0066b3;
}

.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter {
  stroke: #0066b3;
}

@media screen and (max-width: 768px) {
  .ql-toolbar {
    padding: 5px;
  }
  
  .ql-formats {
    margin-right: 5px !important;
  }
  
  .link-dialog {
    width: 95%;
  }
}
</style>