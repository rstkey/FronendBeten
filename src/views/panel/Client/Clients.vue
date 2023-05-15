<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <div class="row">
            <div class="col-md-8 col-sm-4">
              <h3 class="mt-1">{{ $t("Clients") }}</h3>
            </div>
            <div class="col-md-4 col-sm-8" v-if="$can('clients.create')">
              <router-link :to="{ name: 'Create client' }">
                <CButton color="success" class="float-end text-white">
                  <ion-icon name="person-add-outline"></ion-icon>&nbsp;
                  <span>{{ $t("Create client") }}</span>
                </CButton>
              </router-link>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <!-- Start search filters -->
          <CRow>
            <CCol :md="2">
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
                @change="getClients()"
              >
                <option value="" selected>{{ $t("Any country") }}</option>
                <template v-for="country in countries" :key="country.id">
                  <option :value="country.id">{{ $t(country.title) }}</option>
                </template>
              </select>
            </CCol>
            <CCol :md="2">
              <select
                class="form-control mb-3"
                v-model="search.group"
                @change="getClients()"
              >
                <option value="" selected>{{ $t("Any group") }}</option>
                <option value="ungrouped">{{ $t("Ungrouped") }}</option>
                <template v-for="group in groups" :key="group.id">
                  <option :value="group.id">{{ group.title }}</option>
                </template>
              </select>
            </CCol>
            <CCol :md="2">
              <select
                class="form-control mb-3"
                v-model="search.gender"
                @change="getClients()"
              >
                <option value="" selected>{{ $t("Any gender") }}</option>
                <option value="Male">{{ $t("Male") }}</option>
                <option value="Female">{{ $t("Female") }}</option>
              </select>
            </CCol>
            <CCol :md="2">
              <input
                type="number"
                class="form-control mb-3"
                v-model="search.id_number"
                :placeholder="$t('ID number')"
                @keyup="filter(String(search.id_number), $event)"
              />
            </CCol>
          </CRow>
          <hr />
          <!-- End filter -->
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("Loading...") }}</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading" responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  {{ $t("Fullname") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Group") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Country") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("ID type") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("ID number") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("ID name") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Gender") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Date of birth") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Phone") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Actions") }}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="client in clients" :key="client.id">
                <CTableDataCell>{{ client.fullname }}</CTableDataCell>
                <CTableDataCell>{{ client.group }}</CTableDataCell>
                <CTableDataCell>{{ client.country }}</CTableDataCell>
                <CTableDataCell>{{ client.id_type }}</CTableDataCell>
                <CTableDataCell>{{ client.id_number }}</CTableDataCell>
                <CTableDataCell>{{ client.id_name }}</CTableDataCell>
                <CTableDataCell>{{ $t(client.gender) }}</CTableDataCell>
                <CTableDataCell>{{ client.dob }}</CTableDataCell>
                <CTableDataCell>{{ client.phone }}</CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(client.id)"
                    v-if="$can('clients.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update client',
                      params: { id: this.$encrypt(client.id) },
                    }"
                    v-if="$can('clients.edit')"
                    :title="$t('Edit')"
                  >
                    <CButton class="btn btn-sm btn-warning text-white m-1">
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white m-1"
                    @click="deleteClient(client.id, client.fullname)"
                    :title="$t('Delete')"
                    v-if="$can('clients.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Clients navigation">
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
    :visible="is_client_modal_visible"
    @close="is_client_modal_visible = false"
    class="modal-popup-detail"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Client Information") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CTable class="table table-responsive">
            <CTableRow>
              <CTableHeaderCell>{{ $t("Fullname") }}:</CTableHeaderCell>
              <CTableDataCell>{{ client.fullname }}</CTableDataCell>
              <CTableHeaderCell>{{ $t("Group") }}:</CTableHeaderCell>
              <CTableDataCell>{{ $t(client.group) }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("Gender") }}:</CTableHeaderCell>
              <CTableDataCell>{{ $t(client.gender) }}</CTableDataCell>
              <CTableHeaderCell>{{ $t("Country") }}:</CTableHeaderCell>
              <CTableDataCell>{{ client.country }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("ID number") }}:</CTableHeaderCell>
              <CTableDataCell>
                {{ client.id_number }}
              </CTableDataCell>
              <CTableHeaderCell>{{ $t("is handicap") }}:</CTableHeaderCell>
              <CTableDataCell>
                <CBadge
                  :color="client.is_handicap ? 'success' : 'warning'"
                  shape="rounded-pill"
                >
                  {{ client.is_handicap ? $t("Yes") : $t("No") }}
                </CBadge>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("ID number") }}:</CTableHeaderCell>
              <CTableDataCell>{{ client.id_number }}</CTableDataCell>
              <CTableHeaderCell>{{ $t("ID type") }}</CTableHeaderCell>
              <CTableDataCell>{{ client.id_type }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("Date of birth") }}:</CTableHeaderCell>
              <CTableDataCell>{{ client.dob }}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>{{ $t("Phone") }}:</CTableHeaderCell>
              <CTableDataCell>{{ client.phone }}</CTableDataCell>
            </CTableRow>
          </CTable>
          <CCard v-if="client.logs?.length" class="mt-2 logs-card">
            <CCardBody class="p-0">
              <CTable class="table-hover table-striped">
                <CTableHead>
                  <CTableRow class="table-dark">
                    <CTableHeaderCell scope="col">{{
                      $t("Logs")
                    }}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="log in client.logs">
                    <CTableDataCell v-if="log.key === 'assigned_group'"
                      >{{ $t(`This client has been assigned to group`) }}
                      {{
                        log.value + " " + $t("on") + " " + log.created_at
                      }}</CTableDataCell
                    >
                    <CTableDataCell v-if="log.key === 'retracted_group'"
                      >{{ $t(`This client has been removed from group`) }}
                      {{
                        log.value + " " + $t("on") + " " + log.created_at
                      }}</CTableDataCell
                    >
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <Documentable
            v-if="client.is_documentable"
            type="client"
            :id="client.id"
          />
          <Contractable
            v-if="client.is_contractable"
            type="client"
            :id="client.id"
          />
          <Concurrable
            v-if="client.is_concurrable"
            type="client"
            :id="client.id"
          />
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
import countries from "@/store/countries";
import { debounce } from "@/utils/helper";

export default {
  name: "Clients",
  data: () => ({
    debounceFn: null,
    countries: [],
    groups: [],
    clients: [],
    search: {
      country: "",
      gender: "",
      id_number: "",
      group: "",
    },
    loading: false,
    pagination: [],
    client: {},
    is_client_modal_visible: false,
  }),
  methods: {
    getClients: async function (reset = false) {
      this.loading = true;
      await this.$axios
        .get("/clients", {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.clients = response.data.data.map((client) => {
            let country_index = this.countries.findIndex(
              (country) => country.id === client.country_id
            );
            if (country_index >= 0) {
              client.country = this.$i18n.t(
                this.countries[country_index].title
              );
            } else {
              client.country = "";
            }
            let group_index = this.groups.findIndex(
              (group) => group.id === client.group_id
            );
            if (group_index >= 0) {
              client.group = this.$i18n.t(this.groups[group_index].title);
            } else {
              client.group = "";
            }
            return client;
          });
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getClients(true);
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
          this.clients = response.data.data.map((client) => {
            let country_index = this.countries.findIndex(
              (country) => country.id === client.country_id
            );
            if (country_index >= 0) {
              client.country = this.$i18n.t(
                this.countries[country_index].title
              );
            } else {
              client.country = "";
            }
            let group_index = this.groups.findIndex(
              (group) => group.id === client.group_id
            );
            if (group_index >= 0) {
              client.group = this.$i18n.t(this.groups[group_index].title);
            } else {
              client.group = "";
            }
            return client;
          });
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    deleteClient: async function (id, name) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/clients/${id}`).then(() => {
            // Remove the client from the list
            this.clients.splice(
              this.clients.findIndex((client) => client.id === id),
              1
            );
          });
          swal(this.$i18n.t("The client {name} has been deleted", {name: name}) , {
            icon: "success",
          });
        }
      });
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/clients/${id}`).then((response) => {
        this.client = response.data;
        let country_index = this.countries.findIndex(
          (country) => country.id === this.client.country_id
        );
        if (country_index >= 0) {
          this.client.country = this.$i18n.t(
            this.countries[country_index].title
          );
        } else {
          this.client.country = "";
        }
        let group_index = this.groups.findIndex(
          (group) => group.id === this.client.group_id
        );
        if (group_index >= 0) {
          this.client.group = this.$i18n.t(this.groups[group_index].title);
        } else {
          this.client.group = "";
        }
        this.is_client_modal_visible = true;
      });
    },
  },
  mounted: async function () {
    this.debounceFn = debounce(() => this.getClients(), 500);
    countries.fetchCountries().then((countries) => {
      this.countries = countries;
    });
    this.$axios
      .get("groups/all")
      .then((response) => (this.groups = response.data));
    await this.getClients();
  },
};
</script>
