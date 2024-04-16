export function delegate(parent, type, selector, handler) {
	
	function delegatedFunction(event) { 	
		const handlerElement = this; 
		const sourceElement = event.target; 
		const closestElement = sourceElement.closest(selector); 
		if (handlerElement.contains(closestElement)) { 
			const targetElement = closestElement; 
			handler.call(targetElement, event); 
		} 
	}

  parent.addEventListener(type, delegatedFunction);
}

export function getTileParam(bottomPadding, leftPadding, width, height, x, y){
	return {
		bottomPadding: bottomPadding,
		leftPadding: leftPadding,
		width: width,
		height: height,
		x: x,
		y: y,
	}
}
