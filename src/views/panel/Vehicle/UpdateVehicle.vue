<template>
  <form class="card border-warning mb-4" @submit.prevent="update">
    <div class="card-header">{{ $t("Update Vehicle") }}</div>
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
        <label for="passengers">{{ $t("Passengers") }}</label>
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
      <button
        class="btn btn-secondary text-white"
        @click.prevent="$router.go(-1)"
      >
        {{ $t("Go back") }}</button
      >&nbsp;
      <button class="btn btn-warning text-white">
        <ion-icon name="save-outline"></ion-icon>&nbsp;{{ $t("Save") }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "UpdateVehicle",
  data: () => ({
    error_message: "",
    vehicle: {},
  }),
  methods: {
    update: async function () {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t(
          "Click confirm to update, this action is irreversible"
        ),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .post(
              `/vehicles/update/${this.$decrypt(this.$route.params.id)}`,
              this.vehicle
            )
            .then(() => {
              this.$router.push({ name: "Vehicles" });
              swal(this.$i18n.t("Updated successfully!"), {
                icon: "success",
                timer: 3000,
              });
            })
            .catch(
              (error) =>
                (this.error_message =
                  error.response?.data.message || error.message),
            )
        }
      });
    },
  },
  mounted: async function () {
    await this.$axios
      .get(`/vehicles/info/${this.$decrypt(this.$route.params.id)}`)
      .then((response) => (this.vehicle = response.data));
  },
};
</script>
