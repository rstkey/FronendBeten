<template>
  <div v-if="extra.frequency === 'daily'">
    <div
      class="input-group mb-1 daily-input-time"
      v-for="(alert, index) in extra.alerts"
      :key="index"
    >
      <input
        type="time"
        class="form-control wx-8"
        aria-label="time of day"
        v-model="alert.time"
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
  </div>
  <div class="mb-1 weekly-input-day" v-if="extra.frequency === 'weekly'">
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
</template>

<script>
export default {
  name: 'ConcurrentExtra',
  props: {
    extra: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.rows-2 {
  height: 3.5rem;
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
.w-8 {
  width: 8rem !important;
}
</style>
