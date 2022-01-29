import {ParallaxFrame, ParallaxScene, ParallaxElement, SceneListeners, SceneListener} from "./ParallaxElement.js";
import { config } from "./ParallaxConfig.js";
import {Util, vec2} from "./Util.js";

class ParallaxHandler{

    public parallaxScenes: ParallaxScene[] = [];



    constructor(frames: HTMLCollectionOf<Element>){

        for(let i: number = 0; i < frames.length; i++){
            
            const element: Element = frames[i];
            const children: HTMLCollectionOf<Element> = element.children;


            const frame: ParallaxFrame = {element: element, children: [], zIndex: 0, frameId: i};
            const scene: ParallaxScene = this.constructScene(frame);

            (element as HTMLDivElement).ondragstart = ()=>{return false};
            
            for(let j: number = 0; j < children.length; j++){

                const childElement: Element = children[j];
                const zIndex: number = !isNaN(Number(childElement.getAttribute("zIndex"))) ? Number(childElement.getAttribute("zIndex")) : NaN;
                const orientation: number = !isNaN(Number(childElement.getAttribute("orientation"))) ? Number(childElement.getAttribute("orientation")) : NaN;
                if(zIndex === 0){
                    (childElement as HTMLElement).style.zIndex = String(zIndex);
                    (childElement as HTMLElement).ondragstart = ()=>{return false};
                    const top = Number((childElement as HTMLElement).style.top);
                    const left = Number((childElement as HTMLElement).style.left);
                    const parallaxElement: ParallaxElement = {element: childElement, zIndex: zIndex, orientation: orientation, top: top, left: left, elementId: j};
                    scene.frame.children.push(parallaxElement);
                }
                else if(zIndex && orientation){
                    (childElement as HTMLElement).style.zIndex = String(zIndex);
                    (childElement as HTMLElement).ondragstart = ()=>{return false};
                    const top = Number((childElement as HTMLElement).style.top);
                    const left = Number((childElement as HTMLElement).style.left);
                    const parallaxElement: ParallaxElement = {element: childElement, zIndex: zIndex, orientation: orientation, top: top, left: left, elementId: j};
                    scene.frame.children.push(parallaxElement);
                }
                else{
                    console.log(`Invalid zIndex or orientation on element ${childElement.getAttribute("id")}, check they are number-strings`);
                }
            }
            this.parallaxScenes.push(scene);
        }
        console.log(this.parallaxScenes);
    }

    startAllScenes(): void{
        this.parallaxScenes.forEach((scene: ParallaxScene)=>{
            this.startScene(scene);
        });
    }

    endAllScenes(): void{
        this.parallaxScenes.forEach((scene: ParallaxScene)=>{
            this.endScene(scene);
        });
    }

    startScene(scene: ParallaxScene): void{
        console.log("starting scene");
        this.activateListeners(scene);
        return;
    }

    endScene(scene: ParallaxScene): void{
        console.log("ending scene");
        this.deactivateListeners(scene);
        return;
    }

    activateListeners(scene: ParallaxScene): void{
        scene.frame.element.addEventListener("click", scene.listeners.onClick);
        scene.frame.element.addEventListener("mousemove", scene.listeners.onMouseMove);
        scene.frame.element.addEventListener("mouseleave", scene.listeners.onMouseLeave);
        scene.frame.element.addEventListener("mouseenter", scene.listeners.onMouseEnter);
    }

    deactivateListeners(scene: ParallaxScene): void{
        scene.frame.element.removeEventListener("click", scene.listeners.onClick);
        scene.frame.element.removeEventListener("mousemove", scene.listeners.onMouseMove);
        scene.frame.element.removeEventListener("mouseleave", scene.listeners.onMouseLeave);
        scene.frame.element.removeEventListener("mouseenter", scene.listeners.onMouseEnter);
    }

    constructScene(frame: ParallaxFrame): ParallaxScene{
        const listeners: SceneListeners = this.getSceneListeners(frame);
        return {frame: frame, listeners: listeners, mousePos: {x: 0, y: 0}, sceneId: this.parallaxScenes.length};
    }

    getScene(frame: ParallaxFrame): ParallaxScene{
        // gets the stored scene if it has been made already, or constructs a new one if not
        let scene: ParallaxScene = {frame: frame, listeners: this.getSceneListeners(frame), mousePos: {x: 0, y: 0}, sceneId: -1};
        let sceneFound: boolean = false;
        this.parallaxScenes.forEach((storedScene: ParallaxScene)=>{
            if(Util.isEqual(storedScene.frame, frame)){
                sceneFound = true;
                scene = storedScene;
            }
        })
        if(!sceneFound){
            scene = this.constructScene(frame);
        }
        return scene;
    }

    getSceneListeners(frame: ParallaxFrame): SceneListeners{
        const mouseMove = (ev: Event)=>{ this.handleMouseMove(ev, frame) };
        const click = (ev: Event) => { this.handleClick(ev, frame) };
        const mouseLeave = (ev: Event) => { this.handleMouseLeave(ev, frame) };
        const mouseEnter = (ev: Event) => { this.handleMouseEnter(ev, frame) };
        const listeners: SceneListeners = {
            onClick: click,
            onMouseMove: mouseMove,
            onMouseEnter: mouseEnter,
            onMouseLeave: mouseLeave
        }
        return listeners;
    }

    handleMouseLeave(ev: Event, frame: ParallaxFrame): void{
        //handle mouse leave
        const scene: ParallaxScene = this.getScene(frame);
        scene.mousePos.x = (ev as MouseEvent).x;
        scene.mousePos.y = (ev as MouseEvent).y;
        console.log("mouse left scene");
    }

    handleMouseEnter(ev: Event, frame: ParallaxFrame): void{
        //handle mouse enter
        const scene: ParallaxScene = this.getScene(frame);
        scene.mousePos.x = (ev as MouseEvent).x;
        scene.mousePos.y = (ev as MouseEvent).y;
        console.log("mouse entered scene");
    }

    handleClick(ev: Event, frame: ParallaxFrame): void{
        const mouseEvent: MouseEvent = (ev as MouseEvent);
        const mousePos = {x: mouseEvent.pageX, y: mouseEvent.pageY}
        this.getRelativeMousePos(mousePos, frame);
        console.log("click");
    }

    handleMouseMove(ev: Event, frame: ParallaxFrame): void{
        // the logic for moving all the sub-elements goes here
        const scene: ParallaxScene = this.getScene(frame);
        frame.children.forEach((child)=>{
            //update top and left
            const dx = (ev as MouseEvent).x - scene.mousePos.x;
            const dy = (ev as MouseEvent).y - scene.mousePos.y;

            const gamma: number = Math.pow(child.zIndex, 2);
            const speed: number = config.PARALLAX_SPEED;
            const scale: number = window.innerWidth / 1920; // wack a scale factor here so we dont get mad issues with different screen sizes

            // move our parallax elements
            if(config.HORIZONTAL_PARALLAX_ENABLED){
                child.left += speed * scale * child.orientation * dx * gamma;
                (child.element as HTMLElement).style.left = `${child.left}px`;
            }
            if(config.VERTICAL_PARALLAX_ENABLED){
                child.top += speed * scale * child.orientation * dy * gamma;
                (child.element as HTMLElement).style.top = `${child.top}px`;
            }
            
        });

        //after each child is updated, update the scene mousePos for the next mouseMove event
        scene.mousePos.x = (ev as MouseEvent).x;
        scene.mousePos.y = (ev as MouseEvent).y;
    }

    getRelativeMousePos(absoluteMousePos: vec2, frame: ParallaxFrame): vec2{
        const elementPos: vec2 = Util.getPosition(frame.element);
        const relativeMousePos: vec2 = {x: absoluteMousePos.x - elementPos.x, y: absoluteMousePos.y - elementPos.y};
        console.log(relativeMousePos);
        return relativeMousePos
    }

    
}


export default ParallaxHandler;