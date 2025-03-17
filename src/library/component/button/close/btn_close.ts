import { atribute, el } from '../../../HTML';
import './btn_close.css'


export function button_close(props?:atribute, children?:Array<any>|null ){
    if(props?.className) props.className = 'button_close '+ props.className
    let array_Element = [ el('span'),  el('span', {className:'revrece_span_btn'}) ]
    if(children) array_Element.push(...children)

     return(
        el('button',props,array_Element)
        )
}