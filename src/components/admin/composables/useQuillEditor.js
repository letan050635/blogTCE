import { ref } from 'vue';

export function useQuillEditor(editor, props, emit) {
  const quill = ref(null);
  const isInternalUpdate = ref(false);

  const initQuill = async () => {
    // Import Quill động để tránh lỗi SSR
    const Quill = (await import('quill')).default;
    
    // Custom size attribute
    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];
    Quill.register(Size, true);
    
    // Font families
    const Font = Quill.import('formats/font');
    Font.whitelist = ['arial', 'times', 'tahoma', 'verdana', 'georgia'];
    Quill.register(Font, true);
    
    // Create Quill instance
    quill.value = new Quill(editor.value, {
      theme: 'snow',
      placeholder: props.placeholder,
      modules: {
        toolbar: {
          container: '#toolbar'
        }
      }
    });
    
    // Set giá trị ban đầu
    if (props.modelValue) {
      quill.value.root.innerHTML = props.modelValue;
    }
    
    // Listen for text change
    quill.value.on('text-change', handleTextChange);
  };

  const handleTextChange = () => {
    if (!isInternalUpdate.value) {
      const html = quill.value.root.innerHTML;
      // Chỉ emit nếu có nội dung
      if (html === '<p><br></p>') {
        emit('update:modelValue', '');
      } else {
        emit('update:modelValue', html);
      }
    }
  };

  return {
    quill,
    initQuill,
    handleTextChange,
    isInternalUpdate
  };
} 