import { atribute, el, vnode } from '../../../HTML';
import './burger.css'

export function burger(props?:atribute):vnode{
    let option:atribute = props||{}
    option.className = props?.className + ' burger-lib '
    return(
        el('button', option,
            [
                el('p',{className:'sp-top'}),
                el('p', {className:'sp-center'}),
                el('p',{className:'sp-bottom'})
            ])
            )
}