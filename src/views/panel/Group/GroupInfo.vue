<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <h3 class="mt-1">
                {{ group.title }}
                <CButton
                  @click="
                    is_client_add_modal_visible = true;
                    (clientList = []), (selectedClients = []);
                    queryClient = '';
                  "
                  color="success"
                  class="float-end text-white"
                  v-if="$can('groups.clients.add') || is_supervisor"
                >
                  <ion-icon name="people-outline"></ion-icon>&nbsp;
                  {{ $t("Add clients to group") }}
                </CButton>
              </h3>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <div class="d-flex justify-content-between">
            <span class="fs-5">
              <strong>{{ $t("Crew member") }}: </strong>
              {{ group.crew?.fullname }}
            </span>
            <span class="fs-5">
              <strong>{{ $t("Clients virtual count") }}: </strong>
              {{ group.clients_virtual_count }}
            </span>
            <span class="fs-5">
              <strong>{{ $t("Clients count") }}: </strong>
              {{ group.clients?.length }}
            </span>
          </div>
          <!-- Start search filters -->
          <CRow class="mt-3">
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
          <CAlert color="success" class="m-2" v-show="message">
            {{ message }}
            <span
              class="cursor-pointer float-end test-danger"
              @click="message = ''"
            >
              X
            </span>
          </CAlert>
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("Loading...") }}</span>
            </CCol>
          </CRow>
          <!-- End no results -->
          <CTable v-if="!loading && group.clients?.length !== 0" responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  {{ $t("Fullname") }}
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
              <CTableRow
                v-for="(client, index) in group.clients"
                :key="client.id"
              >
                <CTableDataCell>{{ client.fullname }}</CTableDataCell>
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
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <button
                    class="btn btn-sm btn-danger text-white m-1 removeX"
                    @click="removeClient(client, index)"
                    :title="$t('Remove client from group')"
                  >
                    <ion-icon name="person-remove-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <h3 class="mt-1">
                {{ $i18n.t('Documents') }}
                <CButton
                  @click="
                    is_group_document_modal_visible = true;
                  "
                  color="success"
                  class="float-end text-white"
                  v-if="$can('groups.clients.add') || is_supervisor"
                >
                  <ion-icon name="document"></ion-icon>&nbsp;
                  {{ $t("Add document") }}
                </CButton>
              </h3>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CAlert color="success" class="m-2" v-show="message">
            {{ message }}
            <span
              class="cursor-pointer float-end test-danger"
              @click="message = ''"
            >
              X
            </span>
          </CAlert>
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("Loading...") }}</span>
            </CCol>
          </CRow>
          <!-- End no results -->
          <CTable v-if="!loading && group.clients?.length !== 0" responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  {{ $t("Title") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Created By") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("File") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("View Detail") }}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {{ $t("Delete") }}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow
                v-for="(group_document, index) in group_documents"
                :key="group_document.id"
              >
                <CTableDataCell>{{ group_document.title }}</CTableDataCell>
                <CTableDataCell>{{ group_document.created_by }}</CTableDataCell>
                 <CTableDataCell>
                  <a
                    class="btn btn-sm btn-info text-white m-1"
                    :href="group_document.path"
                    :title="$t('Download document')"
                    :download="group_document.title"
                    target="_blank"
                  >
                    <ion-icon name="cloud-download-outline"></ion-icon>
                  </a>
                </CTableDataCell>
                <CTableDataCell>
                  <a
                    class="btn btn-sm btn-info text-white m-1"
                    :href="group_document.path"
                    :title="$t('View details')"
                    target="_blank"
                  >
                  <ion-icon name="eye-outline"></ion-icon>
                </a>
              </CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                <button
                  class="btn btn-sm btn-danger text-white m-1"
                  @click="deleteGroupDocument(group_document.id)"
                  :title="$t('Delete')"
                >
                  <ion-icon name="trash-bin-outline"></ion-icon>
                </button>
              </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
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
  
  <CModal
    :visible="is_group_document_modal_visible"
    @close="is_group_document_modal_visible = false"
    class="modal-popup-detail"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Group Documents") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :md="12">
          <Documentable
            type="group"
            :id="group.id"
            :showListing="false"
            @document_created="document_created"
          /> 
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>

  <CModal
    :visible="is_client_add_modal_visible"
    @close="is_client_add_modal_visible = false"
    class="modal-popup-detail"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("Add clients to group") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol :sm="12" class="mb-3">
          <input
            type="text"
            class="form-control mb-3"
            v-model="queryClient"
            :placeholder="$t('Fullname or ID number')"
            @keyup="searchClients(queryClient, $event)"
          />

          <CCol :md="12" v-if="clientListLoading" class="text-center">
            <div class="spinner-border text-success" role="status"></div>
          </CCol>
          <CCol :md="12" v-if="clientListLoading" class="text-center">
            <span class="sr-only">Loading...</span>
          </CCol>
          <CListGroup v-if="!clientListLoading">
            <CListGroupItem v-for="client in clientList" :key="client.id">
              <label class="form-check">
                <input
                  class="form-check-input me-2"
                  v-model="selectedClients"
                  :value="client"
                  type="checkbox"
                  value="1"
                />
                <span class="pull-right">{{ client.id_number }}</span>
                <span>{{ client.fullname }}</span>
              </label>
            </CListGroupItem>
          </CListGroup>
        </CCol>
        <CCol :sm="12" class="d-grid gap-2 col-6 mx-auto">
          <CButton
            @click="addClientsToGroup()"
            color="success"
            class="text-white"
          >
            {{ $t("Add to group") }}
          </CButton>
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
import countries from "@/store/countries";
import { debounce } from "@/utils/helper";

export default {
  name: "GroupInfo",
  components: { multiselect: window.VueBootstrapMultiselect },
  data: () => ({
    debounceFn: null,
    countries: [],
    clients: [],
    groupClientsClone: [],
    search: {
      country: "",
      gender: "",
      id_number: "",
    },
    loading: false,
    group: {},
    client: {},
    is_client_modal_visible: false,
    is_group_document_modal_visible: false,
    group_documents:[],
    is_client_add_modal_visible: false,
    clientList: [],
    clientListLoading: false,
    queryClient: "",
    selectedClients: [],
    message: "",
  }),
  computed: {
    is_supervisor() {
      let user = JSON.parse(localStorage.getItem("user"));
      return user.id === this.group.crew?.user_id;
    },
  },
  methods: {
    openAddClientsModal: async function () {
      is_client_add_modal_visible = true;
      (clientList = []), (selectedClients = []);
      queryClient = "";
    },
    async addClientsToGroup() {
      let newClients = [];
      this.selectedClients.map((client) => {
        newClients.push(client.id);
      });

      await this.$axios
        .post("/groups/clients", {
          group_id: this.group.id,
          clients: newClients,
        })
        .then(() => {
          this.getGroupInfo();
          this.is_client_add_modal_visible = false;
          this.selectedClients = [];
          this.message = this.$i18n.t("Clients has been added to group!");
          setTimeout(() => {
            this.message = "";
          }, 3000);
        })
        .catch((error) => console.log(error));
    },
    async removeClient(client, index) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios
            .delete("/groups/clients", {
              data: {
                group_id: this.group.id,
                clients: [client.id],
              },
            })
            .then(() => {
              this.getGroupInfo();
              this.message = this.$i18n.t(
                "Client has been removed from group!"
              );
              setTimeout(() => {
                this.message = "";
              }, 3000);
            });
        }
      });
    },
    searchClients: async function (query, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        query.length <= 2
      ) {
        this.clientList = [];
        this.clientListLoading = false;
      } else if (query.length > 2) {
        this.clientListLoading = true;
        await this.$axios
          .get("/clients", {
            params: { client_query: query, per_page: 10, group: 'ungrouped' },
          })
          .then((response) => {
            this.clientList = response.data.data.filter((client) => {
              return !this.groupClientsClone
                .map((client) => client.id)
                .includes(client.id);
            });
            this.clientListLoading = false;
          });
      }
    },
    getClients: async function (reset = false) {
      this.loading = true;
      await this.$axios
        .get("/clients", {
          params: reset ? { group: this.group.id } : this.search,
        })
        .then((response) => {
          this.group.clients = response.data.data.filter((client) => {
            return this.groupClientsClone
              .map((client) => client.id)
              .includes(client.id);
          });
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
        this.group.clients = this.groupClientsClone;
        await this.debounceFn();
      }
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/clients/${id}`).then((response) => {
        this.client = response.data;
        let country_index = this.countries.findIndex(
          (country) => country.id === this.client.country_id
        );
        this.client.country = this.countries[country_index].title;
        this.is_client_modal_visible = true;
      });
    },
    getGroupInfo: async function () {
      await this.$axios
        .get(`/groups/${this.$decrypt(this.$route.params.id)}`)
        .then((response) => {
          this.group = response.data;
          this.groupClientsClone = response.data.clients;
          this.getGroupDocuments();
        });
    },
    async deleteGroupDocument(doc_id) {
      await this.$axios.delete(`/documents/${doc_id}`).then(() => {
        this.group_documents = this.group_documents.filter((doc) => doc.id !== doc_id)
        swal(this.$i18n.t("Document deleted successfully."), {
            icon: "success",
            timer: 3000,
          });
      })
    },
    async getGroupDocuments() {
      await this.$axios
        .get(`/documents/group/${this.group.id}`)
        .then((response) => {
          this.group_documents = response.data
        })
    },
    document_created() {
      this.getGroupDocuments();
    }
  },
  mounted: async function () {
    this.debounceFn = debounce(() => this.getClients(), 500);
    countries.fetchCountries().then((countries) => {
      this.countries = countries;
    });

    this.getGroupInfo();
  },
};
</script>
