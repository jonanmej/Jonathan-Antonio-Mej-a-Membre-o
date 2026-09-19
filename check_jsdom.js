const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head></head><body><div id="root"></div></body></html>`, { runScripts: "dangerously", resources: "usable" });
dom.window.console.log = (...args) => console.log("LOG:", ...args);
dom.window.console.error = (...args) => console.log("ERROR:", ...args);
dom.window.addEventListener("error", (event) => {
    console.log("UNHANDLED ERROR:", event.error);
});
// Need to load the compiled index.js? It's harder with jsdom and vite.
