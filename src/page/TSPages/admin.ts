import { ExhiDOM, body, btn, div, img,  p,  } from "../../library/exhibit/exhibit";
import '../../CSS/whatsApp.scss'
import '../../CSS/system_admin.scss'
import '../../CSS/panel.scss'

import { delete_Cookie, my_cookie } from "../../library/cookie";
//  let  my = require('./model/test')

import { new_password} from "./model/forms";
import { left_panel } from "./model/left_panel";
import {  right_panel } from "./model/right_panel";
import { base_new } from "./model/base/base";

import { massage_panel } from "./model/massage_panel";
import { footer } from "./model/footer";
import { instruct } from "./model/instruction";
import { new_page, update_news } from "./model/news";
import { replaceAll } from "../../library/json";
import { nalog } from "./model/nalog/nalog";
import { info_sample } from "./model/dop/postcard";
// import {my}from './model/test'


 export const system = new ExhiDOM('body')
const imgAlta = require('../../images/whatsApp/logo.jpg')


// список подключаемых модулей
system.InQueue = 
[
   ()=>left_panel(()=>system.render(system.vn_original)),
   ()=>right_panel( my_cookie.clinic? my_cookie.clinic: "Altamed", "admin"),
   ()=>massage_panel(),
   ()=>footer(()=>instruct(()=>system.render(system.vn_original))),
   ()=>info_sample()
]






let newsCount = 0

if(my_cookie.old_user  && my_cookie.old_user == 0){
   system.InQueue.push(new_password)
 }
if(my_cookie.news_count  && my_cookie.news_count != 0){
   newsCount = my_cookie.news_count
 }

 function exit_syst(){
  delete_Cookie('key')
   window.location.href = './../index.php'
 }




//  get_sample_render_system(system)


system.render(()=>{
if(my_cookie.news_count  && my_cookie.news_count != 0){
   newsCount = my_cookie.news_count
 }else{
   newsCount = 0
 }

return body({className:'atrrd', id:'fuc'}, 
  div({className:'content'},
    [
      div({className:'form-running-title deactive'}),
      div({className:'form-edit deactive'}),
      div({className:'header'}, 
      [
         div({className:'logo'}, 
         [
            img({src:imgAlta, onclick:()=>system.render(system.vn_original)}),
            div({className:'description'},
            [
               p("Отправка сообщений WhatsApp"),
               p({className:'name-role'},"Администратор клиники"),
                 p({className:'name-role name-famyli'}, replaceAll("+"," ",my_cookie.name_user))
            ])
         ]),
            div({className:'btn-block'},
            [
               btn({ data:String(newsCount), className:newsCount != 0 ? 'btn-href news-btn':'btn-href news-btn count', onclick:()=>new_page(()=>system.render(system.vn_original)) },'Новости'),
               btn({ className:'btn-href', onclick:()=>base_new(()=>system.render(system.vn_original))}, 'Отчет'),
               btn({className:'btn-href', onclick:()=>nalog(()=>system.render(system.vn_original))}, "Налоговый вычет"),
               btn({className:'btn-href',  onclick:exit_syst}, "Выход"),
            ])
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


