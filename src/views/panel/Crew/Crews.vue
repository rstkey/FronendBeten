<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <div class="row">
            <div class="col-md-8 col-sm-4">
              <h3 class="mt-1">{{ $t("Crew members") }}</h3>
            </div>
            <div class="col-md-4 col-sm-8" v-if="$can('crews.create')">
              <router-link :to="{ name: 'Create crew' }">
                <CButton color="success" class="float-end text-white">
                  <ion-icon name="person-add-outline"></ion-icon>&nbsp;
                  <span>{{ $t("Create crew") }}</span>
                </CButton>
              </router-link>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="2" :sm="6">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.fullname"
                :placeholder="$t('Fullname')"
                @keyup="filter(search.fullname, $event)"
              />
            </CCol>
            <CCol :md="2">
              <select
                class="form-control mb-3"
                v-model="search.country"
                @change="getCrews()"
              >
                <option selected value="">{{ $t("Choose country") }}</option>
                <template v-for="country in countries" :key="country.id">
                  <option :value="country.id">{{ $t(country.title) }}</option>
                </template>
              </select>
            </CCol>
            <CCol :md="2" :sm="6">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.phone"
                :placeholder="$t('Phone')"
                @keyup="filter(search.phone, $event)"
              />
            </CCol>
            <CCol :md="2" :sm="6">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.id_number"
                :placeholder="$t('ID number')"
                @keyup="filter(search.id_number, $event)"
              />
            </CCol>
          </CRow>
          <hr />
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">Loading...</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading" responsive hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Fullname")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Country")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Phone")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("ID type")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("ID number")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Active")
                }}</CTableHeaderCell>
                <CTableHeaderCell style="width: 10%" :aria-colspan="2">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="crew in crews" :key="crew.id">
                <CTableDataCell>{{ crew.fullname }}</CTableDataCell>
                <CTableDataCell>{{ $t(crew.country?.title) }}</CTableDataCell>
                <CTableDataCell>{{ crew.phone }}</CTableDataCell>
                <CTableDataCell>{{ crew.id_type }}</CTableDataCell>
                <CTableDataCell>{{ crew.id_number }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="crew.is_active ? 'success' : 'warning'"
                    shape="rounded-pill"
                    >{{ crew.is_active ? $t("Yes") : $t("No") }}</CBadge
                  >
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(crew.id)"
                    v-if="$can('crews.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update crew',
                      params: { id: this.$encrypt(crew.id) },
                    }"
                    v-if="$can('crews.edit')"
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
                    @click.stop="deleteCrew(crew.id)"
                    :title="$t('Delete')"
                    v-if="$can('crews.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Groups navigation">
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
    :visible="is_crew_member_modal_visible"
    @close="is_crew_member_modal_visible = false"
    class="modal-popup-detail"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Crew Member Details") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable class="table table-responsive">
        <CTableRow class="mt-3" colspan>
          <CTableHeaderCell>{{ $t("Fullname") }}:</CTableHeaderCell>
          <CTableDataCell>{{ crew_member.fullname }}</CTableDataCell>
        </CTableRow>

        <CTableRow class="mt-3">
          <CTableHeaderCell>{{ $t("Gender") }}:</CTableHeaderCell>
          <CTableDataCell>
            {{ $t(crew_member.gender) }}
          </CTableDataCell>
          <CTableHeaderCell>{{ $t("Profession") }}:</CTableHeaderCell>
          <CTableDataCell>{{ crew_member.profession_id }}</CTableDataCell>
        </CTableRow>

        <CTableRow class="mt-3">
          <CTableHeaderCell>{{ $t("Country") }}:</CTableHeaderCell>
          <CTableDataCell>{{
            $t(countries[crew_member.country_id].title)
          }}</CTableDataCell>
          <CTableHeaderCell>{{ $t("Phone") }}:</CTableHeaderCell>
          <CTableDataCell>{{ crew_member.phone }}</CTableDataCell>
        </CTableRow>

        <CTableRow class="mt-3">
          <CTableHeaderCell>{{ $t("ID type") }}:</CTableHeaderCell>
          <CTableDataCell>{{ crew_member.id_type }}</CTableDataCell>
          <CTableHeaderCell>{{ $t("Active") }}:</CTableHeaderCell>
          <CTableDataCell>
            <CBadge
              :color="crew_member.is_active ? 'success' : 'warning'"
              shape="rounded-pill"
              >{{ crew_member.is_active ? "Yes" : "No" }}</CBadge
            >
          </CTableDataCell>
        </CTableRow>
      </CTable>
      <Contractable type="crew" :id="crew_member.id" />
      <Documentable type="crew" :id="crew_member.id" />
    </CModalBody>
  </CModal>
</template>

<script>
import { debounce } from "@/utils/helper";
import countries from "@/store/countries";

export default {
  name: "CrewMembers",
  data: () => ({
    debounceFn: null,
    countries: [],
    crews: [],
    search: {
      country: "",
    },
    loading: false,
    pagination: [],
    crew_member: {},
    is_crew_member_modal_visible: false,
  }),
  methods: {
    getCrews: async function (reset = false) {
      this.loading = true;
      await this.$axios
        .get("/crews", {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.crews = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getCrews(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    gotoPage: async function (url) {
      this.loading = true;
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.crews = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    deleteCrew: async function (id) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/crews/${id}`).then(() => {
            this.crews.splice(
              this.crews.findIndex((crew) => crew.id === id),
              1
            );
          });
          swal("Crew member has been deleted!", {
            icon: "success",
          });
        }
      });
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/crews/${id}`).then((response) => {
        this.crew_member = response.data;
        this.is_crew_member_modal_visible = true;
      });
    },
  },
  mounted: async function () {
    this.debounceFn = debounce(() => this.getCrews(), 500);
    countries.fetchCountries().then((countries) => {
      this.countries = countries;
    });
    await this.getCrews();
  },
};
</script>
