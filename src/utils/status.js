export default (response) => {
  if (response.status >= 200 && response.status < 400) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}
