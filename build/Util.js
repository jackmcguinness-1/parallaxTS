export class Util {
    static getPosition(el) {
        let xPosition = 0;
        let yPosition = 0;
        let htmlEl = el;
        while (htmlEl) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                const xScrollPos = htmlEl.scrollLeft || document.documentElement.scrollLeft;
                const yScrollPos = htmlEl.scrollTop || document.documentElement.scrollTop;
                xPosition += htmlEl.offsetLeft - xScrollPos + el.clientLeft;
                yPosition += htmlEl.offsetTop - yScrollPos + el.clientTop;
            }
            else {
                xPosition += htmlEl.offsetLeft - htmlEl.scrollLeft + htmlEl.clientLeft;
                yPosition += htmlEl.offsetTop - htmlEl.scrollTop + htmlEl.clientTop;
            }
            htmlEl = htmlEl.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }
}
//this looks pretty inefficient, improve this if can be bothered
Util.isEqual = (...objects) => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));
//# sourceMappingURL=Util.js.map