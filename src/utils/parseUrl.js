export default url => {
  try {
    const parser = new URL(url);
    return {
      schema: parser.protocol,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      search: parser.search,
      hash: parser.hash
    };
  } catch (e) {
    console.warn('Invalid URL passed to parseUrl:', url);
    return {
      schema: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: ''
    };
  }
}
