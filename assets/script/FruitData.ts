import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FruitData')
export class FruitData extends Component {
    @property
    // 水果ID
    public fruitId: number = 0
    // 碰撞次数
    public touchNum: number = 0
    // 是否合成
    public isSyn: boolean = false
    //
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


