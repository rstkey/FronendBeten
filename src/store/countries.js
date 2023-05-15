import axiosInstance from '@/plugins/axios'

async function fetchCountries() {
  const response = await axiosInstance.get('/countries')
  return response.data
}

export default {
  fetchCountries,
}
