import { _decorator, Collider2D, Component, Contact2DType, easing, EventTouch, Input, input, instantiate, Node, Prefab, RigidBody2D, tween, UITransform, v3, Vec3 } from 'cc';
import { FruitData } from './FruitData';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    // 水果起始节点
    @property(Node)
    public fruitStart: Node = null

    // 水果父节点
    @property(Node)
    public fruitParent: Node = null

    // 水果预制体数组
    @property(Prefab)
    public fruitPrefab: Prefab[] = []

    // 当前水果节点
    private _currentFruit: Node = null

    start() {
        this.creatFruit()

        // 监听触摸开始事件
        this.node.on(Input.EventType.TOUCH_START,this.onTouchStart,this)
        // 触摸结束事件
        this.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this)

    }

    // 触摸开始事件
    public onTouchStart(event: EventTouch){
        let touchPos = event.getUILocation()//获取触摸位置
        let parentPos = this.fruitParent.getComponent(UITransform).convertToNodeSpaceAR(v3(touchPos.x,touchPos.y,0))// 将触摸位置转换成水果父节点位置
        let fruitPos = this._currentFruit.getPosition()//获取当前水果坐标
        fruitPos.x = parentPos.x
        // this._currentFruit.setPosition(fruitPos)
        tween(this._currentFruit).to(0.2,{position: fruitPos}).start()
    }   

    // 触摸结束事件
    public onTouchEnd(event: EventTouch){
        this._currentFruit.getComponent(RigidBody2D).enabled = true // 启用刚体组件
        this._currentFruit = null
        this.scheduleOnce(this.creatFruit,1)
    }

    // 创建水果
    public creatFruit(){
        let fruitId = Math.floor(Math.random() * 1)// 随机获取水果ID
        let fruitNode = instantiate(this.fruitPrefab[fruitId])
        fruitNode.setPosition(this.fruitStart.position)
        fruitNode.getComponent(RigidBody2D).enabled = false
        fruitNode.getComponent(RigidBody2D).gravityScale = 10 // 设置重力
        fruitNode.getComponent(FruitData).fruitId = fruitId // 设置水果ID
        let collider = fruitNode.getComponent(Collider2D)
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this)
        this.fruitParent.addChild(fruitNode)
        this._currentFruit = fruitNode

    }

    // 监听碰撞事件
    public onBeginContact(selfCollider: Collider2D,oterCollider: Collider2D){
        // 如果另一个碰撞体不是水果则忽略
        if(oterCollider.group !== Math.pow(2,1)) return
        let selfColliderData = selfCollider.getComponent(FruitData)// 获取当前水果数据
        let otherColliderData = oterCollider.getComponent(FruitData)// 获取另一个水果数据
        // 如果水果类型不同则忽略
        if(selfColliderData.fruitId !== otherColliderData.fruitId) return
        // 如果水果已合成则忽略
        if(selfColliderData.isSyn || otherColliderData.isSyn) return
        selfColliderData.isSyn = true
        otherColliderData.isSyn = true

        let synFruitId = selfColliderData.fruitId + 1 // 合成水果
        if(selfColliderData.fruitId + 1 > 2)  return
        let synFruitStart = selfCollider.node.position // 合成位置

        this.creatSynFruit(synFruitId,synFruitStart)

        this.scheduleOnce(()=>{
            selfCollider.node.destroy()
            oterCollider.node.destroy()
        },0.2)
    }

    // 创建合成水果
    public creatSynFruit(fruitId: number,fruitStart: Vec3){
        let synFruitNode = instantiate(this.fruitPrefab[fruitId]) // 创建合成水果节点
        fruitStart.y += 50 // 增加偏移量
        synFruitNode.setPosition(fruitStart)
        synFruitNode.setScale(0.8,0.8) // 设置缩放
        let collider = synFruitNode.getComponent(Collider2D) 
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this)
        // 禁用刚体
        synFruitNode.getComponent(RigidBody2D).enabled = false
        synFruitNode.getComponent(RigidBody2D).gravityScale = 10 // 设置重力
        synFruitNode.getComponent(FruitData).fruitId = fruitId //设置水果ID

        this.fruitParent.addChild(synFruitNode)
        // 缓动1倍
        tween(synFruitNode)
        .to(0.2,{scale: new Vec3(1,1)},{easing:'backInOut'})
        .call(()=>{
            // 启用刚体组件
            synFruitNode.getComponent(RigidBody2D).enabled = true
        }).start()

    }

    update(deltaTime: number) {
        
    }
}


