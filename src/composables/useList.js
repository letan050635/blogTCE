import { ref, computed } from 'vue';

export default function useList(fetchFunction, options = {}) {
  const {
    defaultPageSize = 10,
    defaultPage = 1
  } = options;
  
  const isLoading = ref(false);
  const data = ref([]);
  const errorMessage = ref('');
  const successMessage = ref('');
  const currentPage = ref(defaultPage);
  const totalPages = ref(1);
  const totalItems = ref(0);
  const searchQuery = ref('');
  const searchTimeout = ref(null);
  
  const fetchData = async (params = {}) => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      const result = await fetchFunction({
        page: currentPage.value,
        limit: defaultPageSize,
        search: searchQuery.value || undefined,
        ...params
      });
      
      if (result && result.data) {
        data.value = result.data;
        totalPages.value = result.pagination?.totalPages || 1;
        totalItems.value = result.pagination?.total || 0;
        
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
          currentPage.value = 1;
          return fetchData(params);
        }
      } else {
        console.error('Invalid data format:', result);
        errorMessage.value = 'Định dạng dữ liệu không hợp lệ';
        data.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      errorMessage.value = error.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
      data.value = [];
      totalPages.value = 1;
      totalItems.value = 0;
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleSearch = (query) => {
    searchQuery.value = query;
    
    // Debounce search
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value);
    }
    
    searchTimeout.value = setTimeout(() => {
      currentPage.value = 1; // Reset to first page
      fetchData();
    }, 300);
  };
  
  const changePage = (page) => {
    currentPage.value = page;
    fetchData();
  };
  
  const showSuccessMessage = (message, duration = 3000) => {
    successMessage.value = message;
    setTimeout(() => {
      successMessage.value = '';
    }, duration);
  };
  
  const isEmpty = computed(() => data.value.length === 0);
  
  return {
    isLoading,
    data,
    errorMessage,
    successMessage,
    currentPage,
    totalPages,
    totalItems,
    isEmpty,
    searchQuery,
    fetchData,
    handleSearch,
    changePage,
    showSuccessMessage
  };
}