<template>
  <div class="card border-success mb-4">
    <div class="card-header">{{ $t('Create phase') }}</div>
    <div class="row mt-4">
      <div class="col-12">
        <form @submit.prevent="create">
          <div class="card-body">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="phase.title"
                autocomplete="off"
                required
                autofocus
              />
              <label for="title">{{ $t('Title') }}</label>
            </div>
            <div class="border rounded px-1">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_required"
                  v-model="phase.is_required"
                />
                <label class="form-check-label" for="is_required">
                  {{ $t('is required?') }}
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col-12 text-center">
        <h6>{{ $t('Move services from left side to right side to assign') }}</h6>
        <div class="row ms-0 p-4" v-if="available_services.length !== 0">
          <!-- Left side -->
          <div class="col-6 p-3">
            <h6>{{ available_services.length }} {{ $t('Available services') }}</h6>
            <div
              class="row mt-3 no-bars ms-0 border-dark"
              style="height: 300px; overflow: scroll"
            >
              <div
                class="row border p-2 mb-2 ms-0"
                v-for="service in available_services"
                :key="service.id"
              >
                <div class="col-8">
                  <h6>{{ service.title }}</h6>
                </div>
                <div class="col-4">
                  <button
                    class="btn btn-primary"
                    @click="addService(service.id)"
                  >
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Right side -->
          <div
            class="col-6 p-3 no-bars"
            style="height: 300px; overflow: scroll"
          >
            <h6>{{ phase.services.length }} {{ $t('Assigned services') }}</h6>
            <div
              class="row mt-3 border p-2 mb-2"
              v-for="service_id in phase.services"
              :key="service_id"
            >
              <div class="col-8">
                <h6>{{ service_titles[service_id] }}</h6>
              </div>
              <div class="col-2">
                <button
                  class="btn btn-primary"
                  @click="removeService(service_id)"
                >
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </button>
              </div>
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
      <button
        @click="create"
        :disabled="phase.services.length === 0 || phase.title === ''"
        class="btn btn-success text-white"
      >
        {{ $t('Create phase') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreatePhase',
  data: () => ({
    error_message: '',
    service_titles: [],
    available_services: [],
    phase: {
      title: '',
      is_required: true,
      services: [],
    },
  }),
  methods: {
    async addService(service_id) {
      // If service ID is not already added to the phase
      if (!this.phase.services.includes(service_id)) {
        // Push to front of array
        this.phase.services.unshift(service_id)
        // We can get the title from the available services
        this.service_titles[service_id] = this.available_services.find(
          (service) => service.id === service_id,
        ).title
      }
      // Remove the newly added service from the available services
      // Even if service is already in the phase's list of services, obvio
      this.available_services = this.available_services.filter(
        (service) => service.id !== service_id,
      )
    },
    removeService(service_id) {
      // If phase's list of services includes the service ID to remove
      if (this.phase.services.includes(service_id)) {
        const index = this.phase.services.indexOf(service_id)
        // 2nd parameter means remove one item only
        this.phase.services.splice(index, 1)
        // Add the removed service back to the available services
        const title = this.service_titles[service_id]
        // TODO: should be put back at the same index where it was
        this.available_services.unshift({ id: service_id, title: title })
      }
    },
    async create() {
      await this.$axios
        .post('/phases', this.phase)
        // Redirect back to the list of phases after creation
        .then(() => this.$router.push({ name: 'Phases' }))
        .catch((error) => {
          if (error.response) {
            this.error_message = error.response.data.message
          } else {
            this.error_message = error.message
          }
        })
    },
  },
  async mounted() {
    await this.$axios
      .get('/phases/create')
      .then((response) => (this.available_services = response.data))
  },
}
</script>

<style scoped="scoped">
.no-bars {
  overflow-y: scroll;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
}

.no-bars::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
</style>
