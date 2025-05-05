import { ref } from 'vue';

export default function useDeleteDialog(deleteFunction) {
  const showDeleteDialog = ref(false);
  const isDeleting = ref(false);
  const selectedItem = ref(null);
  
  const confirmDelete = (item) => {
    selectedItem.value = item;
    showDeleteDialog.value = true;
  };
  
  const closeDeleteDialog = () => {
    showDeleteDialog.value = false;
  };
  
  const deleteItem = async (onSuccess) => {
    if (!selectedItem.value || !selectedItem.value.id) {
      return;
    }
    
    isDeleting.value = true;
    
    try {
      await deleteFunction(selectedItem.value.id);
      closeDeleteDialog();
      
      if (onSuccess) {
        onSuccess(selectedItem.value);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    } finally {
      isDeleting.value = false;
    }
  };
  
  return {
    showDeleteDialog,
    isDeleting,
    selectedItem,
    confirmDelete,
    closeDeleteDialog,
    deleteItem
  };
}