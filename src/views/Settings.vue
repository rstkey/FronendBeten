<template>
  <form class="card border-warning" @submit.prevent="update">
    <div class="card-header">{{ $t('Settings') }}</div>
    <div class="card-body">
      <div class="form-floating mb-2" v-for="setting in settings">
        <input
          type="text"
          class="form-control"
          :id="setting.key"
          autocomplete="off"
          v-model="setting.value"
        />
        <label :for="setting.key">{{ $t(setting.key) }}</label>
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
      <button type="submit" class="btn btn-warning text-white">
        <ion-icon name="save-outline"></ion-icon>&nbsp;{{ $t('Save') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Settings',
  data: () => ({
    error_message: '',
    settings: [],
  }),
  methods: {
    update: async function () {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Click confirm to update, this action is irreversible'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(`/settings`, this.settings)
            .then(() => {
              this.$router.push({ name: 'Dashboard' })
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              })
            })
            .catch((error) => {
              if (error.response) {
                this.message = error.response.data.message
              } else {
                this.message = error.message
              }
              this.success = false
            })
        }
      })
    },
  },
  mounted: async function () {
    await this.$axios.get(`/settings`).then((response) => {
      this.settings = response.data
    })
  },
}
</script>
