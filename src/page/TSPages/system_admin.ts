import { ExhiDOM, body, btn, div, h1, img, input, label, option, p, select, vnode } from "../../library/exhibit/exhibit";
import '../../CSS/whatsApp.scss'
import '../../CSS/system_admin.scss'
import '../../CSS/panel.scss'
import { POST_MY } from "../../library/GetPost";
import { delete_Cookie, my_cookie } from "../../library/cookie";
//  let  my = require('./model/test')

import { constants, form_variable, new_button_forms, new_password, new_user, send } from "./model/forms";
import { left_panel } from "./model/left_panel";
import {  right_panel } from "./model/right_panel";
import { base_new } from "./model/base/base";
import { footer } from "./model/footer";
import { massage_panel } from "./model/massage_panel";
import { instruct } from "./model/instruction";
import { user } from "./model/user";
import { new_page, update_news } from "./model/news";
import { replaceAll } from "../../library/json";
import { nalog } from "./model/nalog/nalog";
import { info_sample } from "./model/dop/postcard";
// import {my}from './model/test'


export const system = new ExhiDOM('body')
const imgAlta = require('../../images/whatsApp/logo.jpg')

let options:Array<vnode> = []
let respons:any = {}

// список подключаемых модулей
system.InQueue = 
[
   ()=>left_panel(()=>system.render(system.vn_original)),
   ()=>right_panel( my_cookie.clinic? my_cookie.clinic: "Altamed", "system_admin"),
   ()=>footer(()=>instruct(()=>system.render(system.vn_original))),
   ()=>massage_panel(),
   ()=>info_sample()
]




let newsCount = 0

if(my_cookie.old_user  && my_cookie.old_user == 0){
   system.InQueue.push(new_password)
 }


 function exit_syst(){
  delete_Cookie('key')
   window.location.href = './../index.php'
 }


 export function get_sample_render_system(){

 
   POST_MY('../php/router.php', 'sample','ok').onload = function(){
         options = []
         respons = JSON.parse(this.responseText)
        let buttons:Array<send> =  respons.buttons.sort(function(a:send, b:send){
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
               return -1;
             }
             if (a.name.toLowerCase() > b.name.toLowerCase()) {
               return 1;
             }
             return 0;
         })
        buttons.forEach((bt:send)=>{
            options.push(option({value:bt.id}, bt.name))
         })
         system.render()
         
         
      }
   }


 get_sample_render_system()

function redact_btn(respons:any){
   respons.buttons.forEach((bt:send)=>{
      if(bt.id == system.WatchValue['redact']){
         new_button_forms(()=>{ get_sample_render_system()}, bt.id)
      }
   })
}
function link(){
      window.location.href = 'https://cc.odinmed.net/wam/php/reviews.php'
}

system.render(()=>{
   if(my_cookie.news_count  && my_cookie.news_count != 0){
      newsCount = Number(my_cookie.news_count)
    }else{
      newsCount = 0
    }

//  console.log(my_cookie.news_count)

return body({className:'atrrd', id:'fuc'}, 
  div({className:'content'},
    [
      div({className:'form-running-title deactive'}),
      div({className:'form-edit deactive'}),
      div({className:'header'}, 
         [
            div({className:'logo'}, 
               [
                  img({src:imgAlta, onclick:()=>system.render()}),
                  div({className:'description'},
                     [
                        p("Отправка сообщений WhatsApp"),
                        p({className:'name-role'},"Системный администратор"),
                        p({className:'name-role name-famyli'}, replaceAll("+"," ",my_cookie.name_user))
                       
                     ])
               
               ]),
               div({className:'btn-block'},
                  [
                     btn({ data:String(newsCount), className:newsCount != 0 ? 'btn-href news-btn':'btn-href news-btn count', onclick:()=>new_page(()=>system.render()) },'Новости'),
                     btn({ className:'btn-href', onclick:()=>user(()=>system.render(system.vn_original))}, 'Пользователи'),
                     btn({ className:'btn-href', onclick:()=>link()}, 'Отчет отзывы'),
                     btn({ className:'btn-href', onclick:()=>base_new(()=>system.render(system.vn_original))}, 'Отчет'),
                     btn({className:'btn-href', onclick:()=>nalog(()=>system.render(system.vn_original))}, "Налоговый вычет"),
                     btn({className:'btn-href', onclick:new_user}, "Новый пользователь"),
                     btn({className:'btn-href',  onclick:exit_syst}, "Выход"),
                  
                  ])
         ]), 
      div({className:'constructor'},
         [ 
            div({className:'redact-btn'}, 
            [
               select({ name:'redact'}, options),
               btn({className:'btn-href', innerHTML:'&#128221',  onclick:()=>redact_btn(respons)})
            ]),
            btn({ className:'btn-href', onclick:()=>new_button_forms(()=>{ get_sample_render_system()})}, 'Новый шаблон'),
            btn({className:'btn-href', onclick:()=>form_variable(get_sample_render_system)}, 'Переменные' ),
            btn({className:'btn-href', onclick:constants}, 'Константы' ),
            btn({className:'btn-href' }, '?' )
         ]),
      div({className:'panel'},
         [
            div({className:'left-panel'}),
            div({className:'right-panel'}),
            div({className:'message-panel'})
         ]),
      div({className:'footer'})
    ]))
   })


update_news()



