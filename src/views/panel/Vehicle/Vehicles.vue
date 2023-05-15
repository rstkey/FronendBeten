<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <CCardTitle>{{ $t('Vehicles') }}</CCardTitle>
          <router-link
            :to="{ name: 'Create vehicle' }"
            v-if="$can('vehicles.create')"
          >
            <CButton color="success" class="float-end text-white">
              <ion-icon name="car-sport-outline"></ion-icon>&nbsp;
              {{ $t('Create vehicle') }}
            </CButton>
          </router-link>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.model"
                :placeholder="$t('Model')"
                @keyup="filter(search.model, $event)"
              />
            </CCol>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.manufacturer"
                :placeholder="$t('Manufacturer')"
                @keyup="filter(search.manufacturer, $event)"
              />
            </CCol>
            <CCol :md="2">
              <input
                type="text"
                class="form-control"
                v-model="search.registration"
                :placeholder="$t('Registration')"
                @keyup="filter(search.registration, $event)"
              />
            </CCol>
          </CRow>
          <hr />
          <CRow v-if="loading" class="mt-4">
            <CCol :md="12" class="text-center">
              <div class="spinner-border text-success" role="status"></div>
            </CCol>
            <CCol :md="12" class="text-center">
              <span class="sr-only">{{ $t('Loading...') }}</span>
            </CCol>
          </CRow>
          <CTable v-if="!loading">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{{ $t('Model') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Registration') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Manufacturer') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Year') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Badge') }}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{{ $t('Passengers') }}</CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  style="width: 20%"
                  :aria-colspan="2"
                >
                  {{ $t('Actions') }}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="vehicle in vehicles" :key="vehicle.id">
                <CTableDataCell>{{ vehicle.model }}</CTableDataCell>
                <CTableDataCell>{{ vehicle.registration }}</CTableDataCell>
                <CTableDataCell>{{ vehicle.manufacturer }}</CTableDataCell>
                <CTableDataCell>{{ vehicle.year }}</CTableDataCell>
                <CTableDataCell>{{ vehicle.badge }}</CTableDataCell>
                <CTableDataCell>{{ vehicle.passengers }}</CTableDataCell>
                <CTableDataCell>
                  <button
                    class="btn btn-sm btn-info text-white mx-1"
                    :title="$t('View details')"
                    @click="viewDetails(vehicle.id)"
                    v-if="$can('vehicles.view')"
                  >
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <router-link
                    :to="{
                      name: 'Update Vehicle',
                      params: { id: this.$encrypt(vehicle.id) },
                    }"
                    v-if="$can('vehicles.edit')"
                    :title="$t('Edit')"
                  >
                    <CButton class="btn btn-sm btn-warning text-white m-1">
                      <ion-icon name="create-outline"></ion-icon>
                    </CButton>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger text-white m-1"
                    @click="deleteVehicle(vehicle.id)"
                    v-if="$can('vehicles.delete')"
                    :title="$t('Delete')"
                  >
                    <ion-icon name="trash-bin-outline"></ion-icon>
                  </button>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol :md="12" class="text-center">
              <nav aria-label="Vehicles navigation">
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
    :visible="is_vehicle_modal_visible"
    @close="is_vehicle_modal_visible = false"
    size="md"
  >
    <CModalHeader>
      <CModalTitle>{{ $t('Vehicle details') }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable class="table table-responsive">
        <CTableRow>
          <CTableDataCell>{{ $t('Model') }}</CTableDataCell>
          <CTableDataCell>{{ vehicle.model }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Manufacturer') }}</CTableDataCell>
          <CTableDataCell>
            {{ vehicle.manufacturer }}
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Year') }}</CTableDataCell>
          <CTableDataCell>{{ vehicle.year }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Registration') }}</CTableDataCell>
          <CTableDataCell>{{ vehicle.registration }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Badge') }}</CTableDataCell>
          <CTableDataCell>{{ vehicle.badge }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>{{ $t('Passengers') }}</CTableDataCell>
          <CTableDataCell>{{ vehicle.passengers }}</CTableDataCell>
        </CTableRow>
      </CTable>
      <Contractable
        v-if="vehicle.is_contractable"
        type="vehicle"
        :id="vehicle.id"
      />
      <Documentable
        v-if="vehicle.is_documentable"
        type="vehicle"
        :id="vehicle.id"
      />
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="is_vehicle_modal_visible = false">
        {{ $t('Close') }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { debounce } from '@/utils/helper'

export default {
  name: 'Vehicles',
  data: () => ({
    debounceFn: null,
    vehicles: {},
    search: {},
    loading: false,
    pagination: {},
    vehicle: {},
    is_vehicle_modal_visible: false,
  }),
  methods: {
    getVehicles: async function (reset = false) {
      this.loading = true
      await this.$axios
        .get('/vehicles/paginate', {
          params: reset ? {} : this.search,
        })
        .then((response) => {
          this.vehicles = response.data.data
          this.pagination = response.data.links
          this.loading = false
        })
    },
    filter: async function (value, event) {
      if (
        (event.key == "Backspace" || event.key == "Delete") &&
        value.length <= 2
      ) {
        await this.getVehicles(true);
      } else if (value.length > 2) {
        await this.debounceFn();
      }
    },
    gotoPage: async function (url) {
      this.loading = true
      await this.$axios
        .get(url, {
          params: this.search,
        })
        .then((response) => {
          this.vehicles = response.data.data
          this.pagination = response.data.links
        })
      this.loading = false
    },
    viewDetails: async function (id) {
      await this.$axios.get(`/vehicles/info/${id}`).then((response) => {
        this.vehicle = response.data
        this.is_vehicle_modal_visible = true
      })
    },
    deleteVehicle: async function (id) {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Once deleted, you will not be able to recover!'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios
            .post(`/vehicles/delete/${id}`)
            .then(() => this.getVehicles())
          swal(this.$i18n.t('Vehicle has been deleted!'), {
            icon: 'success',
            timer: 3000,
          })
        }
      })
    },
  },
  mounted: async function () {
    this.debounceFn = debounce(() => this.getVehicles(), 500)
    await this.getVehicles()
  },
}
</script>
