export function createMapButton(map) {
  const centerControlDiv = document.createElement("div");

  // eslint-disable-next-line
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}
