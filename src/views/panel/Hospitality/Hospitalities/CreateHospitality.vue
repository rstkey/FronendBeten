<template>
  <div class="card border-success mb-4">
    <div class="card-header">Create a hospitality</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="title"
            required
            autofocus
            autocomplete="off"
            v-model="hospitality.title"
            :disabled="disabled"
          />
          <label for="title">Title *</label>
        </div>

        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="description"
            required
            autocomplete="off"
            v-model="hospitality.description"
            :disabled="disabled"
          ></textarea>
          <label for="description">Description *</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="date"
            class="form-control"
            id="required_date"
            required
            v-model="hospitality.required_date"
            :disabled="disabled"
          />
          <label for="required_date">Required date *</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            min="1"
            class="form-control"
            id="quantity"
            required
            autocomplete="off"
            step=".01"
            v-model="hospitality.quantity"
            :disabled="disabled"
          />
          <label for="quantity">Quantity *</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="received_by"
            class="form-select"
            required
            v-model="hospitality.received_by"
            :disabled="disabled"
          >
            <option
              v-for="receiver in receivers"
              :value="receiver.id"
              :key="receiver.id"
            >
              {{ receiver.fullname }}
            </option>
          </select>
          <label for="received_by">Received by *</label>
        </div>

        <div class="form-floating mb-3">
          <textarea
            id="extra"
            class="form-control"
            v-model="hospitality.extra"
            :disabled="disabled"
          ></textarea>
          <label for="extra">Extra information about the hospitality</label>
        </div>

        <CRow>
          <CCol :md="12">
            <div
              v-show="message"
              class="alert"
              :class="{ 'alert-success': success, error_style: !success }"
            >
              {{ message }}
            </div>
            <div v-show="receivers.length === 0" class="alert alert-warning">
              There are no crew members to receive hospitalities, please
              <router-link :to="{ name: 'Create crew' }"
                >create one</router-link
              >
              first
            </div>
          </CCol>
        </CRow>
      </div>

      <div class="card-footer text-end">
        <span class="float-start">* Required fields</span>
        <button
          class="btn btn-success text-white"
          type="submit"
          :disabled="disabled"
        >
          Create hospitality
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateHospitality',
  data: () => ({
    message: '',
    success: false,
    hospitality: {},
    receivers: [],
    disabled: false,
  }),
  methods: {
    create() {
      this.$axios
        .post('/hospitalities', this.hospitality)
        .then((response) => {
          if (response.status < 201) {
            this.$router.push({ name: 'Hospitalities' })
          } else {
            this.message = response.data.message
            this.success = false
          }
        })
        .catch((error) => {
          if (error.response) {
            this.message = error.response.data.message
          } else {
            this.message = error.message
          }
          this.success = false
        })
    },
  },
  async mounted() {
    await this.$axios.get('/hospitalities/create').then((response) => {
      if (response.data.length === 0) {
        this.disabled = true // Disable the entire form
      }
      this.receivers = response.data
    })
  },
}
</script>
