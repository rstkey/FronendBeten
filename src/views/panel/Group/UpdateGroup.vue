<template>
  <form class="card border-warning mb-4" @submit.prevent="update">
    <div class="card-header">{{ $t("Update Group") }}</div>
    <div class="card-body">
      <div class="row mt-4">
        <div class="col-4">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="group.title"
              autocomplete="off"
              required
              autofocus
            />
            <label for="title">{{ $t("Title") }}</label>
          </div>
        </div>
        <div class="col-4">
          <div class="form-floating mb-3">
            <select v-model="group.crew_id" id="crew_id" class="form-control">
              <option>{{ $t("Choose Crew") }}</option>
              <template v-for="crew in crew_members" :key="crew.id">
                <option :value="crew.id">{{ crew.fullname }}</option>
              </template>
            </select>
            <label for="crew_id">{{ $t("Crew") }}</label>
          </div>
        </div>
        <div class="col-4">
          <div class="form-floating mb-3">
            <input
              id="virtual_count"
              class="form-control"
              type="number"
              min="1"
              step="1"
              max="2147483647"
              v-model="group.clients_virtual_count"
              autocomplete="off"
              autofocus
            />
            <label for="virtual_count">{{ $t("Clients count") }}</label>
          </div>
        </div>
      </div>
      <CRow>
        <CCol v-if="error_message" :md="12">
          <div class="error_style">
            {{ error_message }}
          </div>
        </CCol>
      </CRow>
    </div>
    <div class="card-footer text-end">
      <button
        class="btn btn-secondary text-white"
        @click.prevent="$router.go(-1)"
      >
        {{ $t("Go back") }}</button
      >&nbsp;
      <button type="submit" class="btn btn-warning text-white">
        <ion-icon name="save-outline"></ion-icon>&nbsp;{{ $t("Save") }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "UpdateGroup",
  data: () => ({
    error_message: "",
    group: {},
    crew_members: [],
  }),
  methods: {
    update: async function () {
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
            .patch(`/groups/${this.group.id}`, this.group)
            .then(() => {
              this.$router.push({ name: "Groups" });
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
  async mounted() {
    await this.$axios
      .get(`/groups/${this.$decrypt(this.$route.params.id)}/edit`)
      .then((response) => {
        this.group = response.data.group;
        this.crew_members = response.data.crew_members;
      });
  },
};
</script>
