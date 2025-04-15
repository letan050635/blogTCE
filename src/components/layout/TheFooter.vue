<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <h3>TCE-EMS.COM</h3>
            <p>Blog thông báo</p>
          </div>
          
          <div class="footer-links">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><router-link to="/">Trang chủ</router-link></li>
              <li><router-link to="/regulation">regulations</router-link></li>
              <li><router-link to="/wordpress">WordPress</router-link></li>
              <li><router-link to="/seo">SEO</router-link></li>
            </ul>
          </div>
          
          <div class="footer-contact">
            <h4>Liên hệ</h4>
            <p>Email: contact@tce-ems.com</p>
            <p>Facebook: fb.com/tce.ems</p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} TCE-EMS.COM - Bản quyền thuộc về TCE.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'TheFooter',
    computed: {
      currentYear() {
        return new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #333;
    color: #fff;
    padding: 40px 0 20px;
    margin-top: 40px;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 250px;
    margin-bottom: 20px;
  }
  
  .footer-logo h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #ff5722;
  }
  
  .footer-links {
    flex: 1;
    min-width: 200px;
    margin-bottom: 20px;
  }
  
  .footer-links h4 {
    margin: 0 0 15px;
    font-size: 16px;
    color: #ff5722;
  }
  
  .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-links li {
    margin-bottom: 10px;
  }
  
  .footer-links a {
    color: #ddd;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    color: #fff;
    text-decoration: underline;
  }
  
  .footer-contact {
    flex: 1;
    min-width: 250px;
    margin-bottom: 20px;
  }
  
  .footer-contact h4 {
    margin: 0 0 15px;
    font-size: 16px;
    color: #ff5722;
  }
  
  .footer-contact p {
    margin: 0 0 10px;
    color: #ddd;
  }
  
  .footer-bottom {
    border-top: 1px solid #444;
    padding-top: 20px;
    text-align: center;
    color: #aaa;
    font-size: 14px;
  }
  
  @media screen and (max-width: 768px) {
    .footer-content {
      flex-direction: column;
    }
  }
  </style>