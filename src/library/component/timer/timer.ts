import test from "node:test";
import { DOM, el } from "../../HTML";
import { getTimeSecformat } from "../../Date";

export function timer(){
    const timer = new DOM('.timer')
    let time =  new Date(0)
    time.setHours(0)
    // console.log(t)
    
 setInterval(()=>{
  time.setSeconds(time.getSeconds()+ 1)
  timer.rerender()
        }, 1000)


    timer.render=()=>{
        return(el('p', {className:'timer-my',textContent:getTimeSecformat(time)}))
    }

}