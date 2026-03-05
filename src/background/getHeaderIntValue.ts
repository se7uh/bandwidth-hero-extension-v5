const getHeaderIntValue = (
	headers: chrome.webRequest.HttpHeader[] | undefined,
	header: string,
): number | false => {
	if (headers && typeof header === "string") {
		for (let i = 0; i < headers.length; i++) {
			if (headers[i].name.toLowerCase() === header.toLowerCase()) {
				const value = headers[i].value
				return value ? parseInt(value, 10) || 0 : 0
			}
		}
	}

	return false
}

export default getHeaderIntValue
