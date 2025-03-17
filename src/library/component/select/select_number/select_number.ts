import exp from 'constants'
import { DOM, ElementVnode, el, vnode } from '../../../HTML'
import './select_number.css'
interface option{
    Option1?:string|undefined
    className?:string
    name?:string
    start:number
    end:number
    [name: string]: any;

}
   export function select_number(Option:option){
    let  select = new DOM()
    let Array:Array<vnode> = []
    if(Option?.Option1) Array.push(el('option', {textContent:Option.Option1}))
    for(let i = Option.start; i < Option.end+1; i++ ){
     let n:string = String(i)
     if(i < 10) n = '0'+ String(i)
      Array.push(el('option', {textContent:n }))
    }


    select.render = ()=>{
        return el('select', Option, [
            ...Array
        ])
    }
    return select.innerHTML.vnode
    
   }
export function select_price(){
    
}