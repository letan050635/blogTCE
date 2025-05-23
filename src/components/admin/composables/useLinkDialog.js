import { ref } from 'vue';

export function useLinkDialog(quill) {
  const showLinkDialog = ref(false);
  const linkForm = ref({
    text: '',
    url: '',
    newTab: true
  });
  let savedSelection = null;

  const insertLink = () => {
    if (!linkForm.value.url) return;
    
    // Ensure URL has protocol
    let url = linkForm.value.url;
    if (!url.match(/^https?:\/\//)) {
      url = 'https://' + url;
    }
    
    // Insert link
    if (savedSelection && quill.value) {
      const text = linkForm.value.text || url;
      const target = linkForm.value.newTab ? '_blank' : '_self';
      
      quill.value.deleteText(savedSelection.index, savedSelection.length);
      quill.value.insertText(savedSelection.index, text, {
        link: {
          href: url,
          target: target
        }
      });
      
      // Set selection after the link
      quill.value.setSelection(savedSelection.index + text.length);
    }
    
    closeLinkDialog();
  };

  const closeLinkDialog = () => {
    showLinkDialog.value = false;
    linkForm.value = {
      text: '',
      url: '',
      newTab: true
    };
    savedSelection = null;
  };

  const openLinkDialog = (range) => {
    if (range) {
      savedSelection = range;
      const selectedText = quill.value.getText(range.index, range.length);
      linkForm.value.text = selectedText;
      linkForm.value.url = '';
      showLinkDialog.value = true;
    }
  };

  return {
    showLinkDialog,
    linkForm,
    insertLink,
    closeLinkDialog,
    openLinkDialog
  };
} 