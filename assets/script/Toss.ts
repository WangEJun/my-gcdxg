import { _decorator, Component, director, EventTouch, find, Input, log, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Toss')
export class Toss extends Component {
    start() {
        this.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this)
    }

    update(deltaTime: number) {
        
    }

    public onTouchEnd(event: EventTouch){
        // log('颠勺')
        const potNode = find('Canvas/Pot')
        // log(`potNode:${potNode.getPosition()}`)
        const originalPos = potNode.position.clone();
        const targetPos = new Vec3(
            originalPos.x +  Math.floor(Math.random() * 201) - 100,
            originalPos.y +  Math.floor(Math.random() * 201) - 100,
            originalPos.z
        );
        log(targetPos)
        tween(potNode)
            .to(0.08, { position: targetPos })
            // .delay(0.05) // 停留片刻
            .to(0.08, { position: originalPos }) // 回到原位
            .start()
    }   
}


