import { atribute, el, vnode } from '../../library/HTML'
import './form.css'
export function form(atribute:atribute,vnode:vnode):vnode{
    
    return(el('div', {className:'fon'}, 
    [
        el('form',atribute, [ vnode ] )
    ]))

 }