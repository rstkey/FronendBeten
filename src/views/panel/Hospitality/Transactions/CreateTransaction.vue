<template>
  <div class="card border-success mb-4">
    <div class="card-header">Create Transaction</div>

    <div id="ialert" class="" role="alert"></div>
    <form method="post">
      <div class="card-body">
        <div class="form-floating mb-3">
          <select
            name="hospitality_id"
            id="hospitality_id"
            class="form-control"
          >
            <option>Choose Hospitality</option>
            <option value="1">Hospitality 1</option>
          </select>
          <label for="hospitality_id">Hospitality</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="to_model_type"
            name="to_model_type"
            placeholder="To Model Type..."
            required
            autocomplete="off"
          />
          <label for="to_model_type">To Model Type</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="to_model_id"
            name="to_model_id"
            placeholder="To Model ID..."
            required
            autocomplete="off"
          />
          <label for="to_model_id">To Model ID</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="quantity"
            name="quantity"
            placeholder="Quantity..."
            required
            autocomplete="off"
          />
          <label for="quantity">Quantity</label>
          <div class="invalid-feedback"></div>
        </div>
      </div>

      <div class="card-footer text-end">
        <a class="btn btn-outline-success ajax">{{ $t('Save') }}</a>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'create_transaction',
}
</script>
