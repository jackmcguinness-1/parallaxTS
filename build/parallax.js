import ParallaxHandler from "./ParallaxHandler.js";
function main() {
    const parallaxScenes = parseHtml();
    const parallaxHandler = new ParallaxHandler(parallaxScenes);
    parallaxHandler.startAllScenes();
    return 0;
}
function parseHtml() {
    const sceneContainers = document.getElementsByClassName("parallaxScene");
    return sceneContainers;
}
main();
//# sourceMappingURL=parallax.js.map