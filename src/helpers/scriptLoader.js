const loadingPromises = {};

export function loadScript(src, id) {
  if (loadingPromises[src]) {
    return loadingPromises[src];
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id || "";
    script.type = "text/javascript";
    script.async = true;
    script.src = src;

    // Append to head
    document.head.appendChild(script);

    script.onload = () => {
      resolve();
    };

    script.onerror = function() {
      reject(new Error(`${this.src} failed to load`));
    };
  });

  loadingPromises[src] = promise;

  return promise;
}
