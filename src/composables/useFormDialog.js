import { ref, reactive } from 'vue';

export default function useFormDialog(initialFormData = {}, saveFunction) {
  const showDialog = ref(false);
  const isEditing = ref(false);
  const isSubmitting = ref(false);
  const formData = reactive({ ...initialFormData });
  
  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = initialFormData[key] || null;
    });
  };
  
  const openAddForm = () => {
    resetForm();
    isEditing.value = false;
    showDialog.value = true;
  };
  
  const openEditForm = (item) => {
    isEditing.value = true;
    
    // Populate form with data
    Object.keys(formData).forEach(key => {
      formData[key] = item[key] !== undefined ? item[key] : formData[key];
    });
    
    showDialog.value = true;
  };
  
  const closeDialog = () => {
    showDialog.value = false;
  };
  
  const submitForm = async (onSuccess) => {
    isSubmitting.value = true;
    
    try {
      let result;
      
      // Process form data before submitting if needed
      const dataToSubmit = { ...formData };
      
      if (isEditing.value) {
        result = await saveFunction.update(formData.id, dataToSubmit);
      } else {
        result = await saveFunction.create(dataToSubmit);
      }
      
      closeDialog();
      
      if (onSuccess) {
        onSuccess(result, isEditing.value ? 'update' : 'create');
      }
      
      return result;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };
  
  return {
    showDialog,
    isEditing,
    isSubmitting,
    formData,
    resetForm,
    openAddForm,
    openEditForm,
    closeDialog,
    submitForm
  };
}