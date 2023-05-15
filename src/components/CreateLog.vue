<template>
  <div class="border-success mb-4 mt-4">
    <div class="card-header mb-2">{{ $t('Create Log') }}</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-3">
          <select
            id="model_type"
            class="form-control"
            v-model="log.model_type"
            @change="getIds"
            required
          >
            <option v-for="(model, key) in model_types" :value="key">
              {{ model.key }}
            </option>
          </select>
          <label for="model_type">{{ $t('Model Type') }}</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="model_id"
            class="form-control"
            v-model="log.model_id"
            required
          >
            <option v-for="model in model_ids" :value="model.id">
              {{ model.label }}
            </option>
          </select>

          <label for="model_id"> {{ $t('Model name') }} </label>
        </div>

        <div class="form-floating mb-3">
          <input class="form-control" type="text" v-model="log.role" />
          <label for="role">{{ $t('Input text') }}</label>
          <div class="invalid-feedback"></div>
        </div>
      </div>

      <div class="card-footer text-end">
        <button type="submit" class="btn btn-outline-success">{{ $t('Save') }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateLog',
  props: ['service_commit_id'],
  emits: ['created'],
  data() {
    return {
      log: {},
      model_types: [],
      model_ids: [],
    }
  },
  methods: {
    create() {
      this.log.service_commit_id = this.service_commit_id
      this.$axios.post('/service_commit_log', this.log).then(() => {
        this.log = {}
         swal(this.$i18n.t("The task added successfully"), {
            icon: "success",
            timer: 3000,
          });
        this.$emit('created')
      })
    },
    getIds() {
      this.$axios
        .get('/ids_by_type/' + this.log.model_type)
        .then((response) => (this.model_ids = response.data))
    },
  },
  mounted() {
    this.$axios
      .get('/model_types')
      .then((response) => (this.model_types = response.data))
  },
}
</script>
