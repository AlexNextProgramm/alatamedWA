import { atribute } from "../../library/HTML";
import { ExhiDOM, div, img, option, p, select, vnode } from "../../library/exhibit/exhibit";
import './select.scss'
export function selectNumber(start:number, end:number, atribute:atribute, step:number = 1):vnode{
    let arr:Array<vnode> = []

    for(start; start < end; start = start+ step){
        arr.push(option(String(start)))
    }
    return(select(atribute, arr))
}
// Кастомный селект time на базе Exhibit
export function selectTime(atribute:atribute,  Exi?:ExhiDOM):vnode{
    const timeImg = require('../../images/page-index/time.com.png')
    
    if(!atribute.value){
        atribute.value = '00:00'
    }
    if(Exi){
        if(atribute.name){
            Exi.WatchValue[atribute.name] = atribute.value
           }
       }
    if(atribute.className){
        atribute.className = 'time-select ' + atribute.className
    }else{
        atribute.className = 'time-select'
    }
    let ArrMinute:Array<vnode> = []
    for(let Minute = 0; Minute < 60; Minute++){
        let str:string = String(Minute)
         if(Minute < 10) str = '0'+ Minute
         if(str == atribute.value.split(':')[1]){
            ArrMinute.push(option({selected:true},str))
        }else{
            ArrMinute.push(option(str))
        }
    }
    let ArrHourse:Array<vnode> = []
    for(let Hourse = 0; Hourse < 24; Hourse++){
        let str:string = String(Hourse)
         if(Hourse < 10) str = '0'+ Hourse
        if(str == atribute.value.split(':')[0]){
            ArrHourse.push(option({selected:true},str))
        }else{
            ArrHourse.push(option(str))
        }
    }
    function onMinute(evt:any){
     const value = evt.target.value
     const elmParent = evt.target.parentElement
     elmParent.setAttribute('value', elmParent.getAttribute('value').split(':')[0]+ ':' + value)   
     
     if(Exi){
         if(atribute.name){
             Exi.WatchValue[atribute.name] = elmParent.getAttribute('value')
            }
        }
    }
    function onHourse(evt:any){
        const value = evt.target.value
        const elmParent = evt.target.parentElement
        elmParent.setAttribute('value', value + ':' + elmParent.getAttribute('value').split(':')[1])
        // console.log(elmParent.value)
        if(Exi){
            if(atribute.name){
                Exi.WatchValue[atribute.name] = elmParent.getAttribute('value')
            }
        }
    }
    return div(atribute,
    [
        img({src:timeImg}),
        select({className:'time-hour',  onchange:onHourse, }, ArrHourse),
        p(':'),
        select({className:'time-minute', onchange:onMinute, }, ArrMinute),
    ])
}