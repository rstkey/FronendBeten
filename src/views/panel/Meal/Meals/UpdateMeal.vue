<template>
  <div class="card border-warning mb-4">
    <div class="card-header">Update Meal</div>
    <form @submit.prevent="update">
      <div class="card-body">
        <div class="form-floating mb-3">
          <model-list-select
            :list="meal_types"
            option-value="id"
            option-text="title"
            v-model="meal.meal_type_id"
            placeholder="Search for a meal type"
            @searchchange="searchMealType"
          >
          </model-list-select>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            min="1"
            id="quantity"
            autocomplete="off"
            v-model="meal.quantity"
            required
          />
          <label for="quantity">Quantity</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="to_model_type"
            autocomplete="off"
            v-model="meal.to_model_type"
            required
          />
          <label for="to_model_type">To Model Type</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            min="1"
            class="form-control"
            id="to_model_id"
            autocomplete="off"
            v-model="meal.to_model_id"
            required
          />
          <label for="to_model_id">To Model ID</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="datetime-local"
            step="1"
            class="form-control"
            id="sent_at"
            placeholder="Sent At..."
            v-model="meal.sent_at"
            required
          />
          <label for="sent_at">Sent At</label>
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
          Go back</button
        >&nbsp;
        <button type="submit" class="btn btn-warning text-white">
          Save
          <ion-icon name="save"></ion-icon>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { debounce } from '@/utils/helper'
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

export default {
  name: 'UpdateMeal',
  components: {
    ModelListSelect,
  },
  data: () => ({
    debounceFn: null,
    meal: {},
    meal_types: [],
    search: {
      per_page: 6,
      title: '',
    },
    error_message: '',
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
            .patch(`/meals/${this.meal.id}`, this.meal)
            .then(() => {
              this.$router.push({ name: 'All meals' })
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
    searchMealType: async function (query) {
      this.search.title = query
      await this.debounceFn()
    },
    getMealTypes: async function () {
      this.$axios
        .get('/meal_types', { params: this.search })
        .then((response) => (this.meal_types = response.data.data))
    },
  },
  async mounted() {
    await this.$axios
      .get(`/meals/${this.$decrypt(this.$route.params.id)}`)
      .then((response) => (this.meal = response.data))
    this.getMealTypes()
    this.debounceFn = debounce(() => this.getMealTypes(), 500)
  },
}
</script>
