<template>
  <div class="card border-warning mb-4">
    <div class="card-header">{{ $t("Update Role") }}</div>
    <form @submit.prevent="update">
      <div class="card-body">
        <div class="form-floating mb-3">
          <CTableRow class="form-control">
            <CTableHeaderCell>{{ $t(role_name) }}</CTableHeaderCell>
          </CTableRow>
        </div>

        <div class="form-floating mb-3">
          <CTableRow class="form-control">
            <CTableHeaderCell>{{ $t("Permissions") }}</CTableHeaderCell>
          </CTableRow>
          <CAccordion>
            <CAccordionItem v-for="entity in entities">
              <CAccordionHeader>
                {{ $t(entity) }}
              </CAccordionHeader>
              <CAccordionBody>
                <div class="d-flex flex-wrap">
                  <CFormCheck 
                    v-for="permission_by_entity in permissions_by_entity[entity]"
                    class="permission-item"
                    :id="permission_by_entity.id"
                    :label="permission_by_entity.name.split('.').map(item => $t(item)).join('.')"
                    :checked="role.permissions.find(permission => permission.id === permission_by_entity.id)"
                    @change="(event) => permissionChanged(event.target.checked, permission_by_entity)"
                  />
                </div>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </div>

        <CRow v-if="error_message">
          <CCol :md="12">
            <div class="error_style">
              {{ $t(error_message) }}
            </div>
          </CCol>
        </CRow>
      </div>

      <div class="card-footer text-end">
        <button
          class="btn btn-secondary text-white"
          @click.prevent="$router.go(-1)"
        >
          Go back</button
        >&nbsp;
        <button type="submit" class="btn btn-warning text-white">
          Save
          <ion-icon name="save"></ion-icon>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UpdateRole',
  data: () => ({
    role: {},
    role_name: '',
    entities: [],
    permissions_by_entity: {},
    checked_permissions: [],
    error_message: '',
  }),
  methods: {
    update: async function () {
      await swal({
        title: this.$i18n.t('Are you sure?'),
        text: this.$i18n.t('Click confirm to update, this action is irreversible'),
        icon: 'warning',
        buttons: [this.$i18n.t('Cancel'), this.$i18n.t('Confirm')],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(`/roles/${this.role.id}`, { permissions: this.checkedPermissions })
            .then(() => {
              this.$router.push({ name: 'All roles' })
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              })
            })
            .catch((error) => {
              if (error.response) {
                this.error_message = error.response.data.message
              } else {
                this.error_message = error.message
              }
            })
        }
      })
    },
    permissionChanged: function (checked, permission) {
      if (checked)
        this.checkedPermissions.push(permission.id);
      else {
        const index = this.checkedPermissions.indexOf(permission.id);
        this.checkedPermissions.splice(index, 1);
      }
    },
  },
  async mounted() {
    await this.$axios
      .get(`/roles/${this.$decrypt(this.$route.params.id)}/edit`)
      .then((response) => (this.role = response.data));
    this.role_name = this.role.name;
    let entities = this.role.available_permissions.map(element => element.name.split(".")[0]);
    entities = new Set(entities);
    this.entities = entities;
    entities.forEach(entity => {
      this.permissions_by_entity[entity] = this.role.available_permissions.filter(item => item.name.startsWith(entity));
    });
    this.checkedPermissions = this.role.permissions.map(permission => permission.id);
  },
}
</script>

<style scoped>
.permission-item {
  margin-left: 20px;
}
</style>
