<template>
  <div class="card border-warning mb-4">
    <div class="card-header">{{ $t('Update client') }}</div>
    <form @submit.prevent="updateClient">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="fullname"
            type="text"
            autocomplete="off"
            v-model="client.fullname"
            required
            autofocus
          />
          <label for="fullname">{{ $t('Fullname') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select
            class="form-control"
            id="country_id"
            v-model="client.country_id"
            required
          >
            <option>Choose Country</option>
            <option
              :value="country.id"
              v-for="country in countries"
              :key="country.id"
            >
              {{ $t(country.title) }}
            </option>
          </select>
          <label for="country_id">{{ $t('Country') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="id_type"
            type="text"
            v-model="client.id_type"
            required
          />
          <label for="id_type">{{ $t('ID type') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="id_number"
            type="text"
            v-model="client.id_number"
            required
          />
          <label for="id_number">{{ $t('ID number') }}</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="id_name"
            v-model="client.id_name"
            required
          />
          <label for="id_name">{{ $t('ID name') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="gender"
            class="form-control"
            v-model="client.gender"
            required
          >
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

        <div class="border rounded px-1">
          <div class="form-switch">
            <input
              class="form-check-input"
              id="is_handicap"
              type="checkbox"
              :checked="client.is_handicap"
              v-model="client.is_handicap"
            />
            <label class="form-check-label" for="is_handicap">
              &nbsp;{{ $t('is handicap') }}
            </label>
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
        <button
          class="btn btn-secondary text-white"
          @click.prevent="$router.go(-1)"
        >
          {{ $t('Go back') }}</button
        >&nbsp;
        <button type="submit" class="btn text-white btn-warning">
          {{ $t('Save') }}
        </button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: 'UpdateClient',
  data: () => ({
    error_message: '',
    client: {},
    countries: [],
  }),
  methods: {
    updateClient: async function () {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Click confirm to update, this action is irreversible'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(`/clients/${this.client.id}`, this.client)
            .then(() => {
              this.$router.push({ name: 'Clients' })
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              })
            })
            .catch(
              (error) =>
                (this.error_message =
                  error.response?.data.message || error.message),
            )
        }
      })
    },
  },
  mounted: async function () {
    await this.$axios
      .get(`/clients/${this.$decrypt(this.$route.params.id)}/edit`)
      .then((response) => {
        this.client = response.data.client
        this.countries = response.data.countries
      })
  },
}
</script>
