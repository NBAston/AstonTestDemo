/**
* 创建:gj
* 作用:日志输出
*/
var UDebug = {
	isoff :true,  //是否关闭打印

	/**
	 * 
	 * @param obj string | any ({lv:number,msg:string})
	 */
	Log: function (obj: string | any) {
		if (UDebug.isoff) return;
		if (obj&&obj.lv) {
			console.log(obj.msg);
		} else {
			console.log(obj);
		}
	},
	Info:function (obj: string | any) {
		if (UDebug.isoff) return;
		console.log(JSON.stringify(obj));
	},
	assert(condition?: boolean, message?: string, ...data: any[]): void
	{
		if (UDebug.isoff) return;
		console.assert(condition, message, ...data);
	},
	clear(): void
	{
		if (UDebug.isoff) return;
		console.clear();
	},
	count(label?: string): void
	{
		if (UDebug.isoff) return;
		console.count(label);
	},
	debug(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.debug(message, ...optionalParams);
	},
	dir(value?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.dir(value, ...optionalParams);
	},
	dirxml(value: any): void
	{
		if (UDebug.isoff) return;
		console.dirxml(value);
	},
	error(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.error(message, ...optionalParams);
	},
	exception(message?: string, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.exception(message, ...optionalParams);
	},
	group(groupTitle?: string, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.group(groupTitle, ...optionalParams);
	},
	groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.groupCollapsed(groupTitle, ...optionalParams);
	},
	groupEnd(): void
	{
		if (UDebug.isoff) return;
		console.groupEnd()
	},
	info(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.info(JSON.stringify(message), ...optionalParams);
	},
	log(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.log(message,...optionalParams);
		// console.warn(message,...optionalParams);
	},
	markTimeline(label?: string): void
	{
		if (UDebug.isoff) return;
		console.markTimeline(label);
	},
	profile(reportName?: string): void
	{
		if (UDebug.isoff) return;
		console.profile(reportName);
	},
	profileEnd(reportName?: string): void
	{
		if (UDebug.isoff) return;
		console.profileEnd(reportName);
	},
	table(...tabularData: any[]): void
	{
		if (UDebug.isoff) return;
		console.table(...tabularData);
	},
	time(label?: string): void
	{
		if (UDebug.isoff) return;
		console.time(label);
	},
	timeEnd(label?: string): void
	{
		if (UDebug.isoff) return;
		console.timeEnd(label);
	},
	timeStamp(label?: string): void
	{
		if (UDebug.isoff) return;
		console.timeStamp(label);
	},
	timeline(label?: string): void
	{
		if (UDebug.isoff) return;
		console.timeline(label);
	},
	timelineEnd(label?: string): void
	{
		if (UDebug.isoff) return;
		console.timelineEnd(label);
	},
	trace(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.trace(message, ...optionalParams);
	},
	warn(message?: any, ...optionalParams: any[]): void
	{
		if (UDebug.isoff) return;
		console.warn(message, ...optionalParams);
	},
 }
export default UDebug;