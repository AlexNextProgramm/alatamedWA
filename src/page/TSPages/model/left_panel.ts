import { my_cookie } from "../../../library/cookie";
import { ExhiDOM, btn, div, input, option, p, select, vnode } from "../../../library/exhibit/exhibit";
import { replaceAll, replaceArrayAll } from "../../../library/json";
import { CLINIC } from "./constant_object";
import { notification } from "./notification";







 export function left_panel(render:any){
    const left = new ExhiDOM('left-panel')
    if(!my_cookie.clinic) my_cookie.clinic = 'Altamed'

   function update_clinic(evt:any){
     my_cookie.clinic = evt.target.value
     render()
   }

   if(my_cookie.notification && my_cookie.notification != ''){
      const text = replaceAll('+',' ', my_cookie.notification)
      left.InQueue.push(()=>notification(text , true))
     
   }

   




left.render(()=>{

      const ClickOption:Array<vnode> = []
      Object.keys(CLINIC).forEach((names:string)=>{
        ClickOption.push( option({value:names, selected:my_cookie.clinic == names? true: false}, CLINIC[names]))
      })

      return  div({className:'left-panel'}, 
        [
            div({className:'block-left'}, 
           [
                p({className:'required'},"Отправитель"),
                select({className:'sel-clinic', onchange:update_clinic}, ClickOption)
           ]),
           div({className:'block-left form-left-enter'}),
           div({className:'block-left info-left-whatsApp'}),
           div({className:'notification deactive'})
        ])})
}






export function info_left_whatsApp(telefon?:string|undefined){
 const info_left = new ExhiDOM('info-left-whatsApp')

 if(telefon){
  telefon = replaceArrayAll(["+",")","(","-", "-"], "", telefon)
 }

 function begin(){
  const tel  = <HTMLInputElement>document.querySelector("#begin")
  if(tel.value != ""){
    window.open("https://web.whatsapp.com/send?phone=" + tel.value, '_blank');
  }
 }

  info_left.render(()=>{
    return div({className:'block-left info-left-whatsApp'}, 
    [
      p({className:'border_end'},'После отправки сообщения вы можете продолжить общение с клиентом в Jivo чате. Отправленое сообщение так же отобразится в Jivo. <br>'),
      p({className:'border_end'},'Для отправки сообщения через WhatsApp Web Наберите номер и нажмите "Начать чат". Для отправки потребуется подключение рабочего сотового телефона к WhatsApp WEB.'),
      p('Введите телефон в формате:<br>7XXXXXXXXXX'),
      input({type:'tel', placeholder:'WhatsApp WEB', value:telefon? telefon : '', id:"begin"} ),
      btn({className:'btn-href' , onclick:begin}, "Начать чат"),
      
    ])
  })

}