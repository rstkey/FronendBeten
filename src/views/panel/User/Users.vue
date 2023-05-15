<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>
          <CCardTitle>{{ $t("Users") }}</CCardTitle>
          <router-link
            :to="{ name: 'Create user' }"
            v-if="$can('users.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="person-add-outline"></ion-icon>&nbsp;
              {{ $t("Create user") }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <!-- Search filters -->
          <CRow>
            <CCol md="4" sm="4" lg="3">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.name"
                :placeholder="$t('Name...')"
                @keyup="filter(search.name, $event)"
                autofocus
              />
            </CCol>
            <CCol md="4" sm="4" lg="3">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.email"
                :placeholder="$t('Email...')"
                @keyup="filter(search.email, $event)"
              />
            </CCol>
            <CCol md="4" sm="4" lg="3">
              <input
                type="text"
                class="form-control mb-3"
                v-model="search.contact"
                :placeholder="$t('Contact...')"
                @keyup="filter(search.contact, $event)"
              />
            </CCol>
          </CRow>
          <!-- End search filters -->
          <hr />
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("Loading...") }}</span>
            </CCol>
          </CRow>
          <!-- No results -->
          <CRow v-if="users.length === 0 && !loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t("No results") }}</span>
            </CCol>
          </CRow>
          <!-- End no results -->
          <CTable
            v-if="!loading && users.length > 0"
            responsive
            hover
            align="middle"
          >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{
                  $t("Name")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Email")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Active")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Contact")
                }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{
                  $t("Actions")
                }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="user in users" :key="user.id">
                <CTableDataCell>{{ user.name }}</CTableDataCell>
                <CTableDataCell>{{ user.email }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="user.is_active ? 'success' : 'warning'"
                    shape="rounded-pill"
                  >
                    {{ user.is_active ? $t("Yes") : $t("No") }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{{ user.contact }}</CTableDataCell>
                <CTableDataCell :aria-colspan="2">
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(user.id)"
                    v-if="$can('users.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update user',
                      params: { id: this.$encrypt(user.id) },
                    }"
                    v-if="$can('users.edit')"
                    :title="$t('Edit')"
                  >
                    <CButton
                      class="btn btn-sm btn-warning text-white m-1"
                      :xl="0"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white m-1"
                    @click="deleteUser(user.id)"
                    :title="$t('Delete')"
                    v-if="$can('users.delete') && user.id != auth_user.id"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav :aria-label="$t('Users navigation')">
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
    :visible="is_user_modal_visible"
    @close="is_user_modal_visible = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t("User Information") }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable class="table table-responsive">
        <CTableRow>
          <CTableHeaderCell>{{ $t("Name") }}</CTableHeaderCell>
          <CTableDataCell>{{ user.name }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell>{{ $t("Email") }}</CTableHeaderCell>
          <CTableDataCell>{{ user.email }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell>{{ $t("Active") }}</CTableHeaderCell>
          <CTableDataCell>
            <CBadge
              :color="user.is_active ? 'success' : 'warning'"
              shape="rounded-pill"
            >
              {{ user.is_active ? $t("Yes") : $t("No") }}
            </CBadge>
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell>{{ $t("Contact") }}</CTableHeaderCell>
          <CTableDataCell>{{ user.contact }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell>{{ $t("Roles") }}</CTableHeaderCell>
          <CTableDataCell>{{ $t(user.roles) }}</CTableDataCell>
        </CTableRow>
      </CTable>
      <Documentable v-if="user.is_documentable" type="user" :id="user.id" />
      <Contractable v-if="user.is_contractable" type="user" :id="user.id" />
      <Concurrable v-if="user.is_concurrable" type="user" :id="user.id" />
    </CModalBody>
  </CModal>
</template>

<script>
import { debounce } from "@/utils/helper";

export default {
  name: "Users",
  data: () => ({
    debounceFn: null,
    users: [],
    search: {},
    user: {},
    pagination: [],
    loading: false,
    is_user_modal_visible: false,
    auth_user: {},
  }),
  methods: {
    getUsers: async function (reset = false) {
      this.loading = true;
      await this.$axios
        .get("/users", {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.users = response.data.data;
          this.pagination = response.data.links;
          this.loading = false;
        });
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getUsers(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/users/${id}`).then((response) => {
        this.user = response.data;
        this.is_user_modal_visible = true;
      });
    },
    gotoPage: async function (url) {
      this.loading = true;
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.users = response.data.data;
          this.pagination = response.data.links;
        });
      this.loading = false;
    },
    deleteUser: async function (id) {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t("Once deleted, you will not be able to recover!"),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/users/${id}`).then(() => {
            // Remove the user from the list
            this.users.splice(
              this.users.findIndex((user) => user.id === id),
              1
            );
            swal(this.$i18n.t("The user has been deleted!"), {
              icon: "success",
              timer: 3000,
            });
          });
        }
      });
    },
  },
  mounted: async function () {
    this.getUsers();
    this.debounceFn = debounce(() => this.getUsers(), 500);
    this.auth_user = JSON.parse(localStorage.getItem("user"));
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
