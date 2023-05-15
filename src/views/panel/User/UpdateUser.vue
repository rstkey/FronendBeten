<template>
  <form class="card border-warning" @submit.prevent="update">
    <div class="card-header">{{ $t("Update user") }}</div>
    <div class="card-body">
      <div class="form-floating mb-2">
        <input
          type="text"
          class="form-control"
          id="name"
          autocomplete="off"
          v-model="user.name"
          autofocus
          disabled
        />
        <label for="name">{{ $t("Name") }}</label>
      </div>
      <div class="form-floating mb-2">
        <input
          type="email"
          class="form-control"
          id="email"
          autocomplete="off"
          v-model="user.email"
          disabled
        />
        <label for="email">{{ $t("Email") }}</label>
      </div>
      <div class="form-floating mb-2">
        <input
          type="text"
          class="form-control"
          id="contact"
          autocomplete="off"
          v-model="user.contact"
          required
        />
        <label for="contact">{{ $t("Contact") }}</label>
      </div>
      <div class="row g-1 mb-2">
        <div class="col">
          <div class="form-floating mb-2">
            <input
              type="password"
              class="form-control"
              id="password"
              autocomplete="new-password"
              aria-autocomplete="list"
              v-model="user.password"
            />
            <label for="password">{{ $t("Password") }}</label>
          </div>
          <div class="form-floating mb-2">
            <input
              type="password"
              class="form-control"
              id="password_confirmation"
              autocomplete="new-password"
              aria-autocomplete="list"
              v-model="user.password_confirmation"
            />
            <label for="password_confirmation">{{
              $t("Confirm Password")
            }}</label>
          </div>
          <div class="border rounded px-1">
            <div class="form-switch">
              <input
                class="form-check-input"
                id="is_active"
                type="checkbox"
                :checked="user.is_active"
                v-model="user.is_active"
              />
              <label class="form-check-label" for="is_active">
                &nbsp;{{ $t("Active") }}
              </label>
            </div>
          </div>
        </div>
        <div class="col" v-if="roles.length > 0">
          <label class="form-label roles-select-label">{{
            $t("User Roles")
          }}</label>
          <CFormSelect
            :html-size="roles.length + 1"
            multiple
            aria-label="Roles"
            v-model="user.roles"
            :options="roles"
          >
          </CFormSelect>
        </div>
      </div>
    </div>
    <CRow v-if="error_message">
      <CCol :md="12">
        <div class="error_style">
          {{ error_message }}
        </div>
      </CCol>
    </CRow>
    <div class="card-footer text-end">
      <button
        class="btn btn-secondary text-white"
        @click.prevent="$router.go(-1)"
      >
        {{ $t('Go back') }}</button
      >&nbsp;
      <button type="submit" class="btn btn-warning text-white">
        <ion-icon name="save-outline"></ion-icon>&nbsp;{{ $t('Save') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "UpdateUser",
  data: () => ({
    error_message: "",
    user: {},
    roles: [],
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
            .patch(`/users/${this.user.id}`, this.user)
            .then(() => {
              this.$router.push({ name: 'Users' });
              swal(this.$i18n.t('Updated successfully!'), {
                icon: 'success',
                timer: 3000,
              });
            })
            .catch(
              (error) =>
                (this.error_message =
                  error.response?.data.message || error.message),
            )
        }
      });
    },
  },
  mounted: async function () {
    await this.$axios
      .get(`/users/${this.$decrypt(this.$route.params.id)}/edit`)
      .then((response) => {
        this.user = response.data.user;
        this.user.id = Number(this.$decrypt(this.$route.params.id));
        if (response.data.roles) {
          this.roles = response.data.roles;
          // Populate the roles select element options
          this.roles = response.data.roles.map((role) => {
            return {
              value: role.name,
              label: this.$i18n.t(role.name),
              selected: this.user.roles.some(
                (user_role) => user_role.name === role.name
              ),
            };
          });
        }
      });
  },
};
</script>
