<!-- components/MainContent.vue - Component nội dung chính với tabs dọc -->
<template>
  <div class="main-content">
    <!-- Menu ngang trên cùng -->
    <!-- <TopMenu /> -->
    
    <!-- Tabs ngang phía trên -->
    <TabHeader 
      :tabs="tabHeaders" 
      :activeTab="activeTabHeader" 
      @tab-change="setActiveTabHeader"
    />
    
    <!-- Phần container chính -->
    <div class="tab-content">
      <!-- Tab dọc thay thế cho ContentBlock -->
      <VerticalTabs 
        v-if="activeTabHeader === 0"
        :tabs="verticalTabs" 
        :activeTab="activeVerticalTab" 
        @tab-change="setActiveVerticalTab"
      />
      <component v-else :is="tabHeaders[activeTabHeader].component" />
    </div>
  </div>
</template>

<script>
import TopMenu from './TopMenu.vue'
import TabHeader from './TabHeader.vue'
import VerticalTabs from './VerticalTabs.vue'
import Tab1Content from '../views/TabContents/Tab1Content.vue'
import Tab2Content from '../views/TabContents/Tab2Content.vue'
import Tab3Content from '../views/TabContents/Tab3Content.vue'
import Tab4Content from '../views/TabContents/Tab4Content.vue'

export default {
  name: 'MainContent',
  components: {
    TopMenu,
    TabHeader,
    VerticalTabs,
    Tab1Content,
    Tab2Content,
    Tab3Content,
    Tab4Content
  },
  data() {
    return {
      activeTabHeader: 0,
      activeVerticalTab: 0,
      tabHeaders: [
        { title: 'Tab 1', component: null },
        { title: 'Tab 2', component: Tab2Content },
        { title: 'Tab 3', component: Tab3Content },
        { title: 'Tab 4', component: Tab4Content }
      ],
      verticalTabs: Array(10).fill().map((_, i) => ({ title: `Item ${i + 1}` }))
    }
  },
  methods: {
    setActiveTabHeader(index) {
      this.activeTabHeader = index;
    },
    setActiveVerticalTab(index) {
      this.activeVerticalTab = index;
    }
  }
}
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}
</style>