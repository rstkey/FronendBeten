<template>
  <form class="card border-success mb-4" @submit.prevent="create">
    <div class="card-header">{{ $t('Create meal type') }}</div>
    <div class="card-body">
      <div class="form-floating mb-3">
        <input
          type="text"
          minlength="3"
          maxlength="255"
          class="form-control"
          id="title"
          autocomplete="off"
          v-model="meal_type.title"
          required
        />
        <label for="title">{{ $t('Title') }}</label>
      </div>

      <div class="form-floating mb-3">
        <textarea
          class="form-control"
          minlength="5"
          maxlength="255"
          id="description"
          autocomplete="off"
          v-model="meal_type.description"
        ></textarea>
        <label for="description">{{ $t('Description') }}</label>
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
      <button class="btn btn-success text-white" type="submit">
        <ion-icon name="create-outline"></ion-icon>&nbsp;{{ $t("Create") }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "CreateMealType",
  data: () => ({
    error_message: '',
    meal_type: {}
  }),
  methods: {
    create: async function () {
      await this.$axios
        .post('/meal_types', this.meal_type)
        .then(() => this.$router.push({ name: 'Types' }))
        .catch(
          (error) =>
            (this.error_message =
              error.response?.data.message || error.message),
        )
    },
  },
};
</script>
