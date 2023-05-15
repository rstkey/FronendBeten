<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Types') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create type' }"
            v-if="$can('types.create')"
          >
            <CButton color="success" class="float-end text-white">
              &nbsp;{{ $t('Create type') }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Title') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Description') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Has documents') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Actions') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="meal_type in meal_types" :key="meal_type.id">
                <CTableDataCell>{{ meal_type.title }}</CTableDataCell>
                <CTableDataCell>{{ meal_type.description }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="meal_type.has_documents ? 'success' : 'warning'"
                    shape="rounded-pill"
                    >{{ meal_type.has_documents ? $t('Yes') : $t('No') }}</CBadge
                  >
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white"
                    @click.stop="fetchMealTypeInfo(meal_type.id)"
                    v-if="$can('types.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Edit Meal Type',
                      params: { id: this.$encrypt(meal_type.id) },
                    }"
                    v-if="$can('types.edit')"
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
                    class="btn btn-sm btn-danger text-white"
                    @click.stop="deleteMealType(meal_type.id)"
                    :title="$t('Delete')"
                    v-if="$can('types.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <CRow>
            <CCol :md="12" class="text-center">
              <nav :aria-label="$t('Meal types navigation')">
                <ul class="pagination">
                  <li
                    class="page-item"
                    v-for="page in pagination"
                    :key="page"
                    :class="{ active: page.active }"
                  >
                    <a
                      @click.prevent="gotoPage(page.url)"
                      class="page-link"
                      v-html="page.label"
                      :class="{ disabled: !page.url }"
                    ></a>
                  </li>
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
    :visible="showMealTypeDetailModal"
    @close="showMealTypeDetailModal = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t('Meal Type Information') }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>{{ $t('Title') }}</CTableHeaderCell>
              <CTableDataCell>{{ meal_type.title }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t('Description') }}</CTableHeaderCell>
              <CTableDataCell>{{ meal_type.description }}</CTableDataCell>
              <CTableHeaderCell>{{ $t('Has documents') }}</CTableHeaderCell>
              <CTableDataCell>
                <CBadge
                  :color="meal_type.has_documents ? 'success' : 'warning'"
                  shape="rounded-pill"
                  >{{ meal_type.has_documents ? $t('Yes') : $t('No') }}</CBadge
                >
              </CTableDataCell>
            </CTableRow>
          </CTable>
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
export default {
  name: 'Types',
  data: () => ({
    meal_types: [],
    pagination: [],
    showMealTypeDetailModal: false,
    meal_type: {},
  }),
  methods: {
    gotoPage: async function (url) {
      await this.$axios.get(url).then((response) => {
        this.meal_types = response.data.data
        this.pagination = response.data.links
      })
    },
    fetchMealTypeInfo: async function (id) {
      await this.$axios.get(`/meal_types/${id}`).then((response) => {
        this.meal_type = response.data
        this.showMealTypeDetailModal = true
      })
    },
    deleteMealType: async function (id) {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Once deleted, you will not be able to recover!'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/meal_types/${id}`).then(() => {
            this.meal_types = this.meal_types.filter(
              (meal_type) => meal_type.id !== id,
            )
          })
          swal(this.$i18n.t('Meal Type has been deleted!'), {
            icon: 'success',
          })
        }
      })
    },
  },
  async mounted() {
    await this.$axios.get('/meal_types').then((response) => {
      this.meal_types = response.data.data
      this.pagination = response.data.links
    })
  },
}
</script>

<style scoped>
.page-item {
  cursor: pointer;
}
a.disabled {
  pointer-events: none;
  cursor: default;
}
</style>
