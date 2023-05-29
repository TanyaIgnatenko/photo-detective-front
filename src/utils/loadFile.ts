export function loadFile(file: Blob, onLoad = (e: ProgressEvent<FileReader>) => {}) {
    let reader = new FileReader();
    reader.onload = onLoad;
    reader.readAsDataURL(file);
}