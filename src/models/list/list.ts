import { ExhiDOM, atribute, button, div, img, input, li, option, p, select, ul, vnode } from "../../library/exhibit/exhibit";
import '../../app/app.scss'
export function search(Array:Array<string>, atribute:atribute = {},  searchFun:Function, className:string, butt:vnode = p({}, ''),){

const exi = new ExhiDOM(className)

let f = -1

atribute.type = 'text'
atribute.name = 'master'
if(atribute.onkeyup){
   let newkeyup:any =  atribute.onkeyup
   atribute.onkeyup = function(evt){
    newkeyup(evt)
    scan(evt, Array)
   }
}else{
    atribute.onkeyup = (evt)=>scan(evt, Array)
}
atribute.autocomplete = 'off'

function checkInput_ul(evt:any){
    let el = evt.target
   exi.WatchName.master.value = el.textContent
   searchFun( exi.WatchName.master.value)
   exi.WatchName.list.style = 'display: none;'
}
let nunstr = 0
let inpcontr = ''


function scan(evt:any, arr:Array<string>){
 let input = exi.WatchName.master
 let list = exi.WatchName.list

 if(input.value == ''){ 

       list.style = "display: none;"
        list_ul([])

    }else{

     if(inpcontr != input.value){
            let soursArr:Array<string> = arr.filter(
                (value)=>{
                return value.toUpperCase().indexOf(input.value.toUpperCase()) > -1
            })
        if(soursArr.length != 0){ 
            list.style = "display: block;"
            list_ul(soursArr)
        }else{
            list.style = "display: none;"
        }
     }

    }
    
    if(evt.key  == 'ArrowDown'){
        let onlist = list.querySelector('.onlist')
        if(onlist) onlist.classList.toggle('onlist')
        if(list.children.length - 1 < nunstr){
            nunstr = 0
            list.scrollBy(0, -(list.scrollHeight-20))
        }
        if( nunstr < 0){
            nunstr = list.children.length - 1
            // list.scrollBy(0, list.scrollHeight+20)
        }
        // console.log( list.scrollHeight/(list.children.length-1))
        list.children[nunstr].classList.toggle('onlist')
       list.scrollBy(0, list.scrollHeight/(list.children.length-1)-5)
        nunstr++
    }

    if(evt.key  == 'ArrowUp'){
        let onlist = list.querySelector('.onlist')
        if(onlist) onlist.classList.toggle('onlist')
        if( nunstr < 0){
            nunstr = list.children.length - 1
            list.scrollBy(0, list.scrollHeight + 20)
        }
        if(list.children.length - 1 < nunstr){
            nunstr = 0
            // list.scrollBy(0, -(list.scrollHeight + 20))
        }
   
        list.children[nunstr].classList.toggle('onlist')
        list.scrollBy(0, -((list.scrollHeight/(list.children.length-1)-5)))
        nunstr--
    }
    if(evt.key  == 'Enter'){
        let onlist = list.querySelector('.onlist')
        if(onlist){
            input.value = onlist.textContent
            searchFun(input.value)
            
        }
    }
    inpcontr = input.value
}


function list_ul(ArraySpecialist:Array<string>){
nunstr = 0
let exi = new ExhiDOM('list')
let shedule:Array<vnode> = []
if(ArraySpecialist.length != 0){
    ArraySpecialist.forEach((spec:string)=>{
        shedule.push(li({onclick:checkInput_ul, textContent:spec}))
    })
}


exi.render = () =>{
 return(
    ul({className:'list', name:'list'}, shedule)
 )
}

}

exi.render = ()=>{
    return( 
        div({className:className}, 
            [
            div({className:'searches-text'}, 
                [
                    input(atribute),
                    butt
                ]),
                ul({className:'list', name:'list'})
            ]))
}
return {WatchName:exi.WatchName, WatchId:exi.WatchId}

}