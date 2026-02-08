<template>
  <div class="home">
    <div class="header-section">
      <h1>User Management System</h1>
      <p class="subtitle">Manage your users with full CRUD operations</p>
      
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ users.length }}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>{{ avgAge.toFixed(1) }}</h3>
            <p>Average Age</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="form-section">
        <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
        <div class="form-card">
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              v-model="userForm.name"
              type="text"
              id="name"
              placeholder="Enter user name"
              :class="{ 'error': formErrors.name }"
            />
            <span v-if="formErrors.name" class="error-message">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              v-model="userForm.email"
              type="email"
              id="email"
              placeholder="Enter user email"
              :class="{ 'error': formErrors.email }"
            />
            <span v-if="formErrors.email" class="error-message">{{ formErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input
              v-model="userForm.age"
              type="number"
              id="age"
              placeholder="Enter user age"
              min="0"
              max="150"
            />
          </div>

          <div class="form-actions">
            <button
              @click="editingUser ? updateUser() : createUser()"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner"></span>
              {{ editingUser ? 'Update User' : 'Add User' }}
            </button>
            <button
              v-if="editingUser"
              @click="cancelEdit"
              class="btn btn-secondary"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              @click="resetForm"
              class="btn btn-outline"
              :disabled="loading"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div class="users-section">
        <div class="section-header">
          <h2>Users List</h2>
          <div class="controls">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="search-input"
            />
            <button @click="fetchUsers" class="btn btn-icon" title="Refresh">
              🔄
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="spinner-large"></div>
          <p>Loading users...</p>
        </div>

        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading Users</h3>
          <p>{{ error }}</p>
          <button @click="fetchUsers" class="btn btn-primary">Try Again</button>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No Users Found</h3>
          <p v-if="searchQuery">No users match your search criteria</p>
          <p v-else>Add your first user to get started!</p>
        </div>

        <div v-else class="users-grid">
          <div
            v-for="user in filteredUsers"
            :key="user._id"
            class="user-card"
            :class="{ 'editing': editingUser?._id === user._id }"
          >
            <div class="user-avatar">
              {{ getInitials(user.name) }}
            </div>
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p class="user-email">
                <i class="pi pi-envelope"></i>
                {{ user.email }}
              </p>
              <p class="user-age">
                <i class="pi pi-calendar"></i>
                Age: {{ user.age || 'N/A' }}
              </p>
              <p class="user-created">
                <i class="pi pi-clock"></i>
                Joined {{ formatDate(user.createdAt) }}
              </p>
            </div>
            <div class="user-actions">
              <button
                @click="editUser(user)"
                class="btn-action btn-edit"
                title="Edit user"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="confirmDelete(user._id)"
                class="btn-action btn-delete"
                title="Delete user"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button @click="closeModal" class="modal-close">&​times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
          <button @click="deleteUser" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Home',
  setup() {
    const toast = useToast()
    
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const editingUser = ref(null)
    const showDeleteModal = ref(false)
    const userToDelete = ref(null)
    
    const userForm = ref({
      name: '',
      email: '',
      age: ''
    })
    
    const formErrors = ref({})

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.age && user.age.toString().includes(query))
      )
    })

    const avgAge = computed(() => {
      const usersWithAge = users.value.filter(u => u.age)
      if (usersWithAge.length === 0) return 0
      const sum = usersWithAge.reduce((acc, user) => acc + user.age, 0)
      return sum / usersWithAge.length
    })

    const fetchUsers = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await api.get('/users')
        if (response.data.success) {
          users.value = response.data.data
          showSuccess('Users loaded successfully')
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        error.value = err.message || 'Failed to load users'
        showError('Failed to load users')
      } finally {
        loading.value = false
      }
    }

    const validateForm = () => {
      const errors = {}
      
      if (!userForm.value.name.trim()) {
        errors.name = 'Name is required'
      } else if (userForm.value.name.length < 2) {
        errors.name = 'Name must be at least 2 characters'
      }
      
      if (!userForm.value.email.trim()) {
        errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(userForm.value.email)) {
        errors.email = 'Please enter a valid email'
      }
      
      if (userForm.value.age && (userForm.value.age < 0 || userForm.value.age > 150)) {
        errors.age = 'Age must be between 0 and 150'
      }
      
      formErrors.value = errors
      return Object.keys(errors).length === 0
    }

    const createUser = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        const response = await api.post('/users', userForm.value)
        if (response.data.success) {
          users.value.unshift(response.data.data)
          resetForm()
          showSuccess('User created successfully')
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to create user')
      } finally {
        loading.value = false
      }
    }

    const editUser = (user) => {
      editingUser.value = { ...user }
      userForm.value = {
        name: user.name,
        email: user.email,
        age: user.age || ''
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const updateUser = async () => {
      if (!validateForm() || !editingUser.value) return
      
      loading.value = true
      try {
        const response = await api.put(`/users/${editingUser.value._id}`, userForm.value)
        if (response.data.success) {
          const index = users.value.findIndex(u => u._id === editingUser.value._id)
          if (index !== -1) {
            users.value[index] = response.data.data
          }
          cancelEdit()
          showSuccess('User updated successfully')
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to update user')
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (userId) => {
      userToDelete.value = userId
      showDeleteModal.value = true
    }

    const deleteUser = async () => {
      if (!userToDelete.value) return
      
      loading.value = true
      try {
        const response = await api.delete(`/users/${userToDelete.value}`)
        if (response.data.success) {
          users.value = users.value.filter(user => user._id !== userToDelete.value)
          showSuccess('User deleted successfully')
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to delete user')
      } finally {
        loading.value = false
        closeModal()
      }
    }

    const cancelEdit = () => {
      editingUser.value = null
      resetForm()
    }

    const resetForm = () => {
      userForm.value = {
        name: '',
        email: '',
        age: ''
      }
      formErrors.value = {}
    }

    const closeModal = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'today'
      if (diffDays === 1) return 'yesterday'
      if (diffDays < 7) return `${diffDays} days ago` 
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago` 
      return date.toLocaleDateString()
    }

    const showSuccess = (message) => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
      })
    }

    const showError = (message) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000
      })
    }

    watch(() => userForm.value.name, () => {
      if (formErrors.value.name) delete formErrors.value.name
    })

    watch(() => userForm.value.email, () => {
      if (formErrors.value.email) delete formErrors.value.email
    })

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      loading,
      error,
      searchQuery,
      editingUser,
      showDeleteModal,
      userForm,
      formErrors,
      filteredUsers,
      avgAge,
      fetchUsers,
      createUser,
      editUser,
      updateUser,
      confirmDelete,
      deleteUser,
      cancelEdit,
      resetForm,
      closeModal,
      getInitials,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.home {
  padding: 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: $primary-color;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
  }

  .subtitle {
    color: $text-secondary;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  box-shadow: 0 5px 15px rgba($primary-color, 0.2);

  .stat-icon {
    font-size: 2.5rem;
  }

  .stat-info {
    h3 {
      font-size: 2rem;
      margin: 0;
    }

    p {
      margin: 0;
      opacity: 0.9;
    }
  }
}

.content-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.form-section {
  h2 {
    color: $primary-color;
    margin-bottom: 1rem;
  }
}

.form-card {
  background: $bg-light;
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid $border-color;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: $text-color;

    &::after {
      content: ' *';
      color: $danger-color;
      opacity: 0.7;
    }

    &:has(+ input:optional)::after {
      content: '';
    }
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid $border-color;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
    }

    &.error {
      border-color: $danger-color;
      background: rgba($danger-color, 0.05);
    }
  }

  .error-message {
    color: $danger-color;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.users-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    h2 {
      color: $primary-color;
      margin: 0;
    }
  }
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid $border-color;
  border-radius: 5px;
  font-size: 1rem;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: $primary-color;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &-primary {
    background: $primary-color;
    color: white;

    &:hover:not(:disabled) {
      background: darken($primary-color, 10%);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba($primary-color, 0.3);
    }
  }

  &-secondary {
    background: $secondary-color;
    color: white;

    &:hover:not(:disabled) {
      background: darken($secondary-color, 10%);
    }
  }

  &-outline {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover:not(:disabled) {
      background: $primary-color;
      color: white;
    }
  }

  &-danger {
    background: $danger-color;
    color: white;

    &:hover:not(:disabled) {
      background: darken($danger-color, 10%);
    }
  }

  &-icon {
    padding: 0.75rem;
    font-size: 1.2rem;
    background: transparent;
    color: $text-color;

    &:hover {
      color: $primary-color;
      background: rgba($primary-color, 0.1);
    }
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid rgba($primary-color, 0.3);
  border-radius: 50%;
  border-top-color: $primary-color;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: $text-secondary;
}

.error-container {
  text-align: center;
  padding: 3rem;
  color: $danger-color;

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    color: $text-color;
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: $text-secondary;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: $text-color;
  }
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border: 2px solid $border-color;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: $primary-color;
  }

  &.editing {
    border-color: $warning-color;
    background: rgba($warning-color, 0.05);
  }
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;

  h3 {
    margin: 0 0 0.5rem;
    color: $text-color;
  }

  p {
    margin: 0.25rem 0;
    color: $text-secondary;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      opacity: 0.7;
    }
  }
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &-edit {
    background: rgba($warning-color, 0.1);
    color: $warning-color;

    &:hover {
      background: $warning-color;
      color: white;
    }
  }

  &-delete {
    background: rgba($danger-color, 0.1);
    color: $danger-color;

    &:hover {
      background: $danger-color;
      color: white;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  animation: modalSlide 0.3s ease;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid $border-color;

    h3 {
      margin: 0;
      color: $text-color;
    }
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $text-secondary;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .modal-body {
    padding: 1.5rem;
    color: $text-color;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid $border-color;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }

  .stat-card {
    min-width: 150px;
    padding: 1rem;

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info h3 {
      font-size: 1.5rem;
    }
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>