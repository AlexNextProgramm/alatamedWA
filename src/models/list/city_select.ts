import { my_cookie } from "../../library/cookie";
import { atribute } from "../../library/exhibit/exhibit";
import { ExhiDOM, option, select, vnode } from "../../library/exhibit/exhibit";

export function city_select(city:Array<string>, atribute:atribute){
    const exi = new ExhiDOM('city')
    let Arr:Array<vnode> = []
    city.forEach((val)=>{
        if(my_cookie.city && my_cookie.city == val){
            Arr.push(option({selected:true}, val))
        }else{
            Arr.push(option({}, val))
        }
    })
    
    exi.render = ()=>{
        return(
            select(atribute, Arr )
        )
    }
    // console.log(exi.WatchName)
return {WatchName:exi.WatchName, WatchId:exi.WatchId}

}