<template>
  <div class="card border-success">
    <div class="card-header">{{ $t('Create user') }}</div>
    <form @submit.prevent="create">
      <div class="card-body">
        <div class="form-floating mb-2" style="direction: inherit;">
          <select
            class="form-control"
            id="crew_member"
            v-model="user.crew_member_id"
            @change="populate"
          >
            <option
              v-for="crew_member in crew_members"
              :value="crew_member.id"
              :key="crew_member.id"
            >
              {{ crew_member.fullname }}
            </option>
          </select>
          <label for="crew_member">{{ $t('Crew member') }}</label>
        </div>
        <div class="form-floating mb-2" v-if="no_crew_picked">
          <input
            id="name"
            type="text"
            class="form-control"
            autocomplete="name"
            v-model="user.name"
            autofocus
            required
          />
          <label for="name">{{ $t('Name') }}</label>
        </div>

        <div class="form-floating mb-2">
          <input
            id="email"
            type="email"
            class="form-control"
            autocomplete="email"
            v-model="user.email"
            required
          />
          <label for="email">{{ $t('Email') }}</label>
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
          <label for="contact">{{ $t('Contact') }}</label>
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
                required
              />
              <label for="password">{{ $t('Password') }}</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="password"
                class="form-control"
                id="password_confirmation"
                v-model="user.password_confirmation"
                required
              />
              <label for="password_confirmation">{{ $t('Confirm Password') }}</label>
            </div>

            <div class="border rounded px-1">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_active"
                  v-model="user.is_active"
                />
                <label class="form-check-label" for="is_active"> {{ $t('Active') }} </label>
              </div>
            </div>
          </div>

          <div class="col">
            <label class="form-label roles-select-label">{{ $t('User Roles') }}</label>
            <CFormSelect
              :html-size="6"
              aria-label="Roles"
              v-model="user.roles"
              :options="roles_select_options"
              multiple
            >
            </CFormSelect>
          </div>
        </div>
        <CRow v-if="error_message">
          <CCol :md="12">
            <div class="error_style">
              {{ error_message }}
            </div>
          </CCol>
        </CRow>
      </div>

      <div class="card-footer text-end">
        <button class="btn btn-success text-white" type="submit">
          <ion-icon name="create-outline"></ion-icon>&nbsp;{{ $t('Create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateUser',
  data: () => ({
    error_message: '',
    success: false,
    user: {
      is_active: true,
    },
    roles_select_options: [],
    crew_members: [],
    no_crew_picked: true,
  }),
  methods: {
    populate: async function () {
      this.user.name = this.crew_members[this.crew_members.findIndex(
        (crew) => crew.id === this.user.crew_member_id)
      ].fullname
      this.no_crew_picked = false
    },
    create: async function () {
      await this.$axios
        .post('/users', this.user)
        .then(() => { 
          swal(this.$i18n.t("User has been created successfully"), {
            icon: "success",
            timer: 3000,
          });
          this.$router.push({ name: 'Users' })
        })
        .catch(
          (error) =>
            (this.error_message =
              error.response?.data.message || error.message),
        )
    },
  },
  async mounted() {
    await this.$axios
      .get('/populate-create-user-dropdowns')
      .then((response) => {
        // Populate the roles select element options
        this.roles_select_options = response.data.roles.map((role) => {
          return {
            value: role,
            label: this.$i18n.t(role),
          }
        })
        // Populate the crew member select element options
        this.crew_members = response.data.crew_members
      })
  },
}
</script>
