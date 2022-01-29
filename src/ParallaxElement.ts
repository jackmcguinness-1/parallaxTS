import {Util, vec2} from "./Util.js";

export type ParallaxFrame = {
    element: Element
    children: ParallaxElement[],
    zIndex: number,
    scrollHeight: number,
    frameId: number
}

export type ParallaxScene = {
    frame: ParallaxFrame,
    listeners: SceneListeners,
    mousePos: vec2
    sceneId: number
}

export type ParallaxElement = {
    element: Element,
    zIndex: number,
    orientation: number,
    top: number,
    left: number,
    elementId: number
}

export type SceneListeners = {
    onClick: SceneListener,
    onMouseMove: SceneListener,
    onMouseEnter: SceneListener,
    onMouseLeave: SceneListener,
    onScroll: SceneListener
}

export interface SceneListener {
    (ev: Event | MouseEvent): void;
}

export const nullListener: SceneListener = ()=>{};

export const nullSceneListeners: SceneListeners = {
    onClick: nullListener,
    onMouseMove: nullListener,
    onMouseEnter: nullListener,
    onMouseLeave: nullListener,
    onScroll: nullListener
}