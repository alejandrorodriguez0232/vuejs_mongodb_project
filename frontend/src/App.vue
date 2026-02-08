<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <router-link to="/" class="logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">MERN + Vue.js</span>
          </router-link>
        </div>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="active">
            <i class="pi pi-home"></i> Home
          </router-link>
          <router-link to="/about" class="nav-link" exact-active-class="active">
            <i class="pi pi-info-circle"></i> About
          </router-link>
        </div>
        
        <div class="nav-status">
          <span :class="['status-indicator', apiStatus]">
            {{ apiStatus === 'connected' ? '✅ API Connected' : '❌ API Disconnected' }}
          </span>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <Toast />
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>MERN + Vue.js</h4>
            <p>Full-stack application using MongoDB, Express, Vue.js, and Node.js</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <router-link to="/" class="footer-link">Home</router-link>
            <router-link to="/about" class="footer-link">About</router-link>
          </div>
          <div class="footer-section">
            <h4>Technology Stack</h4>
            <div class="tech-stack">
              <span class="tech-badge">Vue.js 3</span>
              <span class="tech-badge">Express.js</span>
              <span class="tech-badge">MongoDB</span>
              <span class="tech-badge">Node.js</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 MERN Vue Application. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Toast from 'primevue/toast'

export default {
  name: 'App',
  components: {
    Toast
  },
  setup() {
    const apiStatus = ref('checking')

    const checkApiStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/health')
        if (response.data.success) {
          apiStatus.value = 'connected'
        } else {
          apiStatus.value = 'disconnected'
        }
      } catch (error) {
        console.error('API connection error:', error)
        apiStatus.value = 'disconnected'
      }
    }

    onMounted(() => {
      checkApiStatus()
      // Check API status every 30 seconds
      setInterval(checkApiStatus, 30000)
    })

    return {
      apiStatus
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: $text-color;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// Navbar Styles
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.nav-brand {
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $primary-color;
    font-weight: bold;
    font-size: 1.5rem;

    .logo-icon {
      margin-right: 10px;
      font-size: 1.8rem;
    }

    .logo-text {
      background: linear-gradient(45deg, $primary-color, $secondary-color);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.nav-links {
  display: flex;
  gap: 2rem;

  .nav-link {
    text-decoration: none;
    color: $text-color;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: $primary-color;
      background: rgba($primary-color, 0.1);
    }

    &.active {
      color: white;
      background: $primary-color;
    }

    i {
      font-size: 1.2rem;
    }
  }
}

.nav-status {
  .status-indicator {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;

    &.connected {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    &.disconnected {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }

    &.checking {
      background: rgba(255, 193, 7, 0.1);
      color: #FFC107;
    }
  }
}

// Main Content
.main-content {
  flex: 1;
  padding: 2rem 0;

  .container {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }
}

// Footer Styles
.footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 3rem 0 1.5rem;

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-section {
    h4 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }
  }

  .footer-link {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: $primary-color;
    }
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-badge {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.85rem;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
}

// Responsive Design
@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-status {
    order: -1;
    width: 100%;
    text-align: center;
  }

  .main-content .container {
    padding: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
