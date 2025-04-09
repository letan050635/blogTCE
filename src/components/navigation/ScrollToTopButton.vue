<template>
  <div class="scroll-to-top" :class="{ show: showButton }" @click="scrollToTop">
    <span class="arrow">&#9650;</span>
  </div>
</template>

<script>
export default {
  name: "ScrollToTopButton",
  data() {
    return {
      showButton: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showButton = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 1000;
}

.scroll-to-top.show {
  opacity: 1;
  visibility: visible;
}

.scroll-to-top:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.arrow {
  font-size: 18px;
}
</style>