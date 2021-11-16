

var getDays = function getDays(n:any) {
    var now = new Date();
    var date = new Date( now.getTime() - n*24*3600*1000 );
    var year = date.getFullYear();
    var month = date.getMonth()+1 > 9? date.getMonth()+1 : "0"+(date.getMonth()+1);
    var day = date.getDate() > 9 ?date.getDate() : "0" + date.getDate();
    var a = year + "-" + month + "-" + day;
    return a
}
export default getDays;

