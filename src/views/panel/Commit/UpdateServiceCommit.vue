<template>
  <form class="card border-warning mb-4" @submit.prevent="update">
    <div class="card-header">{{ $t("Update Service Commit") }}</div>
    <div class="card-body">
      <div class="form-floating mb-3">
        <select
          name="service_id"
          id="service_id"
          class="form-control"
          v-model="service_commit.service_id"
          autofocus
          required
        >
          <option :value="null">{{ $t("Choose service") }}</option>
          <option v-for="service in services" :value="service.id">
            {{ service.title }}
          </option>
        </select>
        <label for="service_id">{{ $t("Service") }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="badge"
          required
          autocomplete="off"
          v-model="service_commit.badge"
        />
        <label for="badge">{{ $t("Badge") }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="datetime-local"
          class="form-control"
          id="schedule_at"
          v-model="service_commit.schedule_at"
        />
        <label for="schedule_at">{{ $t("Schedule At") }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="datetime-local"
          class="form-control"
          id="started_at"
          v-model="service_commit.started_at"
        />
        <label for="started_at">{{ $t("Started") }}</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="from_location"
          required
          autocomplete="off"
          v-model="service_commit.from_location"
        />
        <label for="from_location">{{ $t("From") }}</label>
      </div>

      <div class="form-floating mb-3">
        <select
          name="supervisor_id"
          id="supervisor_id"
          class="form-control"
          v-model="service_commit.supervisor_id"
        >
          <option :value="null">{{ $t("Choose a supervisor") }}</option>
          <option v-for="user in users" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <label for="supervisor_id">{{ $t("Supervisor") }}</label>
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
        {{ $t("Go back") }}</button
      >&nbsp;
      <button type="submit" class="btn btn-warning text-white">
        <ion-icon name="save-outline"></ion-icon>&nbsp;
        {{ $t("Save") }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "UpdateServiceCommit",
  data: () => ({
    error_message: "",
    services: [],
    users: [], // A key/value pair of users name/id to select the supervisor
    service_commit: {},
  }),
  methods: {
    async update() {
      await swal({
        title: this.$i18n.t("Are you sure?"),
        text: this.$i18n.t(
          "Click confirm to update, this action is irreversible"
        ),
        icon: "warning",
        buttons: [this.$i18n.t("Cancel"), this.$i18n.t("Confirm")],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.$axios
            .patch(
              `service_commits/${this.$decrypt(this.$route.params.id)}`,
              this.service_commit
            )
            .then(() => {
              this.$router.push({ name: "Service Commits" });
              swal(this.$i18n.t("Updated successfully!"), {
                icon: "success",
                timer: 3000,
              });
            })
            .catch(
              (error) =>
                (this.error_message =
                  error.response?.data.message || error.message)
            );
        }
      });
    },
  },
  mounted: async function () {
    await this.$axios
      .get(`/service_commits/${this.$decrypt(this.$route.params.id)}/edit`)
      .then((response) => {
        this.service_commit = response.data.commit;
        this.users = response.data.users;
        this.services = response.data.services;
      });
  },
};
</script>
