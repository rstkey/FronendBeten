<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Hospitalities') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create hospitality' }"
            v-if="$can('hospitalities.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="happy-outline"></ion-icon>&nbsp;
              {{ $t('Create hospitality') }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t('Loading...') }}</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading" responsive hover align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Title') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Description') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Required') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Quantity') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Received by') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Actions') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow
                v-for="hospitality in hospitalities"
                :key="hospitality.id"
              >
                <CTableDataCell>{{ hospitality.title }}</CTableDataCell>
                <CTableDataCell>{{ hospitality.description }}</CTableDataCell>
                <CTableDataCell>{{ hospitality.required_date }}</CTableDataCell>
                <CTableDataCell>{{ hospitality.quantity }}</CTableDataCell>
                <CTableDataCell>
                  {{ hospitality.receiver?.fullname }}
                </CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="fetchHospitalityInfo(hospitality.id)"
                    v-if="$can('hospitalities.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update Hospitality',
                      params: { id: this.$encrypt(hospitality.id) },
                    }"
                    v-if="$can('hospitalities.edit')"
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
                    @click="deleteHospitality(hospitality.id)"
                    :title="$t('Delete')"
                    v-if="$can('hospitalities.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Page navigation example">
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
    :visible="is_hospitality_modal_visible"
    @close="is_hospitality_modal_visible = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>Hospitality Information</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableDataCell>{{ hospitality.description }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Required</CTableHeaderCell>
              <CTableDataCell>{{ hospitality.required_date }}</CTableDataCell>
              <CTableHeaderCell>Quantity</CTableHeaderCell>
              <CTableDataCell>{{ hospitality.quantity }}</CTableDataCell>
              <CTableHeaderCell>Received by</CTableHeaderCell>
              <CTableDataCell>
                {{ hospitality.receiver?.fullname }}
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
  name: 'Hospitalities',
  data: () => ({
    hospitalities: [],
    loading: false,
    pagination: [],
    is_hospitality_modal_visible: false,
    hospitality: {},
  }),
  methods: {
    fetchHospitalityInfo: async function (id) {
      await this.$axios.get(`/hospitalities/${id}`).then((response) => {
        this.hospitality = response.data
        this.is_hospitality_modal_visible = true
      })
    },
    async deleteHospitality(id) {
      await this.$axios
        .delete(`/hospitalities/${id}`)
        .then(() => {
          this.hospitalities = this.hospitalities.filter(
            (hospitality) => hospitality.id !== id,
          )
        })
        .catch((error) => {
          swal({
            title: error.response.statusText,
            text: error.response.data.message,
            icon: 'error',
          })
        })
    },
    async gotoPage(url) {
      this.loading = true
      await this.$axios.get(url).then((response) => {
        this.hospitalities = response.data.data
        this.pagination = response.data.links
      })
      this.loading = false
    },
  },
  async mounted() {
    this.loading = true
    await this.$axios
      .get('/hospitalities')
      .then((response) => {
        this.hospitalities = response.data.data
        this.pagination = response.data.links
        this.loading = false
      })
      .catch((error) => {
        swal({
          title: error.response.statusText,
          text: error.response.data.message,
          icon: 'error',
        })
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
