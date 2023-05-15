<template>
  <div class="card border-success mb-4">
    <div class="card-header">{{ $t('Create service') }}</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="service.title"
            required
            autofocus
            autocomplete="off"
          />
          <label for="title">{{ $t('Title') }} *</label>
        </div>
        <div class="form-floating mb-3">
          <select
            class="form-select"
            id="city"
            :aria-label="$t('Choose city')"
            v-model="service.city_id"
            required
          >
            <option>{{ $t('Choose city') }}</option>
            <option v-for="city in cities" :value="city.id" :key="city.id">
              {{ city.title }}
            </option>
          </select>
          <label for="city">{{ $t('City') }} *</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="date"
            class="form-control"
            id="before_date"
            v-model="service.before_date"
          />
          <label for="before_date">{{ $t('Before date') }}</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="date"
            class="form-control"
            id="exact_date"
            v-model="service.exact_date"
          />
          <label for="exact_date">{{ $t('Exact date') }}</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="date"
            class="form-control"
            id="after_date"
            v-model="service.after_date"
          />
          <label for="after_date">{{ $t('After date') }}</label>
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
        <span class="float-start">* {{ $t('Required fields') }}</span>
        <button type="submit" class="btn btn-success text-white">{{ $t('Create') }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateService',
  data: () => ({
    error_message: '',
    service: {},
    cities: [],
  }),
  methods: {
    create: async function () {
      await this.$axios
        .post('/services', this.service)
        .then(() => this.$router.push({ name: 'Services' }))
        .catch((error) => {
          if (error.response) {
            this.error_message = error.response.data.message
          } else {
            this.error_message = error.message
          }
        })
    },
  },
  mounted() {
    this.$axios.get('/cities').then((response) => (this.cities = response.data))
  },
}
</script>
