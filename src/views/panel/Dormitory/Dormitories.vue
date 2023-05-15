<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Dormitories') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create dormitory' }"
            v-if="$can('dormitories.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="bed-outline"></ion-icon>&nbsp;
              {{ $t('Create dormitory') }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <!-- Search filters -->
          <CRow>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.title"
                :placeholder="$t('Title')"
                @keyup="filter(search.title, $event)"
              />
            </CCol>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.phones"
                :placeholder="$t('Phone')"
                @keyup="filter(search.phones, $event)"
              />
            </CCol>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.city"
                :placeholder="$t('City')"
                @keyup="filter(search.city, $event)"
              />
            </CCol>
          </CRow>
          <!-- End search filters -->
          <hr />
          <!-- Loading spinner -->
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">Loading...</span>
            </CCol>
          </CRow>
          <!-- End loading spinner -->

          <!-- Handle no results -->
          <CRow v-if="dormitories.length === 0 && !loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <span class="sr-only">No results</span>
            </CCol>
          </CRow>
          <!-- End no results -->
          <CTable v-if="!loading && dormitories.length > 0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Place name') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Phone') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('City') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Location') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Active') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Actions') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="dormitory in dormitories" :key="dormitory.id">
                <CTableDataCell>{{ dormitory.title }}</CTableDataCell>
                <CTableDataCell>{{ dormitory.phones }}</CTableDataCell>
                <CTableDataCell>{{ dormitory.city?.title }}</CTableDataCell>
                <CTableDataCell>{{ dormitory.location }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="dormitory.is_active ? 'success' : 'warning'"
                    shape="rounded-pill"
                  >
                    {{ dormitory.is_active ? $t('Yes') : $t('No') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(dormitory.id)"
                    v-if="$can('dormitories.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update Dormitory',
                      params: { id: this.$encrypt(dormitory.id) },
                    }"
                    v-if="$can('dormitories.edit')"
                  >
                    <CButton class="btn btn-sm btn-warning text-white m-1">
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white m-1"
                    @click="deleteDormitory(dormitory.id)"
                    v-if="$can('dormitories.delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow v-show="!loading">
            <CCol :md="12" class="text-center">
              <nav aria-label="Dormitories navigation">
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
    :visible="is_dormitory_modal_shown"
    @close="is_dormitory_modal_shown = false"
    class="modal-popup-detail"
    data-backdrop="static"
    data-keyboard="false"
  >
    <CModalHeader>
      <CModalTitle>{{ $t('Dormitory details') }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable class="table table-responsive">
        <CTableRow> </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Place name') }}</CTableDataCell>
          <CTableDataCell>{{ dormitory.title }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Phone') }}</CTableDataCell>
          <CTableDataCell>
            {{ dormitory.phones }}
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('City') }}</CTableDataCell>
          <CTableDataCell>{{ dormitory.city?.title }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Location') }}</CTableDataCell>
          <CTableDataCell>{{ dormitory.location }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Coordinate') }}</CTableDataCell>
          <CTableDataCell>{{ dormitory.coordinate }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Active') }}</CTableDataCell>
          <CTableDataCell>
            <CBadge
              :color="dormitory.is_active ? 'success' : 'warning'"
              shape="rounded-pill"
            >
              {{ dormitory.is_active ? 'Yes' : 'No' }}
            </CBadge>
          </CTableDataCell>
        </CTableRow>
      </CTable>
      <Contractable
        v-if="dormitory.is_contractable"
        type="dormitory"
        :id="dormitory.id"
      />
      <Documentable
        v-if="dormitory.is_documentable"
        type="dormitory"
        :id="dormitory.id"
      />
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        class="text-white"
        @click="is_dormitory_modal_shown = false"
      >
        {{ $t('Close') }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { debounce } from '@/utils/helper'

export default {
  name: 'Dormitories',
  data: () => ({
    debounceFn: null,
    dormitories: [],
    search: {},
    loading: false,
    pagination: [],
    is_dormitory_modal_shown: false,
    dormitory: {},
  }),
  methods: {
    getDormitories: async function (reset = false) {
      this.loading = true
      await this.$axios
        .get('/dormitories', {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.dormitories = response.data.data
          this.pagination = response.data.links
          this.loading = false
        })
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getDormitories(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/dormitories/${id}`).then((response) => {
        this.dormitory = response.data
        this.is_dormitory_modal_shown = true
      })
    },
    gotoPage: async function (url) {
      this.loading = true
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.dormitories = response.data.data
          this.pagination = response.data.links
        })
      this.loading = false
    },
    deleteDormitory: async function (id) {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Once deleted, you will not be able to recover!'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios.delete(`/dormitories/${id}`).then(
            () =>
              // TODO: remove item from the existing array
              // instead of reassigning
              (this.dormitories = this.dormitories.filter(
                (dormitory) => dormitory.id !== id,
              )),
          )
          swal(this.$i18n.t('Dormitory has been deleted!'), {
            icon: 'success',
            timer: 3000,
          })
        }
      })
    },
  },
  mounted: async function () {
    await this.getDormitories()
    this.debounceFn = debounce(() => this.getDormitories(), 500)
  },
}
</script>
