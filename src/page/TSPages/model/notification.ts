import { POST_MY } from "../../../library/GetPost";
import { my_cookie } from "../../../library/cookie";
import { ExhiDOM, btn, div, p } from "../../../library/exhibit/exhibit";


export function notification(text:string, bool = false){
    const notif = new ExhiDOM('notification')

    function exit(){
        const not = document.querySelector('.notification')
        not?.classList.toggle('deactive')
        my_cookie.notification = ''
        if(bool){
            POST_MY('../php/router.php', 'set_bool_notif', '1')
        }
    }


    notif.render(()=>{
        return div({className:'notification'}, 
        [
            btn({className:'btn-exit', onclick:exit},'×'),
            p(text)
        ])
    })

    

}