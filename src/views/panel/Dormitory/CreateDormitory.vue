<template>
  <div class="card border-success mb-4">
    <div class="card-header">{{ $t('Create dormitory') }}</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="title"
            autocomplete="off"
            v-model="dormitory.title"
            autofocus
            required
          />
          <label for="title">{{ $t('Place name') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="phones"
            v-model="dormitory.phones"
            autocomplete="off"
            required
          />
          <label for="phones">{{ $t('Phone') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select id="city" class="form-control" v-model="dormitory.city_id">
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.title }}
            </option>
          </select>
          <label for="city">{{ $t('City') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="location"
            v-model="dormitory.location"
            autocomplete="off"
            required
          />
          <label for="location">{{ $t('Location') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="coordinate"
            v-model="dormitory.coordinate"
            autocomplete="off"
          />
          <label for="coordinate">{{ $t('Coordinate') }}</label>
        </div>

        <div class="row g-1 mb-1">
          <div class="col">
            <div class="border rounded px-1">
              <div class="form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  checked
                  id="is_active"
                  v-model="dormitory.is_active"
                />
                <label class="form-check-label" for="is_active"
                  >&nbsp; {{ $t('Active') }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <CRow v-if="error_message">
          <CCol :md="12">
            <div class="error_style">
              {{ error_message }}
            </div>
          </CCol>
        </CRow>
      </div>
      <div class="card-footer text-end">
        <!-- TODO: vee-validate & disable -->
        <button class="btn btn-success text-white" type="submit">
          <ion-icon name="create-outline"></ion-icon>&nbsp; {{ $t('Create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import cities from '@/store/cities'

export default {
  name: 'CreateDormitory',
  data: () => ({
    error_message: '',
    dormitory: {
      is_active: true,
    },
    cities: [],
  }),
  methods: {
    create: async function () {
      await this.$axios
        .post(`/dormitories`, this.dormitory)
        .then(() => this.$router.push({ name: 'Dormitories' }))
        .catch(
          (error) =>
            (this.error_message =
              error.response?.data.message || error.message),
        )
    },
  },
  mounted: async function () {
    await cities.fetchCities().then((cities) => (this.cities = cities))
  },
}
</script>
