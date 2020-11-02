<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <ZCard class="modal-card">
          <ZForm class="modal-body">
            <div class="btn--close">
              <ZButton ghost shapeless class="pa-0" @click="closeModal">
                X
              </ZButton>
            </div>
            <ZInput v-model="bike.serial_number" label="Serial Number" />
            <ZInput
              v-model="lonString"
              @input="parseCoordinate($event, 0)"
              label="Longitude"
              type="number"
            />
            <ZInput
              v-model="latString"
              @input="parseCoordinate($event, 1)"
              label="Latitude"
              type="number"
            />
          </ZForm>

          <div class="btn--full-width">
            <ZDivider class="mt-2 mb-2" />
            <ZButton
              color="alt-blue"
              :disabled="isDisabled"
              :loading="postLoading"
              @click="addBike"
            >
              Add Bike
            </ZButton>
          </div>
        </ZCard>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    postLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      bike: {
        serial_number: "",
        location: {
          type: "Point",
          coordinates: new Array(2),
        },
        in_order: true,
        service_status: 1,
        battery_level: 100,
      },
      latString: "",
      lonString: "",
    };
  },
  computed: {
    isDisabled() {
      return !this.bike.serial_number || !this.latString || !this.lonString;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close:modal");
    },
    async addBike() {
      this.$emit("add:bikes", this.bike);
    },
    /**
     * @param input {string} Input string to be parsed to float
     * @param index {number} Index of array to update
     */
    parseCoordinate(input, index) {
      this.bike.location.coordinates[index] = parseFloat(input) || undefined;
    },
  },
};
</script>

<style lang="stylus" scoped>
.modal-mask
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;

.modal-wrapper
  display: table-cell;
  vertical-align: middle;

.modal-card
  max-width: 300px;
  margin: 0px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

.modal-header h3
  margin-top: 0;
  color: #42b983;

.modal-body
  margin: 20px 0;

.modal-default-button
  float: right;

.modal-enter
  opacity: 0;

.modal-leave-active
  opacity: 0;

.modal-enter .modal-container,
.modal-leave-active .modal-container
  -webkit-transform: scale(1.1);
  transform: scale(1.1);

.btn--full-width
    width: 100%;
    button
      width: 100%;

.btn--close {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
