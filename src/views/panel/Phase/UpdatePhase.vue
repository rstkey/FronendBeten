<template>
  <form class="card border-warning mb-4" @submit.prevent="update">
    <div class="card-header">{{ $t('Update phase') }}</div>
    <div class="row mt-4">
      <div class="col-12">
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
                :checked="phase.is_required"
              />
              <label class="form-check-label" for="is_required">
                {{ $t('is required?') }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 text-center">
        <h6>{{ $t('Move services from left side to right side to assign') }}</h6>
        <div class="row ms-0 p-4" v-if="available_services.length !== 0">
          <!-- Left side -->
          <div class="col-6 p-3">
            <h6>{{ $t('Available services') }}</h6>
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
            <h6>{{ $t('Assigned services') }}</h6>
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
        class="btn btn-secondary text-white"
        @click.prevent="$router.go(-1)"
      >
        {{ $t('Go back') }}</button
      >&nbsp;
      <button type="submit" class="btn btn-warning text-white">
        {{ $t('Save') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UpdatePhase',
  data: () => ({
    error_message: '',
    service_titles: [],
    available_services: [],
    phase: {},
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
    async update() {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Click confirm to update, this action is irreversible'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(`/phases/${this.phase.id}`, this.phase)
            // Redirect back to the list of phases after creation
            .then(() => {
              this.$router.push({ name: 'Phases' })
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              })
            })
            .catch((error) => {
              if (error.response) {
                this.error_message = error.response.data.message
              } else {
                this.error_message = error.message
              }
            })
        }
      })
    },
  },
  mounted() {
    this.$axios
      .get(`/phases/${this.$decrypt(this.$route.params.id)}`)
      .then((response) => {
        // Services come eager loaded in the phase
        this.phase = response.data
        // services property in the phase object is an array of object
        // We need it to be an array of IDs
        this.phase.services = this.phase.services.map((service) => {
          // We also need to populate the services titles
          this.service_titles[service.id] = service.title
          return service.id
        })
      })
    this.$axios
      // TODO: Implement search of services instead of assigning first 50
      .get('/services')
      // TODO: We only need the ID and title, maybe hit a different API endpoint
      // that selects only those two elements
      .then((response) => (this.available_services = response.data.data))
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
