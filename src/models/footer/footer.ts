import { a, div, p, vnode } from "../../library/exhibit/exhibit";
import './footer.scss'
export function footer():vnode{



    return div({className:'footer'},
    [
        div({className:'content-footer'}, 
        [
            a({href:'https://api.whatsapp.com/send?phone=79775956853'}, 'По техническим вопросам сайта пишите в ватсап'),
            p('© 2023 Сайт собран на framework Exhibit'),
     
        
        ])
    ])
}