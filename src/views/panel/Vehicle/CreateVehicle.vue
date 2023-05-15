<template>
  <form class="card border-success mb-4" @submit.prevent="create">
    <div class="card-header">{{ $t("Create vehicle") }}</div>
    <div class="card-body">
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="model"
          required
          autofocus
          autocomplete="off"
          v-model="vehicle.model"
        />

        <label for="model">{{ $t('Model') }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          v-model="vehicle.manufacturer"
          class="form-control"
          id="manufactory"
          required
          autocomplete="off"
        />
        <label for="manufactory">{{ $t('Manufacturer') }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          v-model="vehicle.year"
          id="year"
          required
          autocomplete="off"
        />
        <label for="year">{{ $t('Year') }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="registration"
          required
          autocomplete="off"
          v-model="vehicle.registration"
        />
        <label for="registration">{{ $t('Registration') }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="badge"
          v-model="vehicle.badge"
          required
          autocomplete="off"
        />
        <label for="badge">{{ $t('Badge') }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="number"
          min="1"
          max="2147483647"
          step="1"
          class="form-control"
          id="passengers"
          v-model="vehicle.passengers"
          autocomplete="off"
        />
        <label for="passengers">{{ $t('Passengers') }}</label>
      </div>
    </div>
    <CRow v-if="error_message">
      <CCol :md="12">
        <div class="error_style">
          {{ error_message }}
        </div>
      </CCol>
    </CRow>
    <div class="card-footer text-end">
      <button class="btn btn-success text-white" type="submit">
        {{ $t("Save") }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "CreateVehicle",
  data: () => ({
    error_message: "",
    vehicle: {},
  }),
  methods: {
    create: async function () {
      await this.$axios
        .post(`/vehicles/add`, this.vehicle)
        .then(() => {
          swal(this.$i18n.t("Vehicle has been created successfully"), {
            icon: "success",
            timer: 3000,
          });
          this.$router.push({ name: "Vehicles" })
        })
        .catch(
          (error) =>
            (this.error_message =
              error.response?.data.message || error.message),
        )
    },
  },
};
</script>
