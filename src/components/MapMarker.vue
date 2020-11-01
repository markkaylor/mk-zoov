<template>
  <div v-if="marker">
    <MarkerInfoWindow
      @delete:bike="removeMarker"
      :map="map"
      :bike="bike"
      :marker="marker"
      :updateLoading="updateLoading"
      :deleteLoading="deleteLoading"
    />
  </div>
</template>

<script>
import MarkerInfoWindow from "@/components/MarkerInfoWindow";

export default {
  name: "MapMarker",
  components: {
    MarkerInfoWindow,
  },
  data() {
    return {
      marker: null,
    };
  },
  props: {
    bike: {
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
  mounted() {
    // eslint-disable-next-line
    this.marker = new google.maps.Marker({
      position: {
        lng: this.bike.location.coordinates[0],
        lat: this.bike.location.coordinates[1],
      },
      map: this.map,
    });
  },
  methods: {
    removeMarker(bikeId) {
      this.marker.setMap(null);
      this.$emit("delete:bike", bikeId);
    },
  },
};
</script>
