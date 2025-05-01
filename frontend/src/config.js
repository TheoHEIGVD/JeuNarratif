export const config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || '',
    API_URL: import.meta.env.VITE_API_URL || '/api',
    API_TIMEOUT: 30000, // 30 secondes
    AUTH_STORAGE_KEY: 'token'
}

export default config 