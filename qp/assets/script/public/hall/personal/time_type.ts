import getDays from "./getDays";
import personal from "./personal";

export class time{
    startDate : string;
    endDate : string;
}

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = (curDate.getMonth() + 1 > 9) ?  curDate.getMonth() + 1 : "0" +  (curDate.getMonth() + 1) ;
var curDay = (curDate.getDate() > 9) ? curDate.getDate() : "0" + curDate.getDate();

var time_type :{ [key :string]: time} = {

    ["全部时间"]: {
        startDate:"",
        endDate : "",

    },

    ["今天"]: {
        startDate : curYear + "-" + curMonth + "-" + curDay,
        endDate : curYear + "-" + curMonth + "-" + curDay,
    },

    ["昨天"]: {
        startDate : getDays(1).toString(),
        endDate : getDays(1).toString(),

    },

    ["七天以内"]: {
        startDate : getDays(6).toString(),
        endDate : curYear + "-" + curMonth + "-" + curDay,

    },

    ["十五天以内"]: {
        startDate : getDays(14).toString(),
        endDate : curYear + "-" + curMonth + "-" + curDay,

    },

    ["三十天以内"]: {
        startDate : getDays(29).toString(),
        endDate : curYear + "-" + curMonth + "-" + curDay,

    },

}
export default time_type;
