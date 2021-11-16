
import AppGame from "../base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";

let gfx = cc.gfx;

var PokerMatType = {
    None: 0,
    DU: 1,
    UD: 2,
    DUAuto: 3,
    LR: 4,
    RL: 5,
    LRAuto: 6,
}

cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {

    },

    /**初始化扑克 */
    initPoker(data) {
        this.openCardFunc = data.openCardFunc;
        this.openedCallback = data.openedCallback;
        this.loadPoker(data.pokerData);
    },

    /**加载扑克 */
    loadPoker(pokerData) {
        console.log("initPoker pokerData => " + pokerData);
        var self = this;
        let pokerUrl = 'common/texture/pokerMipai/' + 'poker_' + pokerData;
        cc.resources.load(pokerUrl, cc.Texture2D, function (err, texture) {
            if (err) {
                console.log('-----error----')
                cc.error(err.message || err);
                return;
            }
            self.frontTexture = texture;
            self.startPoker();
        });
    },

    startPoker() {
        this.RubCardLayer_Dir_du = 0;//下上搓牌
        this.RubCardLayer_Dir_ud = 1;//上下搓牌
        this.RubCardLayer_Dir_lr = 2;//左右搓牌
        this.RubCardLayer_Dir_rl = 3;//右左搓牌
        this.RubCardLayer_Dir_No = 4;//不搓牌

        this.RubCardLayer_State_Move = 0;
        this.RubCardLayer_State_Smooth = 1;
        var RubCardLayer_Pai = 3.141592
        this.RubCardLayer_RotationFrame = 10
        this.RubCardLayer_RotationAnger = RubCardLayer_Pai / 3
        this.RubCardLayer_SmoothFrame = 10
        this.RubCardLayer_SmoothAnger = RubCardLayer_Pai / 6
        this.state = this.RubCardLayer_State_Move;

        this.smoothFrame = 1;
        this.isCreateNum = false;
        this.pokerRatio = 0;

        this.isTextureVertical = true
        this.initPos();
        this.udMesh = this.initMesh(false);
        this.lrMesh = this.initMesh(true);
        this.initMat();

        this.dirState = -1
        this.changeTouchMeshAndMat(this.RubCardLayer_Dir_du);

        this.registerTouch();
    },

    initPos() {
        var size = cc.winSize
        var zeye = size.height * 3 / (2 * 1.732050807568877);
        this.node.setPosition(cc.v3(0, 0, zeye))
        let camera = this.node.getComponent(cc.Camera);
        camera._fov = 60

        let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        this.meshRenderer = renderer

        this.pokerPosX = cc.winSize.width / 2
        this.pokerPosY = cc.winSize.height / 2
        var pokerWidth = 766
        var pokerHeight = 494
        if (this.isTextureVertical) {
            pokerWidth = 292 * 1.33
            pokerHeight = 224 * 1.33
        }
        this.pokerWidth = pokerWidth
        this.pokerHeight = pokerHeight
        this.pokerOffX = this.pokerPosX - this.pokerWidth / 2
        this.pokerOffY = this.pokerPosY - this.pokerHeight / 2

        this.touchStartY = this.pokerOffY
        this.touchStartUDY = this.pokerOffY + this.pokerHeight
        this.touchStartLRX = this.pokerOffX
        this.touchStartRLX = this.pokerOffX + this.pokerWidth;

        this.pokerRadius = pokerHeight / 10;
    },

    initMat() {
        this.matMap = {};
        for (var i = 0; i < 7; i++) {
            let material = this.meshRenderer.getMaterial(i);
            material.setProperty('radius', this.pokerRadius);
            material.setProperty('width', this.pokerWidth);
            material.setProperty('height', this.pokerHeight);
            material.setProperty('offx', this.pokerOffX);
            material.setProperty('offy', this.pokerOffY);
            material.setProperty('rotation', 0);
            //material.setProperty('textureBack', this.frontTexture);
            material.setProperty('textureFront', this.frontTexture);
            this.matMap[i] = material;
        }
    },

    changeTouchMeshAndMat(newDir) {
        if (this.dirState == newDir)
            return;
        this.dirState = newDir;
        if (newDir == this.RubCardLayer_Dir_ud) {
            //console.log('-----changeTouchMeshAndMat LR----')
            var newMat = this.matMap[PokerMatType.UD];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
            this.mesh = this.lrMesh;
            this.meshRenderer.mesh = this.udMesh;
        }
        else if (newDir == this.RubCardLayer_Dir_lr) {
            //console.log('-----changeTouchMeshAndMat LR----')
            var newMat = this.matMap[PokerMatType.LR];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
            this.mesh = this.lrMesh;
            this.meshRenderer.mesh = this.lrMesh;
        }
        else if (newDir == this.RubCardLayer_Dir_rl) {
            //console.log('-----changeTouchMeshAndMat RL----')
            var newMat = this.matMap[PokerMatType.RL];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
            this.mesh = this.lrMesh;
            this.meshRenderer.mesh = this.lrMesh;
        } else {
            //console.log('-----changeTouchMeshAndMat DU----')
            var newMat = this.matMap[PokerMatType.DU];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
            this.mesh = this.udMesh;
            this.meshRenderer.mesh = this.udMesh;
        }
    },

    changeToAutoMat() {
        if (this.isChangedMat)
            return;
        this.isChangedMat = true
        var dir = this.dirState
        if (dir == this.RubCardLayer_Dir_lr || dir == this.RubCardLayer_Dir_rl) {
            var newMat = this.matMap[PokerMatType.LRAuto];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
        } else {
            var newMat = this.matMap[PokerMatType.DUAuto];
            this.meshRenderer.setMaterial(0, newMat)
            this._material = newMat;
        }
    },

    registerTouch() {
        var self = this;
        self.node.setContentSize(3000, 3000);
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touches = event.getTouches();
            var location = touches[0].getLocation();
            var newDir = null;
            if (location.x > self.touchStartLRX && location.x < self.touchStartRLX && location.y < (self.touchStartY + 100)) {
                newDir = self.RubCardLayer_Dir_du
            }
            else if (location.x > self.touchStartLRX && location.x < self.touchStartRLX && location.y > (self.touchStartUDY - 100)) {
                newDir = self.RubCardLayer_Dir_ud
            }
            else if (location.y > self.touchStartY && location.y < (self.touchStartY + self.pokerHeight) && location.x < (self.touchStartLRX + 100)) {
                newDir = self.RubCardLayer_Dir_lr
            }
            else if (location.y > self.touchStartY && location.y < (self.touchStartY + self.pokerHeight) && location.x > (self.touchStartRLX - 100)) {
                newDir = self.RubCardLayer_Dir_rl
            }
            else {
                newDir = self.RubCardLayer_Dir_du
            }
            self.changeTouchMeshAndMat(newDir);
        }, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touches = event.getTouches();
            var location = touches[0].getLocation();
            //self.pokerRatio = (location.y-self.pokerOffY)/self.pokerHeight
            if (self.dirState == self.RubCardLayer_Dir_du) {
                self.pokerRatio = (location.y - self.touchStartY) / self.pokerHeight;
            }
            else if (self.dirState == self.RubCardLayer_Dir_ud) {
                self.pokerRatio = (self.touchStartUDY - location.y) / self.pokerHeight;
                // cc.log("self.pokerRatio=", self.pokerRatio)
            }
            else if (self.dirState == self.RubCardLayer_Dir_lr) {
                self.pokerRatio = (location.x - self.touchStartLRX) / self.pokerWidth;
            }
            else if (self.dirState == self.RubCardLayer_Dir_rl) {
                self.pokerRatio = (self.touchStartRLX - location.x) / self.pokerWidth;
            }
            self.pokerRatio = Math.max(0, self.pokerRatio)
            self.pokerRatio = Math.min(1, self.pokerRatio)
            //console.log("TOUCH_MOVE pokerRatio="+self.pokerRatio);
        }, self);
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (self.pokerRatio >= 1) {
                self.state = self.RubCardLayer_State_Smooth;
            }
            else {
                self.pokerRatio = 0
            }
        }, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (self.pokerRatio >= 1) {
                self.state = self.RubCardLayer_State_Smooth;
            }
            else {
                self.pokerRatio = 0
            }
        }, self);
    },

    unRegisterTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START)
        this.node.off(cc.Node.EventType.TOUCH_MOVE)
        this.node.off(cc.Node.EventType.TOUCH_END)
    },

    initMesh(isLeftRight) {
        var pokerWidth = this.pokerWidth;
        var pokerHeight = this.pokerHeight;
        var pokerMesh = new cc.Mesh();

        var vfmt = new gfx.VertexFormat([
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
        ]);

        var pokerDiv = 30
        var pointNum = pokerDiv * 2 + 2;
        pokerMesh.init(vfmt, pointNum, true);
        var arrayNum = pointNum * 2;
        var startPosX = 0;
        var startPosY = 0;
        var widthDis = pokerWidth / pokerDiv;
        var heightDis = pokerHeight / pokerDiv;
        var texHeightDis = 1 / pokerDiv;
        var posArray = new Float32Array(arrayNum);
        var texArray = new Float32Array(arrayNum);
        for (var i = 0; i < pointNum; i++) {
            var posX = startPosX;
            var posY = startPosY;
            if (isLeftRight) {
                if (i % 2 == 0) {
                    posX = (i / 2) * widthDis;
                } else {
                    posY = startPosY + pokerHeight;
                    posX = ((i - 1) / 2) * widthDis;
                }
                posX = posX + startPosX;
            } else {
                if (i % 2 == 0) {
                    posY = (i / 2) * heightDis;
                } else {
                    posX = startPosX + pokerWidth;
                    posY = ((i - 1) / 2) * heightDis;
                }
                posY = posY + startPosY;
            }

            posArray[i * 2] = posX
            posArray[i * 2 + 1] = posY

            if (isLeftRight) {
                if (i % 2 == 0) {
                    if (this.isTextureVertical) {
                        texArray[i * 2] = 1
                        texArray[i * 2 + 1] = (i / 2) * texHeightDis
                    } else {
                        texArray[i * 2] = (i / 2) * texHeightDis
                        texArray[i * 2 + 1] = 0
                    }
                } else {
                    if (this.isTextureVertical) {
                        texArray[i * 2] = 0
                        texArray[i * 2 + 1] = ((i - 1) / 2) * texHeightDis
                    } else {
                        texArray[i * 2] = ((i - 1) / 2) * texHeightDis
                        texArray[i * 2 + 1] = 1
                    }
                }
            } else {
                if (i % 2 == 0) {
                    if (this.isTextureVertical) {
                        texArray[i * 2] = (i / 2) * texHeightDis
                        texArray[i * 2 + 1] = 1
                    } else {
                        texArray[i * 2] = 0
                        texArray[i * 2 + 1] = (i / 2) * texHeightDis
                    }
                } else {
                    if (this.isTextureVertical) {
                        texArray[i * 2] = ((i - 1) / 2) * texHeightDis
                        texArray[i * 2 + 1] = 0
                    } else {
                        texArray[i * 2] = 1
                        texArray[i * 2 + 1] = ((i - 1) / 2) * texHeightDis
                    }
                }
            }
        }
        pokerMesh.setVertices(gfx.ATTR_POSITION, posArray, 0)
        pokerMesh.setVertices(gfx.ATTR_UV0, texArray, 0)

        var triangleNum = (pointNum / 2 - 1) * 6;
        var indiceArray = new Uint16Array(triangleNum);
        var index = 0;
        if (isLeftRight) {
            for (var i = 0; i < (pointNum - 2); i = i + 2) {
                indiceArray[index++] = i;
                indiceArray[index++] = i + 2;
                indiceArray[index++] = i + 1;
                indiceArray[index++] = i + 1;
                indiceArray[index++] = i + 2;
                indiceArray[index++] = i + 3;
            }
        }
        else {
            for (var i = 0; i < (pointNum - 2); i = i + 2) {
                indiceArray[index++] = i;
                indiceArray[index++] = i + 1;
                indiceArray[index++] = i + 2;
                indiceArray[index++] = i + 1;
                indiceArray[index++] = i + 3;
                indiceArray[index++] = i + 2;
            }
        }
        pokerMesh.setIndices(indiceArray, 0);
        return pokerMesh;
    },

    onDisable() {
        this.unRegisterTouch();
    },

    update(dt) {
        if (this.state == this.RubCardLayer_State_Move) {
            if (this._material) {
                this._material.setProperty('ratio', this.pokerRatio);
            }
        } else if (this.state == this.RubCardLayer_State_Smooth) {
            if (this.smoothFrame <= this.RubCardLayer_RotationFrame) {
                var rot = -this.RubCardLayer_RotationAnger * this.smoothFrame / this.RubCardLayer_RotationFrame;
                this._material.setProperty('rotation', rot);
            }
            else if (this.smoothFrame < (this.RubCardLayer_RotationFrame + this.RubCardLayer_SmoothFrame)) {
                this.changeToAutoMat()
                var scale = (this.smoothFrame - this.RubCardLayer_RotationFrame) / this.RubCardLayer_SmoothFrame;
                var rot = Math.max(0.01, this.RubCardLayer_SmoothAnger * (1 - scale));
                this._material.setProperty('rotation', rot);
            }
            else {
                console.log('update isCreateNum ' + this.isCreateNum)
                if (this.isCreateNum == false) {
                    this.isCreateNum = true
                    this._material.setProperty('rotation', 0.0);
                    this.unRegisterTouch();
                    var self = this;
                    self.openCardFunc && self.openCardFunc();
                    self.openedCallback && self.openedCallback();
                    setTimeout(() => {
                        console.log('update guan guan guan guan')
                        AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI)
                    }, 1000);
                }
            }
            this.smoothFrame = this.smoothFrame + 1
        }
    },
});
