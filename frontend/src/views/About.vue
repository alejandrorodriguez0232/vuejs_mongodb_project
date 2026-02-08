<template>
  <div class="about">
    <div class="hero-section">
      <h1>About This Application</h1>
      <p class="subtitle">A complete MERN stack application with Vue.js 3</p>
    </div>

    <div class="content">
      <div class="tech-stack-section">
        <h2>Technology Stack</h2>
        <div class="tech-grid">
          <div class="tech-card" v-for="tech in technologies" :key="tech.name">
            <div class="tech-icon" :style="{ color: tech.color }">
              {{ tech.icon }}
            </div>
            <div class="tech-info">
              <h3>{{ tech.name }}</h3>
              <p>{{ tech.description }}</p>
              <span class="tech-version">{{ tech.version }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="api-section">
        <h2>API Documentation</h2>
        <div class="api-endpoints">
          <div class="endpoint-card" v-for="endpoint in endpoints" :key="endpoint.method + endpoint.path">
            <div class="endpoint-method" :class="endpoint.method.toLowerCase()">
              {{ endpoint.method }}
            </div>
            <div class="endpoint-path">
              <code>{{ endpoint.path }}</code>
            </div>
            <div class="endpoint-description">
              {{ endpoint.description }}
            </div>
          </div>
        </div>
      </div>

      <div class="instructions-section">
        <h2>Setup Instructions</h2>
        <div class="instructions">
          <div class="step">
            <h3>Step 1: Install Dependencies</h3>
            <pre><code>npm install</code></pre>
            <p>Run this in both <code>backend</code> and <code>frontend</code> directories</p>
          </div>
          
          <div class="step">
            <h3>Step 2: Start MongoDB</h3>
            <pre><code>mongod</code></pre>
                        <p>Make sure MongoDB is running on port 27017</p>
          </div>
          
          <div class="step">
            <h3>Step 3: Start Backend</h3>
            <pre><code>cd backend
npm run dev</code></pre>
            <p>Backend will run on http://localhost:5000</p>
          </div>
          
          <div class="step">
            <h3>Step 4: Start Frontend</h3>
            <pre><code>cd frontend
npm run serve</code></pre>
            <p>Frontend will run on http://localhost:8080</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'About',
  setup() {
    const technologies = ref([
      {
        name: 'Vue.js 3',
        icon: '⚡',
        color: '#42b883',
        version: 'v3.3+',
        description: 'Progressive JavaScript Framework'
      },
      {
        name: 'Express.js',
        icon: '🚀',
        color: '#000000',
        version: 'v4.18+',
        description: 'Fast, unopinionated web framework'
      },
      {
        name: 'MongoDB',
        icon: '🍃',
        color: '#47a248',
        version: 'v6+',
        description: 'NoSQL document database'
      },
      {
        name: 'Node.js',
        icon: '⬢',
        color: '#339933',
        version: 'v18+',
        description: 'JavaScript runtime built on Chrome V8'
      },
      {
        name: 'PrimeVue',
        icon: '🎨',
        color: '#2196F3',
        version: 'v3.38+',
        description: 'UI Component Library for Vue'
      },
      {
        name: 'Axios',
        icon: '🔗',
        color: '#5a29e4',
        version: 'v1.5+',
        description: 'Promise based HTTP client'
      }
    ])

    const features = ref([
      {
        icon: '👥',
        title: 'User Management',
        description: 'Full CRUD operations for managing users with validation'
      },
      {
        icon: '🎯',
        title: 'Real-time Updates',
        description: 'Instant feedback and updates without page reload'
      },
      {
        icon: '📱',
        title: 'Responsive Design',
        description: 'Works perfectly on all device sizes'
      },
      {
        icon: '🛡️',
        title: 'Error Handling',
        description: 'Comprehensive error handling and user feedback'
      },
      {
        icon: '🔍',
        title: 'Search & Filter',
        description: 'Real-time search and filtering capabilities'
      },
      {
        icon: '📊',
        title: 'Statistics',
        description: 'Visual statistics and user insights'
      }
    ])

    const endpoints = ref([
      {
        method: 'GET',
        path: '/api/users',
        description: 'Get all users'
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get a single user by ID'
      },
      {
        method: 'POST',
        path: '/api/users',
        description: 'Create a new user'
      },
      {
        method: 'PUT',
        path: '/api/users/:id',
        description: 'Update an existing user'
      },
      {
        method: 'DELETE',
        path: '/api/users/:id',
        description: 'Delete a user'
      },
      {
        method: 'GET',
        path: '/api/health',
        description: 'Check API health status'
      }
    ])

    return {
      technologies,
      features,
      endpoints
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.about {
  padding: 1rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  border-radius: 15px;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.tech-stack-section,
.features-section,
.api-section,
.instructions-section {
  margin-bottom: 3rem;
}

h2 {
  color: $primary-color;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid $border-color;
  padding-bottom: 0.5rem;
}

.tech-grid,
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tech-card {
  background: white;
  border: 1px solid $border-color;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

.tech-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tech-info {
  flex: 1;

  h3 {
    margin: 0 0 0.5rem;
    color: $text-color;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 0.5rem;
    color: $text-secondary;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.tech-version {
  display: inline-block;
  background: $bg-light;
  color: $primary-color;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.feature-card {
  background: white;
  border: 1px solid $border-color;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: $primary-color;
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: $text-color;
  margin-bottom: 1rem;
}

.feature-card p {
  color: $text-secondary;
  line-height: 1.6;
}

.api-endpoints {
  background: white;
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
}

.endpoint-card {
  display: grid;
  grid-template-columns: 100px 1fr 2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid $border-color;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: $bg-light;
  }
}

.endpoint-method {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  font-size: 0.9rem;

  &.get {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  }

  &.post {
    background: rgba(33, 150, 243, 0.1);
    color: #2196F3;
  }

  &.put {
    background: rgba(255, 152, 0, 0.1);
    color: #FF9800;
  }

  &.delete {
    background: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
}

.endpoint-path {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;

  code {
    background: $bg-light;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    color: $primary-color;
  }
}

.endpoint-description {
  color: $text-secondary;
  font-size: 0.9rem;
}

.instructions-section {
  .instructions {
    background: white;
    border: 1px solid $border-color;
    border-radius: 10px;
    padding: 2rem;
  }

  .step {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid $border-color;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    h3 {
      color: $text-color;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin-bottom: 1rem;

      code {
        font-family: 'Courier New', Courier, monospace;
        color: #333;
        font-size: 0.9rem;
      }
    }

    p {
      color: $text-secondary;
      margin: 0;

      code {
        background: rgba($primary-color, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9rem;
        color: $primary-color;
      }
    }
  }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .tech-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .endpoint-card {
    grid-template-columns: 1fr;
    gap: 0.5rem;

    .endpoint-method {
      width: 80px;
    }
  }

  .instructions {
    padding: 1rem;
  }
}
</style>