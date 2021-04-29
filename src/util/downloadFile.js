// 下载excel表格
export function downloadFile(res, fileName) {
    let blob = new Blob([res.data],{type: "application/vnd.ms-excel"});
    if (!fileName) {
        fileName = res.headers['content-disposition'].split('filename=').pop();
    }
    if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
    }
}