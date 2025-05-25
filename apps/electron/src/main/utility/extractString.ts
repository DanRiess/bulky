/**
 * Returns part of a string that sits between the starting and end sequence.
 */
function extractString(str: string, startStr: string, endStr: string): string | undefined {
	return str.substring(str.indexOf(startStr) + startStr.length, str.indexOf(endStr))
}
