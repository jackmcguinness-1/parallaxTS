import ParallaxHandler from "./ParallaxHandler.js";

function main(): number{

    const parallaxScenes: HTMLCollectionOf<Element> = parseHtml();
    const parallaxHandler: ParallaxHandler = new ParallaxHandler(parallaxScenes);
    parallaxHandler.startAllScenes();

    return 0;
}

function parseHtml(): HTMLCollectionOf<Element>{
    const sceneContainers: HTMLCollectionOf<Element> = document.getElementsByClassName("parallaxScene")
    return sceneContainers;
}

main();