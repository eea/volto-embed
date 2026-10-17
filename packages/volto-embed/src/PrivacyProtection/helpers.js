export function createImageUrl(result) {
  const decoded = window.atob(result.data);
  const byteNumbers = new Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    byteNumbers[i] = decoded.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const image = new Blob([byteArray], { type: result['content-type'] });
  return URL.createObjectURL(image);
}
