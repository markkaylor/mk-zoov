<template>
  <ZContainer class="py-2 info-window">
    <ZLabel>Serial Number:</ZLabel>
    <div class="pa-1">
      {{ bike.serial_number }}
    </div>

    <ZLabel>Battery Level:</ZLabel>
    <div class="pa-1">{{ bike.battery_level.toString() }}%</div>

    <ZLabel>Bike in order:</ZLabel>
    <div class="btn-group pa-1">
      <ZButton small @click="changeInOrder" :outline="!update.in_order">
        Yes
      </ZButton>
      <ZButton small @click="changeInOrder" :outline="update.in_order">
        No
      </ZButton>
    </div>

    <ZLabel>Service Status:</ZLabel>
    <div class="btn-group pa-1">
      <ZButton
        v-for="status in statusOptions"
        :key="status.code"
        @click="changeStatus(status.code)"
        :outline="status.code !== update.service_status"
        small
      >
        {{ status.message }}
      </ZButton>
    </div>
    <div class="btn--full-width">
      <ZDivider class="mt-2 mb-2" />
      <ZButton
        color="alt-blue"
        :disabled="isDisabled"
        :loading="updateLoading"
        @click="updateBike"
      >
        Update Bike
      </ZButton>
      <ZButton
        color="danger"
        class="mt-2"
        :loading="deleteLoading"
        @click="deleteBike"
      >
        Delete Bike
      </ZButton>
    </div>
  </ZContainer>
</template>

<script>
export default {
  props: {
    bike: {
      type: Object,
      required: true,
    },
    marker: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    updateLoading: {
      type: Boolean,
      required: true,
    },
    deleteLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      infoWindow: null,
      statusOptions: [
        { code: 1, message: "Free" },
        { code: 2, message: "Booked" },
        { code: 3, message: "In Use" },
      ],
      update: {
        in_order: null,
        service_status: null,
      },
    };
  },
  mounted() {
    // eslint-disable-next-line
    this.infoWindow = new google.maps.InfoWindow({
      content: this.$el,
      maxWidth: 500,
    });

    this.marker.addListener("click", () => {
      this.infoWindow.open(this.map, this.marker);
    });

    this.update.in_order = this.bike.in_order;
    this.update.service_status = this.bike.service_status;
  },
  computed: {
    isDisabled() {
      return (
        this.update.in_order === this.bike.in_order &&
        this.update.service_status === this.bike.service_status
      );
    },
  },
  methods: {
    /**
     * @param code {number} Service status enum
     */
    changeStatus(code) {
      this.update.service_status = code;
    },
    changeInOrder() {
      this.update.in_order = !this.update.in_order;
    },
    updateBike() {
      const update = { ...this.bike, ...this.update };
      // Send entire object, update will not patch the record
      // See: https://github.com/vasanthv/jsonbox#update
      this.$parent.$emit("update:bike", update);
    },
    deleteBike() {
      this.$emit("delete:bike", this.bike._id);
    },
  },
};
</script>

<style lang="stylus" scoped>
.info-window
  display: flex;
  flex-direction: column;
  align-items: center;
  label
    font-size: 1rem;
    margin: 5px 0;

.btn-group
  display: flex;
  justify-content: space-evenly;
  button
    margin-left: $step
    margin-right: $step

.btn--full-width
    width: 100%;
    button
      width: 100%;
</style>
