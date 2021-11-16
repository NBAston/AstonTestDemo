


export default class UPointLogic {

    getPokerArrPoint(pokeData: number[]): string {
        let point = 0;
        let isA = false //是否有a
        let leng = pokeData.length
        for (let i = 0; i < leng; i++) {
            if (pokeData[i] != null) {
                let num = this.getOnePokePoint(pokeData[i])
                if (!isA) {
                    isA = num == 1 ? true : false
                }
                point += num;
            }
        }
        if (isA) {
            let minStr = point
            let maxStr = point + 10
            let str = minStr.toString()
            str = minStr.toString() + "/" + maxStr.toString()
            if (minStr == 21) {
                str = "21"
            }
            else if (maxStr > 21) {
                str = minStr.toString()
            }

            return str
        }
        else {
            return point.toString()
        }
    }
    getPokerArrPointMax(pokeData: number[]): string {
        let point = 0;
        let isA = false //是否有a
        let leng = pokeData.length
        for (let i = 0; i < leng; i++) {
            if (pokeData[i] != null) {
                let num = this.getOnePokePoint(pokeData[i])
                if (!isA) {
                    isA = num == 1 ? true : false
                }
                point += num;
            }
        }
        if (isA) {
            let minStr = point
            let maxStr = point + 10
            let str = minStr.toString()
            str = maxStr.toString()
            if (maxStr == 21 || minStr == 21) {
                str = "21"
            }
            else if (maxStr > 21) {
                str = minStr.toString()
            }

            return str
        }
        else {
            return point.toString()
        }
    }

    private getOnePokePoint(num: number): number {
        let point = num % 16;
        return (point > 10) ? 10 : point
    }
}
