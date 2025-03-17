import { atribute, el } from '../../../HTML';
import { button_close } from '../../button/close/btn_close';
import './skeleton_form.css'
function close_button(){ // Кнопка функци закрыть форму 
     document.querySelector('.fon-form')?.remove()// Удаляю фому 
}


export function form_skeleton(props:atribute, children?:Array<any>|undefined|null){
    props.onkeydown = function(key:KeyboardEvent){if(key.key ==='Enter')key.preventDefault() }
    let array_Element = []
    if(children) array_Element.push(...children)
     if(props.className){ 
        props.className = 'block-content_form '+ props.className
    }else{
        props.className = 'block-content_form'
     }
     
    return(
        el('div', {className:'fon-form', autofocus:'autofocus'},
        [
            el('div', {className:'form'},
            [
             button_close({className:'form_btn_setting', onclick:close_button}),
                el('form', props, array_Element)
            ])
        ]

    ))
}