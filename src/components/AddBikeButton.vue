<template>
  <div>
    <ZButton @click="openModal" color="alt-blue" class="mt-1 ml-1">
      Add Bike
    </ZButton>
  </div>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.$el);
  },
  methods: {
    openModal() {
      this.$emit("open:modal");
    },
  },
};
</script>

<style lang="scss" scoped></style>
