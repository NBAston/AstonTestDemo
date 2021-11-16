// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 创建:gj
 * 作用:随机数帮助类
 */
export default class URandomHelper {
    /**
     *  获取0-1
     */
    static random(): number {
        return Math.random();
    }
    /**
     * 
     * @param min  最小
     * @param max 最大
     */
    static randomBetween(min: number, max: number): number {
        let rd = URandomHelper.random();
        let sd = max - min;
        return min + Math.floor(sd * rd);
    }
}
