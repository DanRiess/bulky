/**
 * Find all occurences of a string sequence in a string
 *
 * @param { string } searchStr The needle
 * @param { string } str The haystack
 */
export function findIndicesInString(searchStr: string, str: string, offset = 0) {
	const searchStrLen = searchStr.length
	if (searchStrLen === 0) {
		return []
	}

	const indices: number[] = []
	let index = offset

	str = str.toLowerCase()
	searchStr = searchStr.toLowerCase()

	while ((index = str.indexOf(searchStr, offset)) > -1) {
		indices.push(index)
		offset = index + searchStrLen
	}
	return indices
}
