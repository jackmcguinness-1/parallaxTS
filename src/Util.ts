export class Util{
    static 	getPosition(el: Element): vec2 {
		let xPosition: number = 0;
		let yPosition: number = 0;
        let htmlEl = (el as HTMLElement);
		while (htmlEl) {
			if (el.tagName == "BODY") {
				// deal with browser quirks with body/window/document and page scroll
				const xScrollPos: number = htmlEl.scrollLeft || document.documentElement.scrollLeft;
				const yScrollPos: number = htmlEl.scrollTop || document.documentElement.scrollTop;

				xPosition += htmlEl.offsetLeft - xScrollPos + el.clientLeft;
				yPosition += htmlEl.offsetTop - yScrollPos + el.clientTop;
			} 
			else {
				xPosition += htmlEl.offsetLeft - htmlEl.scrollLeft + htmlEl.clientLeft;
				yPosition += htmlEl.offsetTop - htmlEl.scrollTop + htmlEl.clientTop;
			}

			htmlEl = (htmlEl.offsetParent as HTMLElement);
		}
		return {
			x: xPosition,
			y: yPosition
		};
	}

	//this looks pretty inefficient, improve this if can be bothered
	static isEqual = (...objects: object[]) => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));
}

export type vec2 = {
    x: number,
    y: number
}