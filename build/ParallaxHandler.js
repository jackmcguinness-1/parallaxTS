import { nullSceneListeners } from "./ParallaxElement.js";
import { configs } from "./ParallaxConfig.js";
import { Util } from "./Util.js";
class ParallaxHandler {
    constructor(frames) {
        this.parallaxScenes = [];
        for (let i = 0; i < frames.length; i++) {
            const element = frames[i];
            const children = element.children;
            const scrollHeight = window.scrollY;
            const frame = { element: element, children: [], zIndex: 0, scrollHeight: scrollHeight, frameId: i };
            const scene = this.constructScene(frame);
            element.ondragstart = () => { return false; };
            for (let j = 0; j < children.length; j++) {
                const childElement = children[j];
                const zIndex = !isNaN(Number(childElement.getAttribute("zIndex"))) ? Number(childElement.getAttribute("zIndex")) : NaN;
                const orientation = !isNaN(Number(childElement.getAttribute("orientation"))) ? Number(childElement.getAttribute("orientation")) : NaN;
                if (zIndex === 0) {
                    childElement.style.zIndex = String(zIndex);
                    childElement.ondragstart = () => { return false; };
                    const top = Number(childElement.style.top);
                    const left = Number(childElement.style.left);
                    const parallaxElement = { element: childElement, zIndex: zIndex, orientation: orientation, top: top, left: left, elementId: j };
                    scene.frame.children.push(parallaxElement);
                }
                else if (zIndex && orientation) {
                    childElement.style.zIndex = String(zIndex);
                    childElement.ondragstart = () => { return false; };
                    const top = Number(childElement.style.top);
                    const left = Number(childElement.style.left);
                    const parallaxElement = { element: childElement, zIndex: zIndex, orientation: orientation, top: top, left: left, elementId: j };
                    scene.frame.children.push(parallaxElement);
                }
                else {
                    console.log(`Invalid zIndex or orientation on element ${childElement.getAttribute("id")}, check they are number-strings`);
                }
            }
            this.parallaxScenes.push(scene);
        }
        console.log(this.parallaxScenes);
    }
    startAllScenes() {
        this.parallaxScenes.forEach((scene) => {
            this.startScene(scene);
        });
    }
    endAllScenes() {
        this.parallaxScenes.forEach((scene) => {
            this.endScene(scene);
        });
    }
    startScene(scene) {
        console.log("starting scene");
        this.activateListeners(scene);
        return;
    }
    endScene(scene) {
        console.log("ending scene");
        this.deactivateListeners(scene);
        return;
    }
    activateListeners(scene) {
        scene.frame.element.addEventListener("click", scene.listeners.onClick);
        scene.frame.element.addEventListener("mousemove", scene.listeners.onMouseMove);
        scene.frame.element.addEventListener("mouseleave", scene.listeners.onMouseLeave);
        scene.frame.element.addEventListener("mouseenter", scene.listeners.onMouseEnter);
        document.addEventListener("scroll", scene.listeners.onScroll);
    }
    deactivateListeners(scene) {
        scene.frame.element.removeEventListener("click", scene.listeners.onClick);
        scene.frame.element.removeEventListener("mousemove", scene.listeners.onMouseMove);
        scene.frame.element.removeEventListener("mouseleave", scene.listeners.onMouseLeave);
        scene.frame.element.removeEventListener("mouseenter", scene.listeners.onMouseEnter);
        document.removeEventListener("scroll", scene.listeners.onScroll);
    }
    constructScene(frame) {
        const listeners = this.getSceneListeners(frame);
        return { frame: frame, listeners: listeners, mousePos: { x: 0, y: 0 }, sceneId: this.parallaxScenes.length };
    }
    getScene(frame) {
        // gets the stored scene if it has been made already, or constructs a new one if not
        let scene = { frame: frame, listeners: nullSceneListeners, mousePos: { x: 0, y: 0 }, sceneId: -1 };
        let sceneFound = false;
        this.parallaxScenes.forEach((storedScene) => {
            if (Util.isEqual(storedScene.frame, frame)) {
                sceneFound = true;
                scene = storedScene;
            }
        });
        if (!sceneFound) {
            scene = this.constructScene(frame);
        }
        return scene;
    }
    getSceneListeners(frame) {
        const mouseMove = (ev) => { this.handleMouseMove(ev, frame); };
        const click = (ev) => { this.handleClick(ev, frame); };
        const mouseLeave = (ev) => { this.handleMouseLeave(ev, frame); };
        const mouseEnter = (ev) => { this.handleMouseEnter(ev, frame); };
        const scroll = (ev) => { this.handleScroll(ev, frame); };
        const listeners = {
            onClick: click,
            onMouseMove: mouseMove,
            onMouseEnter: mouseEnter,
            onMouseLeave: mouseLeave,
            onScroll: scroll
        };
        return listeners;
    }
    handleMouseLeave(ev, frame) {
        //handle mouse leave
        const scene = this.getScene(frame);
        scene.mousePos.x = ev.x;
        scene.mousePos.y = ev.y;
        console.log("mouse left scene");
    }
    handleMouseEnter(ev, frame) {
        //handle mouse enter
        const scene = this.getScene(frame);
        scene.mousePos.x = ev.x;
        scene.mousePos.y = ev.y;
        console.log("mouse entered scene");
    }
    handleClick(ev, frame) {
        const mouseEvent = ev;
        const mousePos = { x: mouseEvent.pageX, y: mouseEvent.pageY };
        this.getRelativeMousePos(mousePos, frame);
        console.log("click");
    }
    handleMouseMove(ev, frame) {
        // the logic for moving all the sub-elements goes here
        const scene = this.getScene(frame);
        frame.children.forEach((child) => {
            //update top and left
            const dx = ev.x - scene.mousePos.x;
            const dy = ev.y - scene.mousePos.y;
            const config = configs[frame.frameId];
            const gamma = Math.pow(child.zIndex, 2);
            const speed = config.MOUSEMOVE_PARALLAX_SPEED;
            const scale = window.innerWidth / 1920; // wack a scale factor here so we dont get mad issues with different screen sizes
            // move our parallax elements
            if (config.HORIZONTAL_PARALLAX_ENABLED) {
                child.left += speed * scale * child.orientation * dx * gamma;
                child.element.style.left = `${child.left}px`;
            }
            if (config.VERTICAL_PARALLAX_ENABLED) {
                child.top += speed * scale * child.orientation * dy * gamma;
                child.element.style.top = `${child.top}px`;
            }
        });
        //after each child is updated, update the scene mousePos for the next mouseMove event
        scene.mousePos.x = ev.x;
        scene.mousePos.y = ev.y;
    }
    handleScroll(ev, frame) {
        const config = configs[frame.frameId];
        if (config.SCROLL_ENABLED) {
            const ds = window.scrollY - frame.scrollHeight;
            frame.children.forEach((child) => {
                const gamma = Math.pow(child.zIndex, 2);
                const speed = config.SCROLL_PARALLAX_SPEED;
                const scale = window.innerWidth / 1920; // wack a scale factor here so we dont get mad issues with different screen sizes
                if (config.HORIZONTAL_PARALLAX_ENABLED) {
                    child.left += speed * scale * child.orientation * ds * gamma;
                    child.element.style.left = `${child.left}px`;
                }
            });
            frame.scrollHeight = window.scrollY;
        }
        else {
            return;
        }
    }
    getRelativeMousePos(absoluteMousePos, frame) {
        const elementPos = Util.getPosition(frame.element);
        const relativeMousePos = { x: absoluteMousePos.x - elementPos.x, y: absoluteMousePos.y - elementPos.y };
        console.log(relativeMousePos);
        return relativeMousePos;
    }
}
export default ParallaxHandler;
//# sourceMappingURL=ParallaxHandler.js.map