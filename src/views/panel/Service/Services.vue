<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>
          <CCardTitle>{{ $t("Services") }}</CCardTitle>
          <router-link
            :to="{ name: 'Create service' }"
            v-if="$can('services.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="create-outline"></ion-icon>&nbsp;
              {{ $t("Create service") }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Title")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("City")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Before date")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Exact date")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("After date")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="service in services" :key="service.id">
                <CTableDataCell>{{ service.title }}</CTableDataCell>
                <CTableDataCell>{{ service.city?.title }}</CTableDataCell>
                <CTableDataCell>{{ service.before_date }}</CTableDataCell>
                <CTableDataCell>{{ service.exact_date }}</CTableDataCell>
                <CTableDataCell>{{ service.after_date }}</CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                  <button
                    class="btn btn-sm btn-info text-white"
                    @click.stop="fetchServiceInfo(service.id)"
                    v-if="$can('services.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update service',
                      params: { id: this.$encrypt(service.id) },
                    }"
                    v-if="$can('services.edit')"
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
                    @click.stop="deleteService(service.id)"
                    :title="$t('Delete')"
                    v-if="$can('services.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Services navigation">
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="{ active: page.active }"
                    v-for="page in pagination"
                    :key="page"
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
    :visible="showServiceDetailModal"
    @close="showServiceDetailModal = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>Service Information</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>City</CTableHeaderCell>
              <CTableDataCell>{{
                cities.filter((city) => city.id === service.city_id)[0].title
              }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableDataCell>{{ service.title }}</CTableDataCell>
              <CTableHeaderCell>After date:</CTableHeaderCell>
              <CTableDataCell>{{ service.after_date }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Before date:</CTableHeaderCell>
              <CTableDataCell>{{ service.before_date }}</CTableDataCell>
              <CTableHeaderCell>Exact date:</CTableHeaderCell>
              <CTableDataCell>{{ service.exact_date }}</CTableDataCell>
            </CTableRow>
          </CTable>
        </CCol>
      </CRow>
      <Concurrable
        v-if="service.is_concurrable"
        type="service"
        :id="service.id"
      />
    </CModalBody>
  </CModal>
</template>

<script>
import cities from "@/store/cities";

export default {
  name: "Services",
  data: () => ({
    services: [],
    current_page: 1,
    pagination: {},
    last_page: 99,
    showServiceDetailModal: false,
    service: {},
    cities: [],
  }),
  methods: {
    deleteService: async function (id) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/services/${id}`).then(() => {
            this.services.splice(
              this.services.findIndex((service) => service.id === id),
              1
            );
          });
          swal(this.$i18n.t("Service has been deleted!"), {
            icon: "success",
            timer: 3000,
          });
        }
      });
    },
    gotoPage: async function (url) {
      await this.$axios.get(url).then((response) => {
        this.services = response.data.data;
        this.current_page = response.data.current_page;
        this.last_page = response.data.last_page;
        this.pagination = response.data.links;
      });
    },
    fetchServiceInfo: async function (id) {
      await this.$axios.get(`/services/${id}`).then((response) => {
        this.service = response.data;
        this.showServiceDetailModal = true;
      });
    },
  },
  async mounted() {
    await this.$axios.get("/services").then((response) => {
      this.services = response.data.data;
      this.current_page = response.data.current_page;
      this.last_page = response.data.last_page;
      this.pagination = response.data.links;
    });
    cities.fetchCities().then((cities) => {
      this.cities = cities;
    });
  },
};
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
