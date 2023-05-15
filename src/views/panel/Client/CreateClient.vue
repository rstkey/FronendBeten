<template>
  <div class="card border-success mb-4">
    <div class="card-header">{{ $t('Create client') }}</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            id="fullname"
            class="form-control"
            type="text"
            v-model="client.fullname"
            autocomplete="off"
            required
            autofocus
          />
          <label for="fullname">{{ $t('Fullname') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="country"
            class="form-control"
            v-model="client.country_id"
            required
          >
            <option>Choose Country</option>
            <option
              v-for="country in countries"
              :value="country.id"
              :key="country.id"
            >
              {{ $t(country.title) }}
            </option>
          </select>
          <label for="country">{{ $t('Country') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="id_type"
            v-model="client.id_type"
            required
          />
          <label for="id_type">{{ $t('ID type') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="id_number"
            v-model="client.id_number"
          />
          <label for="id_number">{{ $t('ID number') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="id_name"
            v-model="client.id_name"
          />
          <label for="id_name">{{ $t('ID name') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select id="gender" class="form-control" v-model="client.gender">
            <option value="Male">{{ $t('Male') }}</option>
            <option value="Female">{{ $t('Female') }}</option>
          </select>
          <label for="gender">{{ $t('Gender') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="date"
            class="form-control"
            id="dob"
            v-model="client.dob"
          />
          <label for="dob">{{ $t('Date of birth') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="phone"
            v-model="client.phone"
          />
          <label for="phone">{{ $t('Phone') }}</label>
        </div>

        <div class="form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="is_handicap"
            v-model="client.is_handicap"
          />
          <label class="form-check-label" for="is_handicap">
            &nbsp;{{ $t('is handicap') }}
          </label>
        </div>

        <div class="row" v-if="error_message">
          <div class="col" :md="12">
            <div class="error_style">
              {{ error_message }}
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer text-end">
        <button class="btn text-white btn-success" type="submit">
          <ion-icon name="person-add-outline"></ion-icon>&nbsp;{{
            $t('Create')
          }}
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import countries from '@/store/countries'

export default {
  name: 'Create client',
  data: () => ({
    error_message: '',
    client: {
      is_handicap: false,
    },
    countries: [],
  }),
  methods: {
    create: async function () {
      await this.$axios
        .post('/clients', this.client)
        .then(() => this.$router.push({ name: 'Clients' }))
        .catch(
          (error) =>
            (this.error_message =
              error.response?.data.message || error.message),
        )
    },
  },
  mounted: async function () {
    await countries
      .fetchCountries()
      .then((countries) => (this.countries = countries))
  },
}
</script>
