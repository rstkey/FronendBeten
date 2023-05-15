import axiosInstance from '@/plugins/axios'

async function fetchCities() {
  const response = await axiosInstance.get('/cities')
  return response.data
}

export default {
  fetchCities,
}
