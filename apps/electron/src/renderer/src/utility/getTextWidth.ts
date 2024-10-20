// Initialize canvas here for slightly better performance
const canvas = document.createElement('canvas')

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export function getTextWidth(text: string, font: string) {
	const context = canvas.getContext('2d')
	if (!context) return

	context.font = font
	const metrics = context.measureText(text)
	return metrics.width
}

/**
 * Extract the font values from a provided html element.
 * This can be used to calculate the text width with the canvas method.
 */
export function getCanvasFont(el = document.body) {
	const fontWeight = getCssStyle(el, 'font-weight') || '400'
	const fontSize = getCssStyle(el, 'font-size') || '16px'
	const fontFamily = getCssStyle(el, 'font-family') || 'Montserrat'

	return `${fontWeight} ${fontSize} ${fontFamily}`
}

/**
 * Return a computed css style.
 */
function getCssStyle(element: HTMLElement, prop: string) {
	return window.getComputedStyle(element, null).getPropertyValue(prop)
}
