import { DOM, atribute, el, useState } from "../../library/HTML";

export function inp_password(atribute:atribute){
        let img = require('./../../images/password_glass.png')
        let pass ='password'

        function glass_password(){
            if(pass == 'password') {
                pass = 'text'
            }else{
                pass = 'password'
            }
            let elm = document.querySelector('.div-password')
            elm?.children[0].setAttribute('type', pass)
        }
       
return( el('div', {className:'div-password'}, 
            [
                el('input', Object.assign(atribute, {type:pass,  minlength:'6'})),
                el('img',{src:img, onclick:glass_password} )
            ]))
        
}