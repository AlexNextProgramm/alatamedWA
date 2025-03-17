 
 import { ExhiDOM, body, btn, button, div, h1, img, input, option, p, select, th} from "./library/exhibit/exhibit";
 import { click_phone_masck, phone_mask } from "./library/upgrade_form";
 import './CSS/whatsApp.scss'
 import { POST_MY } from "./library/GetPost";
 import { IsJsonString } from "./library/json";
import { my_cookie } from "./library/cookie";
 const  enter =  new ExhiDOM('body')
 const pass = enter.State({type:'password'}, {toggle:true})
 const pass_img = require('./images/whatsApp/glass_password.png')
 
 
 
 
 
 
 function ent(evt:any){
       if(evt.key == 'Enter') send_data()
      }

const info = enter.State({text:''})

let UpdatePass = false



function send_data(){
      enter.WatchName.form.focus()
      // console.log(enter.WatchValue)
      if(enter.WatchValue['password'] != '' && enter.WatchValue['tel'] != ''){
            // enter.search('.btn-send', {className:'btn-send btn-load'})
            document.querySelector('.btn-send')?.classList.toggle('btn-load')
            POST_MY('./php/router.php', 'include', JSON.stringify(enter.WatchValue)).onload = function(){
                  if(IsJsonString(this.responseText)){
                        let res  = JSON.parse(this.responseText)
                        if(res.status == 'ok'){
                              console.log(this.responseText)
                              window.location.href  = './index.php';
                        }
                  }else{
                        if(this.responseText ==  'Не верный пароль'){
                              UpdatePass = true
                        }

                        info.text = this.responseText
                        console.log(info.text)
                  }
                  console.log(this.responseText)
            }
      }else{
      info.text = 'Не все поля заполнены'
      }
 }
 function new_user_select(evt:any){
      my_cookie.role = evt.target.value
 }


 function undate_password(){
    if(enter.WatchValue['tel'] != ''){

      document.querySelector('.btn-send')?.classList.toggle('btn-load')
       POST_MY('./php/router.php', 'update-form-start-password', JSON.stringify(enter.WatchValue)).onload = function(){
            if(this.responseText == 'ok'){
                  info.text = 'Пароль выслан вам в WhatsApp'
            }else{
                  info.text = this.responseText
            }
       }
    }else{
      info.text =  'Ввeдите телефон для восcтановления'
    }
 }

 enter.render(()=>{
      
 return body(
            div({className:'form-edit'}, 
            div({className:'form', name:'form', onkeydown:ent},
            [
                  h1("Вход"),
                  select({className:'select-enter', onchange:new_user_select, name:'role'}, [
                     option({value:'admin', selected: my_cookie.role == 'admin'? true: false},'Администратор клиники'),
                     option({value:'senior_admin', selected: my_cookie.role == 'senior_admin'? true: false}, 'Старший Администратор'), 
                     option({value:'doctor',    selected: my_cookie.role == 'doctor'? true: false},'Врач'),
                     option({value:'marketing',  selected: my_cookie.role == 'marketing'? true: false},'Маркетинг'),
                     option({value:'system_admin',  selected: my_cookie.role == 'system_admin'? true: false},'Системный администратор'),
                  ]), 

                  input({type:'tel', name:'tel', placeholder:'Телефон', onkeydown:phone_mask, onfocus:click_phone_masck, maxlength:'16', tabIndex:'1', autocomplete:'tel'}),
                  div(input({type:pass.type, name:'password', maxlength:'50', placeholder:'Пароль', tabIndex:'2', autocomplete:'new-password'}), img({src:pass_img, onclick:()=>pass.type = 'text'})),
                  btn({className:'btn-send', onclick:send_data, tabIndex:'3'}, 'Войти'),
                  UpdatePass? button({className:'btn-send  bt-new-pas', onclick:undate_password}, "Восстановить"): div(),
                  info.text != ''? p(info.text):div()

            ])
      )
      )
      })
