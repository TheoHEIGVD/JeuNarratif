import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
    // État réactif
  const router = useRouter()
  const user = ref(null) 
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

    // Computed property
  const isAuthenticated = computed(() => !!token.value)

    // Persistance dans localStorage
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  //Login : Connexion utilisateur
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/login', credentials)
      setToken(response.data.token)
      setUser(response.data.user)
      
      router.push('/')
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  //Register : Inscription utilisateur
  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/register', userData)
      setToken(response.data.token)
      setUser(response.data.user)
      
      router.push('/')
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  //Logout : Déconnexion 
  const logout = async () => {
    try {
      loading.value = true
      error.value = null
      
      await api.post('/logout')
      setToken(null)
      setUser(null)
      
      router.push('/login')
    } catch (err) {
      error.value = 'Erreur lors de la déconnexion'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/user')
      setUser(response.data)
    } catch (err) {
      error.value = 'Erreur lors de la récupération des informations utilisateur'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Vérifier l'authentification au chargement
  if (token.value) {
    fetchUser()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  }
}) 