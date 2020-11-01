<template>
  <div id="app">
    <div id="map" ref="map">
      <div v-if="map && bikes">
        <AddBikeButton @open:modal="openModal" :map="map" />
        <MapMarker
          :key="bike._id"
          v-for="bike in bikes"
          :bike="bike"
          :map="map"
          :updateLoading="ui.updateLoading"
          :deleteLoading="ui.deleteLoading"
          @update:bike="updateBike"
          @delete:bike="deleteBike"
        />
      </div>
    </div>
    <AddBikeModal
      v-if="showModal"
      @close:modal="closeModal"
      @add:bikes="addBike"
      :postLoading="ui.postLoading"
    />
  </div>
</template>

<script>
import axios from "axios";

import { loadScript } from "@/helpers/scriptLoader";

import MapMarker from "@/components/MapMarker";
import AddBikeButton from "@/components/AddBikeButton";
import AddBikeModal from "@/components/AddBikeModal";

export default {
  name: "App",
  components: { MapMarker, AddBikeButton, AddBikeModal },
  data() {
    return {
      map: null,
      bikes: null,
      showModal: false,
      ui: {
        updateLoading: false,
        deleteLoading: false,
        postLoading: false,
      },
    };
  },
  async mounted() {
    await this.getBikes();

    try {
      await loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`
      );

      this.initMap();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    initMap() {
      // eslint-disable-next-line
      this.map = new google.maps.Map(this.$refs.map, {
        zoom: 12,
        center: {
          lat: this.bikes[0].location.coordinates[1],
          lng: this.bikes[0].location.coordinates[0],
        },
        mapTypeControl: false,
      });
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async getBikes() {
      try {
        const bikes = await axios.get(
          `https://jsonbox.io/${process.env.VUE_APP_JSON_BOX_ID}`
        );

        const { data } = bikes;
        this.bikes = data;
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @param bike {object} bike to add
     */
    async addBike(bike) {
      try {
        this.ui.postLoading = true;
        const result = await axios.post(
          `https://jsonbox.io/${process.env.VUE_APP_JSON_BOX_ID}`,
          [bike]
        );

        const { data } = result;
        this.bikes = [...this.bikes, data[0]];
        this.ui.postLoading = false;
        this.showModal = false;
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @param bikeUpdate {object} bike to update
     */
    async updateBike(bikeUpdate) {
      try {
        this.ui.updateLoading = true;
        await axios.put(
          `https://jsonbox.io/${process.env.VUE_APP_JSON_BOX_ID}/${bikeUpdate._id}`,
          bikeUpdate
        );

        this.bikes = this.bikes.map((bike) =>
          bike._id === bikeUpdate._id ? bikeUpdate : bike
        );
        this.ui.updateLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @param id {string} bike id to delete
     */
    async deleteBike(id) {
      try {
        this.ui.deleteLoading = true;
        await axios.delete(
          `https://jsonbox.io/${process.env.VUE_APP_JSON_BOX_ID}/${id}`
        );

        this.bikes = this.bikes.filter((bike) => bike._id !== id);
        this.ui.deleteLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style lang="stylus">
#app
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: $weights.normal
  color: $colors.black.base;


#map
  height: 100vh;
  width: 100%;

.gm-style
  font: 400 14px $font-family

.gm-style .gm-style-iw-c
  // Override google inline style
  max-width: max(300px, 100% - 80px) !important;
</style>
