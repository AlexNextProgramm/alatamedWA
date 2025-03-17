import { formatDate } from "../../../library/Date"
import { POST_MY } from "../../../library/GetPost"
import { ExhiDOM, div, h1, img, input, p, table, tr, vnode, th, td, textarea, btn, button } from "../../../library/exhibit/exhibit"
import { IsJsonString, family_min } from "../../../library/json"
import { click_phone_masck, format_tel, phone_mask } from "../../../library/upgrade_form"
import { Loading } from "../../../models/Loading/Loading"
import { ROLE } from "./constant_object"
import { news } from "./forms"
// import '../../../CSS/panel.scss'
 

  export function user(render:Function){
    const user_block = new ExhiDOM('panel')
    const breakImg = require('../../../images/whatsApp/break_1.png')

    function construct(BASE:Array<any>){
        const block = new ExhiDOM('table-base')

        const table_user:Array<vnode> = []
    
        table_user.push(
    
            tr([
                    th('id'),
                    th([ p('Имя')]),
                    th('Телефон'),
                    th('Роль'),
                    th('Дата восcт., пароля'),
                    th('Количество восст.,'),
                    th('Количество сообщений.,')
                ])
    
        )
    
    
    
        for(let i =  BASE.length - 1; i >= 0 ; i--){ //**цикл по таблице */
            let roles:Array<string> = []
             BASE[i]['role'].split('/').forEach((role:string)=>{
                roles.push(ROLE[role])
             })

            table_user.push(
                tr([
                    td(BASE[i]['id']),
                    td(family_min(BASE[i]['name'])),
                    td(format_tel(BASE[i]['telefone'])),
                    td(p(roles.join(' '))),
                    td(BASE[i]['update_password_date']!= ''?formatDate(BASE[i]['update_password_date'], true):"Не обновлялся"),
                    td(BASE[i]['count_update']?BASE[i]['count_update']:'0'),
                    td(BASE[i]['count_message']?BASE[i]['count_message']:'0'),
                ])
            )
        }
    
    
        block.render(()=>{
            return  table({className:'table-base'}, table_user)
        })
    }

    POST_MY('../php/router.php', 'get-user',  'ok').onload = function(){
        if(IsJsonString(this.responseText)){
         construct(JSON.parse(this.responseText))
        }else{
            console.error("Не нашел json в запросе функции базы")
            console.error(this.responseText)
        }
    }



    function Not(){
        console.log('Начали')

    }



function notis_form(){
        const form = new ExhiDOM('form-edit')
     

      function exit(){
            form.search('.form-edit', {className:'form-edit deactive'}, [])
      }

      function send(){
        const date = formatDate(new Date())
        const textareatext = <HTMLTextAreaElement>document.querySelector('#notif')

        POST_MY('../php/router.php', 'set-notif',  JSON.stringify({text:textareatext.value})).onload = function(){
            if(this.status == 200){
                textareatext.value = "Уведомление добавлено"
                textareatext.setAttribute("style", "background: #08cba1;")
            }
            console.log(this.responseText)
        
        }
      }


     form.render(()=>{
         return div({className:'form-edit', style:'justify-content: flex-start;'}, 
         [
            div({className:'form grose'},
               [
                  btn({className:'btn-exit', onclick:exit},'×'),
                  h1('Уведомления'),
                  textarea({placeholder:'Системные уведомления', id:'notif'}),
                  btn({className:'btn-send', onclick:send}, 'Добавить'),
               ])
         ])
      })
   

}




    user_block.render(()=>{
        return div({className:'panel base'},[
            h1("Пользователи"),
            div({className:'source-pannel'},
            [
               img({ className:'btn-breack', title:'Выход из панели пользователей', src:breakImg, onclick:()=>{render()} }),
                div([
                   
                    btn({className:'btn-href', onclick:notis_form},'Уведомления')
                ]),
                button({className:'btn-href', onclick:news}, 'Создать новость')
            ]),
            table({className:'table-base user'}, div({className:"load"},Loading())),
        ])
    })
}