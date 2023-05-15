<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t("Meals") }}</CCardTitle>
          <router-link
            :to="{ name: 'Create meal' }"
            v-if="$can('meals.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="fast-food-outline"></ion-icon>&nbsp;
              {{ $t("Create meal") }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Meal Type")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Quantity")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("To Model Type")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("To Model ID")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Sent At")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="meal in meals" :key="meal.id">
                <CTableDataCell>{{ meal.meal_type_id }}</CTableDataCell>
                <CTableDataCell>{{ meal.quantity }}</CTableDataCell>
                <CTableDataCell>{{ meal.to_model_type }}</CTableDataCell>
                <CTableDataCell>{{ meal.to_model_id }}</CTableDataCell>
                <CTableDataCell>{{ meal.sent_at }}</CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(meal.id)"
                    v-if="$can('meals.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update Meal',
                      params: { id: this.$encrypt(meal.id) },
                    }"
                    v-if="$can('meals.edit')"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white m-1"
                      :xl="0"
                      :title="$t('Edit')"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white m-1"
                    @click="deleteMeal(meal.id)"
                    :title="$t('Delete')"
                    v-if="$can('meals.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav :aria-label="$t('Meals pagination')">
                <ul class="pagination">
                  <template v-for="page in pagination" :key="page">
                    <li class="page-item" :class="{ active: page.active }">
                      <a
                        @click.prevent="gotoPage(page.url)"
                        class="page-link"
                        :class="{ disabled: !page.url }"
                        v-html="page.label"
                      ></a>
                    </li>
                  </template>
                </ul>
              </nav>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CModal
    size="md"
    :visible="is_meal_modal_visible"
    @close="is_meal_modal_visible = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Meal Information") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>{{ $t("Meal Type ID") }}</CTableHeaderCell>
              <CTableDataCell>{{ meal.meal_type_id }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("Quantity") }}</CTableHeaderCell>
              <CTableDataCell>{{ meal.quantity }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("To Model Type") }}</CTableHeaderCell>
              <CTableDataCell>{{ meal.to_model_type }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("Sent At") }}</CTableHeaderCell>
              <CTableDataCell>{{ meal.sent_at }}</CTableDataCell>
            </CTableRow>
          </CTable>
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
export default {
  name: "Meals",
  data: () => ({
    debounceFn: null,
    meals: [],
    loading: false,
    pagination: [],
    is_meal_modal_visible: false,
    meal: {}, // Currently shown meal
  }),
  methods: {
    viewDetails: async function (id) {
      await this.$axios
        .get(`/meals/${id}`)
        .then((response) => (this.meal = response.data));
      this.is_meal_modal_visible = true;
    },
    gotoPage: async function (url) {
      this.loading = true;
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.groups = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    deleteMeal: async function (id) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/meals/${id}`).then(
            this.meals.splice(
              this.meals.findIndex((meal) => meal.id === id),
              1
            )
          );
          swal(this.$i18n.t("Meal has been deleted!"), {
            icon: "success",
            timer: 3000,
          });
        }
      });
    },
  },
  mounted: async function () {
    this.loading = true;
    await this.$axios.get("/meals").then((response) => {
      this.meals = response.data.data;
      this.pagination = response.data.links;
      this.loading = false;
    });
  },
};
</script>
