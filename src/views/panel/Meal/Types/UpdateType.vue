<template>
  <div class="card border-success mb-4">
    <div class="card-header">Update Meal Type</div>
    <form method="post" @submit.prevent="updateMealType">
      <div class="card-body">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="title"
            label="Title..."
            v-model="meal_type.title"
            required
            autofocus
            autocomplete="off"
          />
          <label for="title">Title</label>
        </div>

        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="description"
            v-model="meal_type.description"
            label="Description..."
            autocomplete="off"
          ></textarea>
          <label for="description">Description</label>
        </div>

        <div class="border rounded px-1">
          <div class="form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="meal_type.has_documents"
              id="has_documents"
            />
            <label class="form-check-label" for="has_documents"
              >Has Documents?</label
            >
          </div>
        </div>
      </div>

      <div class="card-footer text-end">
        <button
          class="btn btn-secondary text-white"
          @click.prevent="$router.go(-1)"
        >
          Go back</button
        >&nbsp;
        <button class="btn btn-outline-success" type="submit">{{ $t('Save') }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UpdateType',
  data: () => ({
    meal_type: {},
  }),
  methods: {
    updateMealType: async function () {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Click confirm to update, this action is irreversible'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(`/meal_types/${this.meal_type.id}`, this.meal_type)
            .then(() => {
              this.$router.push({ name: 'Types' })
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              })
            })
        }
      })
    },
  },
  async mounted() {
    const meal_type_id = this.$decrypt(this.$route.params.id)
    await this.$axios
      .get(`/meal_types/${meal_type_id}`)
      .then((response) => (this.meal_type = response.data))
  },
}
</script>
