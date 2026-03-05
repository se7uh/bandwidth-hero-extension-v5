const patchContentSecurity = (
	headers: chrome.webRequest.HttpHeader[],
	proxyUrl: string,
): chrome.webRequest.HttpHeader[] => {
	const url = new URL(proxyUrl)
	const proxyHost = `${url.protocol}//${url.host}`
	const isHttp = url.protocol === "http:"

	return headers.map((header) => {
		return header.name && /content-security-policy/i.test(header.name)
			? {
					name: header.name,
					value: stripMixedContentCSP(header.value || "", isHttp)
						.replace("img-src", `img-src ${proxyHost}`)
						.replace("default-src", `default-src ${proxyHost}`)
						.replace("connect-src", `connect-src ${proxyHost}`),
				}
			: header
	})
}

function stripMixedContentCSP(CSPHeader: string, isHttp: boolean): string {
	return isHttp ? CSPHeader.replace("block-all-mixed-content", "") : CSPHeader
}

export default patchContentSecurity
