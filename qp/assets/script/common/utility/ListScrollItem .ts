// 列表滚动条目列表
export default class ListScrollItem {

    // y轴值
    public y: number = 0

    // x轴值
    public x: number = 0

    // 是否初始化条目
    public initedNode: boolean = false

    // 条目数据
    public data: any = null

    // 条目生成后的节点引用
    public node: cc.Node = null

    public init (x: number, y: number, data: any) {
        this.x = x
        this.y = y
        this.data = data
    }
}