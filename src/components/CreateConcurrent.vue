<template>
  <div class="m-3 p-2 rounded border bg-light">
    <div class="row">
      <div class="col-sm-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Start at</span>
          <input
            type="date"
            class="form-control"
            v-model="concurrent.starting_at"
          />
        </div>
      </div>
      <div class="col-sm-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Ends at</span
          ><input
            type="date"
            class="form-control"
            v-model="concurrent.ending_at"
          />
        </div>
      </div>
    </div>
    <ul class="list-unstyled">
      <li class="item-selection">
        <button
          class="btn btn-success btn-sm rounded-5 text-white"
          id="btnDaily"
          @click="pickDaily"
        >
          Daily
        </button>
        <div class="container py-5 border" v-if="pickedDaily">
          <div
            class="input-group mb-1 daily-input-time"
            v-for="(extra, index) in concurrent.extra"
            :key="index"
          >
            <input
              type="time"
              class="form-control wx-8"
              aria-label="time of day"
              v-model="extra.time"
            />
            <span class="input-group-text wx-4">+ -</span>
            <!-- TODO: min max have defaults, but could change based on time -->
            <!-- Must avoid overflowing to tomorrow or yesterday -->
            <input
              type="number"
              min="10"
              max="60"
              class="form-control wx-6"
              placeholder="Mins"
              aria-label="Time window"
              v-model="extra.window"
              @focusin="setDefaultTimeWindow(index)"
              @focusout="validateTimeWindow($event, index)"
            />
            <select class="form-select rows-2" multiple>
              <option
                v-for="role in notifiables.roles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
            <select class="form-select rows-2" multiple>
              <option
                v-for="user in notifiables.users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
            <button
              :class="`btn btn-outline-${
                index === 0 ? 'success' : 'danger'
              } btn-icon btn-daily-input-time-add`"
              type="button"
              :title="index === 0 ? 'Add another' : 'Remove'"
              @click="index === 0 ? addRow() : removeRow(index)"
            >
              {{ index === 0 ? '+' : '-' }}
            </button>
          </div>
          <button class="btn btn-success text-white pull-right" @click="submit">
            Submit
          </button>
        </div>
      </li>
      <li class="item-selection">
        <button
          class="btn btn-primary btn-sm rounded-5"
          id="btnWeekly"
          :disabled="pickedDaily"
        >
          Weekly
        </button>
        <div class="container d-none py-5 border">
          <div class="mb-1 weekly-input-day">
            <ul class="list-unstyled">
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Saturday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Sunday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Monday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Tuesday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Wednesday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Thursday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
              <li class="rounded-5 border p-3 my-1">
                <div class="input-group">
                  <div class="pt-3 me-2 w-8">Friday</div>
                  <input
                    type="time"
                    class="form-control wx-8"
                    placeholder="time"
                    aria-label="time of day"
                    name="daily[]"
                  />
                  <select class="form-select rows-2" name="roles[]" multiple>
                    <option value="">Admin</option>
                    <option value="">Supervisor</option>
                    <option value="">members</option>
                  </select>

                  <select class="form-select rows-2" name="users[]" multiple>
                    <option value="">Fateh</option>
                    <option value="">John</option>
                    <option value="">Sami</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CreateConcurrent',
  props: ['type', 'id'],
  data: () => ({
    concurrent: { extra: [{}] },
    pickedDaily: true,
    notifiables: [],
  }),
  methods: {
    pickDaily: async function () {
      this.pickedDaily = !this.pickedDaily
    },
    // Dirty hack for validation before submission, sue me
    setDefaultTimeWindow: async function (index) {
      if (!this.concurrent.extra[index].window) {
        this.concurrent.extra[index].window = 10
      }
    },
    validateTimeWindow: async function (event) {
      if (event.target.valueAsNumber < 10 || event.target.valueAsNumber > 60) {
        event.target.focus()
        event.target.classList.add('shake')
        event.target.style.border = 'red solid 3px'
        setTimeout(() => {
          event.target.classList.remove('shake')
        }, 1000)
      }
    },
    addRow: async function () {
      if (this.concurrent.extra.length <= 9) {
        this.concurrent.extra.push({})
      }
    },
    removeRow: async function (index) {
      this.concurrent.extra.splice(index, 1)
    },
    submit: async function () {
      await this.$axios
        .post(`concurrents/${this.type}/${this.id}`, this.concurrent)
        .then((response) => {
          // TODO: reset form, emit event to add to the new concurrent to the list
          // of parent component
          this.concurrent = { extra: [{}] }
        })
    },
  },
  mounted: async function () {
    this.concurrent.model_type = this.type
    this.concurrent.model_id = this.id
    await this.$axios
      .get('concurrents/getusersroles')
      .then((response) => (this.notifiables = response.data))
  },
}
</script>

<style scoped>
.item-selection {
  margin-bottom: 0.25rem;
  display: inline;
  margin-left: 1em;
}
.item-selection .btn {
  width: 10rem;
}

.btn-icon {
  width: 2rem !important;
}

.rows-3 {
  height: 5rem;
}
.rows-1 {
  height: 2rem;
}
.rows-2 {
  height: 3.5rem;
}

.wx-2 {
  max-width: 2rem !important;
}

.wx-3 {
  max-width: 3rem !important;
}
.wx-4 {
  max-width: 4rem !important;
}
.wx-6 {
  max-width: 6rem !important;
}
.wx-8 {
  max-width: 8rem !important;
}
.wx-10 {
  max-width: 10rem !important;
}

.wn-2 {
  min-width: 2rem !important;
}

.wn-3 {
  min-width: 3rem !important;
}
.wn-4 {
  min-width: 4rem !important;
}
.wn-6 {
  min-width: 6rem !important;
}
.wn-8 {
  min-width: 8rem !important;
}
.wn-10 {
  min-width: 10rem !important;
}

.w-2 {
  width: 2rem !important;
}

.w-3 {
  width: 3rem !important;
}
.w-4 {
  width: 4rem !important;
}
.w-6 {
  width: 6rem !important;
}
.w-8 {
  width: 8rem !important;
}
.w-10 {
  width: 10rem !important;
}
</style>
