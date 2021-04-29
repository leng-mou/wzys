// 格式化时间戳
export const dateFmt = (timeStamp = Date.now(), format = 'YYYY-MM-DD hh:mm:ss') => {
    let date = new Date(timeStamp)
    let formatNumber = (n) => n < 10 ? ('0' + n) : n
    let str = format
        .replace('YYYY', date.getFullYear())
        .replace('MM', formatNumber(date.getMonth() + 1))
        .replace('DD', formatNumber(date.getDate()))
        .replace('hh', formatNumber(date.getHours()))
        .replace('mm', formatNumber(date.getMinutes()))
        .replace('ss', formatNumber(date.getSeconds()))
    return str
}