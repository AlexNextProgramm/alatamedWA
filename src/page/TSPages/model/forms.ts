import test from "node:test";
import { forEach, values } from "../../../../webpack.config";
import { POST_MY, POST_MY_FILES } from "../../../library/GetPost";
import { ExhiDOM, atribute, body, btn, button, div, h1, h4, img, input, label, option, p, select, textarea, th, vnode } from "../../../library/exhibit/exhibit";
import { IsJsonString } from "../../../library/json";
import { click_phone_masck, phone_mask } from "../../../library/upgrade_form";
import { my_cookie } from "../../../library/cookie";
import { CLINIC } from "./constant_object";
import { formatDate, formatTime, getTimeformat } from "../../../library/Date";

// =========================================================================================================
// Форма добавления нового USERA
export function new_user(){
    const form  = new ExhiDOM('form-edit')
    let info = new Proxy({text:''},{
      set:function(target:any, props:any, newValue:any){
         target[props] = newValue
         let e =  <HTMLElement>document.querySelector('#info')
         if(newValue != ''){
            e.className = ''
            e.textContent = newValue
         }else{
            e.className = 'deactive'
            e.textContent = ''
         }
         return true
      }
   })
 
    function exit(){
       form.search('.form-edit', {className:'form-edit deactive'}, [])
    }
 
    function ent(evt:KeyboardEvent){
       if(evt.key == 'Enter') send()
    }
 
    function send(){
       let contr = true;
       
       Object.keys(form.WatchValue).forEach((key:string)=>{
          if(key !=  'name' && key != 'tel' && form.WatchValue[key]){
                contr = false
          }
       })
       if(contr) return info.text =  'Не выбран раздел'
       if(form.WatchValue['name'] != '', form.WatchValue['tel'] != 0){
          info.text = ''
          document.querySelector('.btn-send')?.classList.toggle('btn-load')
         //  form.search('.btn-send', {className:'btn-send btn-load'})
          
          POST_MY('./../php/router.php', 'new-user', JSON.stringify(form.WatchValue)).onload = function(){
            
             if(this.responseText == '404') window.location.href  = './../index.php';
                if(this.responseText == 'ok'){
                    form.search('.form', {className:'form'},
                    [
                       btn({className:'btn-exit', onclick:exit},'×'),
                       h1('Пользователь успешно создан'),
                   
                   ])
               }else{
                  
                  if(IsJsonString(this.responseText)){
                    let res = JSON.parse(this.responseText)
                    if(res.status == "Такой пользователь существует"){
                    
                        let newob:any = {};
    
                        Object.keys(form.WatchValue).forEach((key:string)=>{
                            if(form.WatchValue[key] == true){
                                newob[key] = form.WatchValue[key]
                            }else{
                             if(key == 'tel' || key == 'name'){
                                newob[key] = form.WatchValue[key]
                             }
                            }
                         })
                        info.text = res.status + '. <br> '+ ' Есть доступ: '+ res.role +'.<br> '+ ' Хотите обновить Доступ и Имя ?'
                       form.search('.btn-send', { onclick:()=>opendop(newob), textContent:'Открыть доступ'}, [])
                       
                    }
                  }else{
                   form.search('.form', {className:'form'},
                     [
                        btn({className:'btn-exit', onclick:exit},'×'),
                        h1("Ошибка отправки пароля пользователю"),
                        p( this.responseText )
                    ])
                }
               }

               
             
             }
       }else{
          info.text = 'Не все поля заполнены'
       }
    }

    function opendop(ob:any){
      console.log(ob)
        POST_MY('./../php/router.php', 'update-role', JSON.stringify(ob)).onload = function(){
           if(this.responseText == 'ok'){
            form.search('.form', {className:'form'},
            [
               btn({className:'btn-exit', onclick:exit},'×'),
               h1('Успешно обновлены доступы и имя пользователя'),
           ])
           }
        }
    }

 
    form.render(()=>{
       return div({className:'form-edit'},
       [
          div({className:'form', onkeydown:ent}, 
          [
             btn({className:'btn-exit', onclick:exit},'×'),
             h1("Новый пользователь"),
             div({className:'block-role'}, 
             [
                input({type:"checkbox", name:'senior_admin', id:'senior_admin'}),
                label({for:'senior_admin'},'Старший Администратор'),
                input({type:"checkbox", name:'admin', id:'admin'}),
                label({for:'admin' }, 'Администратор'),
                input({type:"checkbox",  name:'system_admin', id:'system_admin'}),
                label({for:'system_admin', }, 'Системный администратор'),
                input({type:"checkbox", name:'doctor', id:'doctor'}),
                label({for:'doctor' }, 'Доктор'),
                input({type:"checkbox",  name:'marketing', id:'marketing'}),
                label({for:'marketing',}, 'Маркетинг')
             ]),
             input({type:'text', name:'name',placeholder:'Имя пользователя'}),
             input({type:'tel', name:'tel',  placeholder:'Телефон', onfocus:click_phone_masck, onkeydown:phone_mask}),
             btn({className:'btn-send', onclick:send}, 'Создать'),
             p({className:'deactive', id:'info'},'')
          ])
       ])
    })
 }





//  ===================================================================================================
// Форма обнавления пароля
 export function new_password(){

  

      const form  = new ExhiDOM('form-edit')
      let info = new Proxy({text:''},{
        set:function(target:any, props:any, newValue:any){
           target[props] = newValue
           let e =  <HTMLElement>document.querySelector('#info')
           if(newValue != ''){
              e.className = ''
              e.textContent = newValue
           }else{
              e.className = 'deactive'
              e.textContent = ''
           }
           return true
        }
     })
      const pass = form.State({type:'password'}, {toggle:true})
      const passT = form.State({type:'password'}, {toggle:true})
      const pass_img = require('../../../images/whatsApp/glass_password.png')
     
   
      function ent(evt:KeyboardEvent){
         if(evt.key == 'Enter') send()
      }
     function exit(){
         form.search('.form-edit', {className:'form-edit deactive'}, [])
      }
   
      function send(){
          if(form.WatchValue['password'] == '' && form.WatchValue['password-two'] == '' ){
            return  info.text = 'Заполните поля'
          }
          
         if(form.WatchValue['password'] == form.WatchValue['password-two']){
            if(!form.WatchValue['password'].match(/(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z]{4,}/) || form.WatchValue['password'].length < 6 ){
               return info.text = 'Пароль должен содержать латинские буквы и цифры, минимум 6 символов'
            }
            info.text = ''
            form.search('.btn-send', {className:'btn-send btn-load'})
            POST_MY('./../php/router.php', 'update-password', JSON.stringify(form.WatchValue)).onload = function(){
                if(this.responseText == '404') window.location.href  = './../index.php';
                if(this.responseText == 'ok'){
                       my_cookie.old_user = 1
                       form.search('.form', {className:'form'},
                       [
                          btn({className:'btn-exit', onclick:exit},'×'),
                          h1('Пароль успешно обнавлён'),
                          btn({className:'btn-send', onclick:exit}, 'Войти'),
                      ])
                  }
               }
        
         }else{
               info.text = 'Пароли не совпадают'
         }
      }


      
if(my_cookie.old_user  && my_cookie.old_user == 0){
         form.render(()=>{
            return div({className:'form-edit'},
            [
               div({className:'form', onkeydown:ent}, 
               [
                  h1("Смените пароль"),
                  div(input({type:pass.type, name:'password', maxlength:'50', placeholder:'Пароль'}), img({src:pass_img, onclick:()=>pass.type = 'text'})),
                  div(input({type:passT.type, name:'password-two', maxlength:'50', placeholder:'Пароль'}), img({src:pass_img, onclick:()=>passT.type = 'text'})),
                  btn({className:'btn-send', onclick:send}, 'Сменить'),
                  p({className:'deactive', id:'info'}, info.text)
               ])
            ])
         })
   }


  }

//   =============================================================
  
export interface send{
   [name:string]:any
   clinic:Array<string> 
   chapter:string 
   'massenge-sample':string 
   comment:string
   name:string
   role:Array<string> 
   examination:number
   examination_day?:number
   id:string
   header?:any
   footer?:any
}



var footer:any = {}
var header:any = {}

// ===========================Форма создания нового шаблона=================
 export function new_button_forms(render:Function, id:string|null= null){
   let bt:send|null = null
   const form = new ExhiDOM('form-edit')

   let info = new Proxy({text:''},{
      set:function(target:any, props:any, newValue:any){
         target[props] = newValue
         let e =  <HTMLElement>document.querySelector('#info')
         if(newValue != ''){
            e.className = ''
            e.textContent = newValue
         }else{
            e.className = 'deactive'
            e.textContent = ''
         }
         return true
      }
   })

   header = {}
   footer = {}
   

// запрашиваем шаблоны

   POST_MY('../php/router.php', 'sample-variable','ok').onload = function(){

      let sample = JSON.parse(this.responseText).sample
      let variables:{variable:Array<variable>} = JSON.parse(this.responseText).variable
      let chapter:Array<vnode> = [select({name:'new-chapter',onchange:ch_chapter, id:'ch-select'},[option({selected:true}, "Новый раздел")])]
      let chControle:Array<string> = []
  
      
      
      if(id) sample.buttons.forEach(  (but:any)=>{ if(but.id == id ) bt = but }   )
      if(bt?.footer) footer = bt.footer
      if(bt?.header) header = bt.header



      sample.buttons.forEach((but:any)=>{
         if(!chControle.includes(but.chapter)){
            if(bt && bt.chapter == but.chapter){
               chapter[0].children.push(option({selected:true}, but.chapter))
            }else{
               chapter[0].children.push(option(but.chapter))
            }
            chControle.push(but.chapter)
         }
      })


      function ch_chapter(){

         if(form.WatchId['ch-select'].value  != 'Новый раздел'){
            form.WatchValue.chapter = form.WatchId['ch-select'].value
            form.WatchId["chapter"].className = 'deactive'
            chapter[0].children.forEach((ch:vnode)=>{
               if(ch.props.textContent == form.WatchId['ch-select'].value){
                  ch.props.selected = true
               }else{
                  ch.props.selected = false
               }
            })
         }else{
            form.WatchId["chapter"].className = ''
         }

      }



   function send(){
      
      // Формирум обект на отпрваку 
      let send:send  = {
         clinic:[],
         chapter:form.WatchValue['chapter'],
         "massenge-sample":form.WatchValue['massenge-sample'],
         comment: form.WatchValue['comment']?form.WatchValue['comment']:'',
         name:form.WatchValue['name-btn'],
         role:[],
         examination:form.WatchValue['examination'],
         id: bt? bt.id:'0'
      }

      

   
      Object.keys(form.WatchValue).forEach((key:any)=>{
         if(Object.keys(CLINIC).includes(key) && form.WatchValue[key] == true){
            send.clinic?.push(key)
         }
         if(['senior_admin','admin','system_admin', 'doctor', 'marketing'].includes(key) && form.WatchValue[key] == true){
            send.role.push(key)
         }
         // Исключаем из формы и добавляем 
         if(!send.hasOwnProperty(key) &&
         !Object.keys(CLINIC).includes(key)
         && 
         !['senior_admin','admin','system_admin', 'doctor', 'marketing', 'name-btn'].includes(key) 
         &&
         key != 'new-chapter'
         ){
            if(form.WatchValue[key]) send[key] = form.WatchValue[key]
         }

      })
      if(send.examination == 2 && form.WatchValue['examination_day'] != ''){
         send.examination_day = form.WatchValue['examination_day']
      }else{
         if(bt?.examination_day) delete bt.examination_day
         if( send.examination_day ) delete  send.examination_day 
      }

      if(bt && bt.id != '0'){
         if(send.chapter == '') send.chapter = bt.chapter
      }

      bt = send
      
      //  тут проверка send 

      if(header.headerType) send.header = header
      if(footer.text) send.footer = footer
      // собрали объект send
      if(send.chapter == '') return info.text = 'Не заполнен раздел'
      if(send.clinic.length == 0) return info.text = 'Не внесено ни одной клиники'
      if(send["massenge-sample"] == '') return info.text = 'Нет шаблона сообщения'
      if(send.role.length == 0) return info.text = 'Нет ни одного пользователя'
      if(send.name == '') return info.text = 'Нет имени кнопки'
      
      POST_MY('../php/router.php', 'set', JSON.stringify(send)).onload = function(){
        if(this.status == 200){
           render() // перерендриваем старницу полнотью чтобы увидеть появилась ли кнопка 
        }else{
         console.error(this.responseText)
        }
      }


   }

   // выход из формы 
   function exit(){
      form.search('.form-edit', {className:'form-edit deactive'}, [])
   }
    function delete_btn(id:string|undefined){
      if(id){
         POST_MY('../php/router.php', 'del', id).onload = function(){
            if(this.status == 200){
               render() // перерендриваем старницу полнотью чтобы увидеть появилась ли кнопка 
            }else{
            console.error(this.responseText)
            }
         }
      }
    }

   function examination_select(evt:any){
      let exa = <HTMLInputElement> document.querySelector('#exa_day')
         if(evt.target.value == '2'){
            exa.className = ''
            exa.name = 'examination_day'
         }else{
            exa.className = 'deactive'
            exa.name = ''
         }
      }

   // объект vno
   form.render(()=>{


      let VarialeVnodeArr:Array<vnode> = []
      variables.variable.forEach((variable:variable)=>{
         
         VarialeVnodeArr.push(
          input({type:'checkbox', name:variable.nameInput , id:variable.id, checked:bt? bt[variable.nameInput]:false}),
          label({for:variable.id}, variable.text +' '+ variable.name)
         )
       })


      //* Формируем  блок клиник
       let ClickOption:Array<vnode> = []
       let num = 1
       Object.keys(CLINIC).forEach((names:string)=>{
         ClickOption.push( input({type:"checkbox", name:names, id:'clin-'+ num, checked:bt && bt.clinic.includes(names)? true:false}))
         ClickOption.push( label({for:'clin-' + num},CLINIC[names]),)
         num++
       })




   return div({className:'form-edit', style:'justify-content: flex-start;'},
   [
     
      div({className:'form'},
      [
         h1('Шаблон'),
         btn({className:'btn-exit', onclick:exit},'×'),
         div({className:'row'},
            [
            div({className:'block-role', title:'Поля - это созданные кнопки или переменные которые будут отбражаться'}, 
               [
               h4('Поля (переменные)'),
               ...VarialeVnodeArr
               ]),

            div({className:'block-role', title:'Выберете хотя бы одноного пользователя у которого будет отображаться кнопка'}, 
               [
                  h4("Пользователи"),
                  input({type:"checkbox", name:'senior_admin', id:'senior_admin', checked:bt && bt.role.includes("senior_admin")? true:false}),
                  label({for:'senior_admin'},'Старший Администратор'),
                  input({type:"checkbox", name:'admin', id:'admin', checked:bt && bt.role.includes("admin")? true:false}),
                  label({for:'admin' }, 'Администратор'),
                  input({type:"checkbox",  name:'system_admin', id:'system_admin', checked:bt && bt.role.includes("system_admin")? true:false}),
                  label({for:'system_admin', }, 'Системный администратор'),
                  input({type:"checkbox", name:'doctor', id:'doctor', checked:bt && bt.role.includes("doctor")? true:false}),
                  label({for:'doctor'  }, 'Доктор'),
                  input({type:"checkbox",  name:'marketing', id:'marketing', checked:bt && bt.role.includes("marketing")? true:false}),
                  label({for:'marketing',}, 'Маркетинг')
               ]),

            div({className:'block-role', title:'Выберете доступ в каких клиниках будет отображаться кнопка'}, 
               [
                  h4("Клиники"),
                  ...ClickOption
               ]),
         ]),

         div({className:'block caption'}, 
            [
               btn({className:'btn-send', onclick:()=>header_new(header)},'Заголовок'),
               btn({className:'btn-send', onclick:()=>footer_new(footer)}, 'Подпись')
            ]),

         ...chapter,

         input({ className:bt && bt.id != '0' ?'deactive':'',type:'text', name:'chapter', placeholder:'Имя раздела кнопок', id:'chapter', title:'Имя раздела кнопок в правой панели можно добавить в существующий раздел'}),
         textarea({ name:'massenge-sample', title:'Шаблон с исправленными переменными',placeholder:'Шаблон сообщения', value:bt && bt["massenge-sample"]?bt["massenge-sample"]:''  }),
         textarea({ name:'comment', title:'Отображаеться при навереденнии на кнопку', placeholder:'Комментарий к заполнению', value:bt && bt["comment"]?bt["comment"]:''}),
         input({type:'text', name:'name-btn', title:'Внутреннее имя кнопки в правой панели', placeholder:'Имя кнопки в правой панели', value:bt && bt["name"]?bt["name"]:''}),

         select({name:'examination', onclick:examination_select},
         [
            option({value:'0', selected:bt && bt["examination"] == 0?true:false},"Не проверять номер"),
            option({value:'1', selected:bt && bt["examination"] == 1?true:false},"Спрашивать"),
            option({value:'2', selected:bt && bt["examination"] == 2?true:false},"Не отправлять повторно")
         ]),

         input({type:'number', title:'Если оставить пустым запретит отправку повторную отправку, поле принимает число в днях, переиод через какое можно повторить отправку', className:bt && bt["examination"]==2?'':'deactive', id:'exa_day', name:'examination_day', placeholder:'Период в днях', value:bt && bt.examination_day?String(bt.examination_day):''}),
         btn({className:'btn-send', onclick:send},  bt && bt.id != '0' ?'Редактировать':'Добавить'),
         bt && bt.id != '0'? btn({className:'btn-send btn-delete', onclick:()=>delete_btn(bt?.id)}, 'Удалить'):div(),
         p({className:'deactive', id:'info'}, info.text)
      ])
   ])}
)

   }

}



// ======================================Закрытие доп форм =====

// ====================================Функция header=======
function header_new(optionHeader:any){
   
   const form_running = new ExhiDOM('form-running-title')
   let image_path = form_running.State({url:'../images/IMAGE-SAMPLE/load_image.png', name:"Добавить картинку"})
  
   function exit_running(){
      form_running.search('.form-running-title', {className:'form-running-title deactive'}, [])
   }


   if(optionHeader.headerType == "IMAGE" ){
      image_path.url = optionHeader.imageUrl
      image_path.name =  optionHeader.imageUrl.slice(optionHeader.imageUrl.lastIndexOf('/')+1, optionHeader.imageUrl.length)
   }


  

   function HEADER_TEXT(evt:any){
       header = {
         headerType:'TEXT',
         text:evt.target.value
       }
      
   }


let ArraySelect:Array<vnode> = []
let ArrayOption:Array<vnode> = []
if(optionHeader.headerType){
      if(optionHeader.headerType == "IMAGE"){
         ArraySelect.push(
            img({for:'ImageFiles', className:"IMAGE", src:image_path.url}),
            label({for:'ImageFiles', name:'IMAGE'}, image_path.name),
            input({type:"file", onchange:IMAGE_CHANGE, className:'deactive', id:'ImageFiles'})
         )
         ArrayOption.push(
               option('IMAGE'),
               option('DOCUMENT'),
               option('TEXT')
         )
      }
      if(optionHeader.headerType == "TEXT"){
         ArraySelect.push(
            input({type:"text", name:'text', placeholder:'Текст заголовка', onkeyup:HEADER_TEXT, onblur:HEADER_TEXT, value: optionHeader.text? optionHeader.text:''})
         )
         ArrayOption.push(
            option('TEXT'),
            option('IMAGE'),
            option('DOCUMENT'),
         )
      }

}else{
   ArraySelect.push(
      img({for:'ImageFiles', className:"IMAGE", src:image_path.url}),
      label({for:'ImageFiles', name:'IMAGE'}, image_path.name),
      input({type:"file", onchange:IMAGE_CHANGE, className:'deactive', id:'ImageFiles'})
   )
   ArrayOption.push(
         option('IMAGE'),
         option('DOCUMENT'),
         option('TEXT')
   )
}



   function header_select(evt:any){
      if(evt.target.value == 'TEXT'){
         ArraySelect = [
            input({type:"text", name:'text', placeholder:'Текст заголовка', onkeyup:HEADER_TEXT, onblur:HEADER_TEXT, value:optionHeader.text? optionHeader.text:''})
         ]
      }
      if(evt.target.value == 'IMAGE'){
         ArraySelect = [
            img({for:'ImageFiles', className:"IMAGE", src:image_path.url}),
            label({for:'ImageFiles', name:'IMAGE'}, image_path.name),
            input({type:"file", onchange:IMAGE_CHANGE, className:'deactive', id:'ImageFiles'})
         ]
      }
      form_running.render()
   }

   function IMAGE_CHANGE(){

      POST_MY_FILES('../php/router.php', 'IMAGE-SAMPLE', form_running.WatchId.ImageFiles.files[0] ).then((data)=>{

         data.text().then((result)=>{
            let  path = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('page')) + result
            ArraySelect[0].props.src = path
            ArraySelect[1].props.textContent = result.slice(result.lastIndexOf('/') + 1, result.length)
            image_path.name = result.slice(result.lastIndexOf('/') + 1, result.length)
            header = {
               headerType:'IMAGE',
               imageUrl:path
            }
         })
      })


   }




form_running.render(()=>{
   return div({className:'form-running-title'},
   [
      div({className:'form'}, 
      [
         btn({className:'btn-exit', onclick:exit_running},'×'),
         h1("Заголовок"),
         p("Заголовок в ватсап может иметь документ, картинку или текст"),
         select({ onchange:header_select}, ArrayOption ),
         div([...ArraySelect])
      ])
   ])
})



}
// ====================================Функция footer=======
function footer_new(optionFooter:any){

   const form_running = new ExhiDOM('form-running-title')

   function exit_running(){
      form_running.search('.form-running-title', {className:'form-running-title deactive'}, [])
   }

   function FOOTER_TEXT(evt:any){
      if(evt.target.value != ''){
         footer = {
          footerType:'TEXT',
          text:evt.target.value
         }
      }else{
         footer = {}
      }
   }

   form_running.render(()=>{
      return div({className:'form-running-title'},
      [
         div({className:'form'}, 
         [
            btn({className:'btn-exit', onclick:exit_running},'×'),
            h1("Подпись"),
            input({type:"text", name:'text', placeholder:'Текст Подписи', onkeyup:FOOTER_TEXT, value:optionFooter.text? optionFooter.text:''})
         ])
      ])})
}


// ================================== Форма отпрвки клиенту =====






export interface variable{
   name:string
   nameInput:string
   text:string
   comment:string
   html_input:string|props_input
   id:string
   buttonName?:string
   buttonType?:string
   buttonURL?:string
   buttonPHONE?:string
   NameSender?:boolean
   payload?:string
   payloadText?:string

}
export interface props_input{
   tag:string
   props:atribute
   children:Array<vnode>
}

interface INPUT{
   TIME:vnode
   DATE:vnode
   TEXT:vnode
   TEL:vnode
   TEXTAREA:vnode
}







// ========================Форма переменных ===========================================================================
export function form_variable(renderSystem:Function, infotext:string = '', sendNew:variable|null = null){
   const form = new ExhiDOM('form-edit')

   
   function exit(){
      form.search('.form-edit', {className:'form-edit deactive'}, [])
   }
   // прописали все виды переменных 
   // тоесть поля которые возможны для добавления 
   const  INPUT:any = {
      TIME:input({type:"time"}),
      DATE:input({type:"date"}),
      TEXT:input({type:"text"}),
      TEXTAREA:textarea(),
      TEL:input({type:'tel'}),
      BUTTON:input({type:"text", name:"button"}),
      QUICK_REPLY:btn({disablend:true ,name:"playload"})
   }
   // Прописываем тип кнопки
   const BUTTONTYPE = ["PHONE", "URL"]
   const typebutton:Array<vnode> = []

   BUTTONTYPE.forEach((type:string)=>{
      typebutton.push(option({value:type , selected:false}, type))
   })

   
   POST_MY('../php/router.php', 'variable', 'ok').onload = function(){
      let variable = JSON.parse(this.responseText)
      let options:Array<vnode> = [option("Новая переменная")]
      let vrb:variable|null = null
      if(sendNew) vrb = sendNew
      let info = new Proxy({text:''},{
         set:function(target:any, props:any, newValue:any){
            target[props] = newValue
            let e =  <HTMLElement>document.querySelector('#info')
            if(newValue != ''){
               e.className = ''
               e.textContent = newValue
            }else{
               e.className = 'deactive'
               e.textContent = ''
            }
            return true
         }
      })
      
      
      variable.variable.forEach((vb:variable)=>{
         if(vrb && vrb.id == vb.id){
            options.push(option({  value:vb.nameInput , name:'variable',  id:vb.id, selected:true}, vb.name))
            if(vb.buttonType){
             typebutton.forEach((btntype:vnode)=>{
              if(btntype.props.value == vb.buttonType){
               btntype.props.selected = true
              }
             })
            }
         }else{

            options.push(option({  value:vb.nameInput , name:'variable',  id:vb.id, selected:false}, vb.name))
         }
      })


      const inputselect:Array<vnode> = []
      Object.keys(INPUT).forEach((key) => {
         let val = JSON.stringify(INPUT[key])
         if(vrb && vrb.html_input == val ){
            inputselect.push(option({value:val, selected:true}, key))
         }else{
            inputselect.push(option({value:val, selected:false}, key))
         }

       
      });



   function send(){

         let send:any ={
            name:form.WatchValue['name'], //! Имя переменной 
            text:"{{"+form.WatchValue['nameInput']+"}}", //!формат переменной в сообщении
            nameInput:form.WatchValue['nameInput'],  //! название переменной должно быть уникальным
            comment:form.WatchValue['comment'], //!коменнатрий который отражаеться в placeholdere для пользователей 
            html_input:form.WatchValue['html_input'],
            NameSender:form.WatchValue['NameSender'],
            id:'-1'
         }
        
         // !Проверка кнопки Если это кнопка а не переменная открывает поле для имени кнопки для пациента
         if(JSON.stringify(INPUT.BUTTON) == send.html_input){
            send.buttonName = form.WatchValue['buttonName']
            send.buttonType =  form.WatchValue['buttonType']
            if(send.buttonName == '' || send.buttonName == undefined) return info.text = 'Нет имя перемнной button'
            let type = <HTMLSelectElement> document.querySelector("#bt-type")

            if(type.value == 'PHONE'){
               if(form.WatchValue['buttonPHONE'] != '') send.buttonPHONE = form.WatchValue['buttonPHONE']
            }else{
            
               if(form.WatchValue['buttonURL'] != '') send.buttonURL = encodeURIComponent(form.WatchValue['buttonURL']) ///TODO можно написать проверку на URL
            }
         }

         if(JSON.stringify(INPUT['QUICK_REPLY']) == send.html_input){
            send.payload = form.WatchValue['payload']
            send.payloadText = form.WatchValue['payloadText']
         }

         if(vrb) send.id = vrb.id //! Если объект не новый то вносим его id в обнавленные данные 
         // !Проверка формы
         if(send.nameInput == '') return info.text = 'Не внесено уникальное имя переменой в объекте'
         if(send.name == '') return info.text = 'Не внесено название переменной'
        
         
         // !Проверка уникальности переменной 
         let controlName = false
         variable.variable.forEach((vb:variable)=>{ if(vb.id != send.id && vb.nameInput == send.nameInput) controlName = true })
         if(controlName) return info.text = 'Имя кнопки или переменной не уникально'
            console.log(send)
            POST_MY('../php/router.php', 'variable-new', JSON.stringify(send)).onload = function(){

               if(this.status == 200){

                  renderSystem() //! Перерендерим объект
                  send.id = this.responseText
                  form_variable(renderSystem, 'Изменения внесены', send)//! открываем форму и додобряем сообщение 

               }else{

                  console.error(this.responseText)

               }

         }
      }
 

      function ch_name(){

         options.forEach((el)=>{el.props.selected = false})
         
         if(form.WatchId['ch-name'].value  != 'Новая переменная'){
            
            form.WatchValue.name = form.WatchId['ch-name'].value

            variable.variable.forEach((vb:variable)=>{

               if(vb.text == '{{'+form.WatchId['ch-name'].value + '}}'){

                  vrb = vb
                  inputselect.forEach((vn:vnode)=>{
                     
                     if(vn.props.value == JSON.stringify(vb.html_input)){
                        vn.props.selected = true
                     }else{
                        vn.props.selected = false
                     }
                     form.WatchValue.name = vb.name

                  })
               }

            })
         
         }else{ 

             vrb = null  

         }
         form.render()
      }


      function buttonShow(evt:any){

         let doc = <HTMLInputElement> document.querySelector("#bt-name")
         let type = <HTMLSelectElement> document.querySelector("#bt-type")
         let urltype = <HTMLInputElement> document.querySelector('#bt-urltype-name')
         let payload = <HTMLInputElement> document.querySelector("#bt-payload-name")
         let payloadText = <HTMLInputElement> document.querySelector("#bt-payload-text")
         let phonetype  = <HTMLInputElement> document.querySelector('#bt-phonetype-name')
         if(evt.target.value == "{\"tag\":\"input\",\"props\":{\"type\":\"text\",\"name\":\"button\"},\"children\":[]}"){

            doc.name = 'buttonName'
            doc.className = ''
            form.WatchValue.buttonName = doc.value
            type.name = 'buttonType'
            type.className = ''
            form.WatchValue.buttonType = type.value

            console.log(type)
            if(type.value == 'URL'){
               phonetype.className = 'deactive'
               phonetype.name = ''


               urltype.className = ''
               urltype.name = 'buttonURL'

            }else{

               urltype.className = 'deactive'
               urltype.name = ''
               
               phonetype.className = ''
               phonetype.name = 'buttonPHONE'
            }


         }else{
            phonetype.className = 'deactive'
            phonetype.name = ''
            urltype.name = ''
            urltype.className = 'deactive'
            type.name = ''
            type.className = 'deactive'
            doc.name = ''
            doc.className = 'deactive'
         }

       

         if(evt.target.value == JSON.stringify(INPUT['QUICK_REPLY'])){

            payload.className = payloadText.className = ''
            payloadText.name = 'payloadText'
            payload.name = 'payload'

         }else{

            payload.className = payloadText.className = 'deactive'
            payloadText.name = ''
            payload.name = ''

         }
      }


      function delSend(){

            POST_MY('../php/router.php', 'variable-del', JSON.stringify(vrb)).onload = function(){

               if(this.status == 200){

                  if(this.responseText == ''){

                     renderSystem() //! Перерендерим объект
                     form_variable(renderSystem, 'Переменная удалена')//! открываем форму и додобряем сообщение 

                  }else{

                     if(IsJsonString(this.responseText)){

                        let ArrSample:Array<string> = JSON.parse(this.responseText)
                        info.text = 'Переменная существует в шаблоне: '+ ArrSample.join(', ')

                     }else{

                        console.error(this.responseText)

                     }

                  }

               }else{

                  console.error(this.responseText)

               }
            }
      }

      function butUrlChAnge(evt:any){

         let urltype = <HTMLInputElement> document.querySelector('#bt-urltype-name')
         let phonetype  = <HTMLInputElement> document.querySelector('#bt-phonetype-name')
         if(evt.target.value == 'URL'){

            urltype.className  = ''
            urltype.name = 'buttonURL'

         }else{

            urltype.className = 'deactive'
            urltype.name = urltype.value = ''

         }
         if(evt.target.value == 'PHONE'){

            phonetype.className = ''
            phonetype.name = 'buttonPHONE'

         }else{

            phonetype.className = 'deactive'
            phonetype.name = phonetype.value = ''

         }
      }
   
   

      form.render(()=>{
      
         return div({className:'form-edit'},
         [
            div({className:'form'},
            [

               btn({className:'btn-exit', onclick:exit},'×'),
               h1('Добавление переменных и полей'),

               select({ onchange:ch_name, id:"ch-name", }, options),

               input({type:"text", className: vrb?'deactive':'', title:'Оно ни как не влияет на отправку сообщения', id:'name-var', name:'name', value:vrb? vrb.name:'', placeholder:'Внутреннее название'}),
               input({type:"text", name:'nameInput', title:'Уникальное имя переменной или кнопки будет отображаться {{Уникальное Имя}}', placeholder:'Уникальное имя переменной', value:vrb?vrb.nameInput:''}),
               textarea({name:'comment',title:'Если это переменное поле то будет подпись этого поля', placeholder:'Описание в placeholder', value:vrb? vrb.comment:''}),
               
               // ** значения кнопки QUICK_REPLY
               input({type:"text", id:"bt-payload-text", className:vrb && vrb.payloadText ?'':'deactive', name:'payloadText', placeholder:'Подпись QUICK_REPLY', value:vrb && vrb.payloadText? vrb.payloadText:''}),
               input({type:"text", id:"bt-payload-name", className:vrb && vrb.payload ?'':'deactive', name:'payload', placeholder:'Ответ QUICK_REPLY', value:vrb && vrb.payload? vrb.payload:''}),
               
               select({name:'html_input', onchange:buttonShow}, inputselect),
               select({id:"bt-type", onchange:butUrlChAnge, className:vrb && vrb.buttonType ?'':'deactive', name:'buttonType', value:vrb && vrb.buttonType? vrb.buttonType:''}, typebutton),
               
               input({type:"text", id:"bt-name", className:vrb && vrb.buttonName ?'':'deactive', name:'buttonName', title:'Название будет отображаться в сообщении у клиента', placeholder:'Название кнопки в сообщении WhatsApp', value:vrb && vrb.buttonName? vrb.buttonName:''}),
               input({type:"text", id:"bt-urltype-name", className:vrb && vrb.buttonType == 'URL'?'':'deactive', name:'buttonURL',title:"Если ее оставить пустую она будет динамичная.", placeholder:'ссылка кнопки ', value:vrb && vrb.buttonURL? vrb.buttonURL:''}),
               input({type:"text", id:"bt-phonetype-name", className:vrb && vrb.buttonType == 'PHONE'?'':'deactive', name:'buttonPHONE',title:"Если ее оставить пустую она будет динамичная.", placeholder:'Номер телефона', value:vrb && vrb.buttonPHONE? vrb.buttonPHONE:''}),

               div({className:'checkbox-label'},[
                  input({type:"checkbox", name:"NameSender", id:'sender_name', checked:vrb && vrb.NameSender? true:false}),
                  label({for:'sender_name'}, 'Использовать как имя получателя в базе'),
               ]),

               vrb? btn({className:'btn-send', onclick:send}, 'Редактировать'): btn({className:'btn-send', onclick:send}, 'Создать'),
               vrb? btn({className:'btn-send btn-delete', onclick:delSend}, 'Удалить'):div(),
               p({className:'deactive', id:'info'}, info.text)
            ])
         ])
      })
   }
}



// =========================================ФОРМА КОНСТАН==============
 export function constants(){
    
    POST_MY('./../php/router.php', 'constants-get', 'ok').onload = function(){
       const form = new ExhiDOM('form-edit')
       let consts = JSON.parse(this.responseText)
       let option:Array<vnode> = []
       let info = form.State({text:''})

      function exit(){
         form.search('.form-edit', {className:'form-edit deactive'}, [])
      }

      function updateAddress(evt:any){
         let name =  evt.target.name
         consts[name].address = evt.target.value
      }
      
      function updateClinic(evt:any){
        let name =  evt.target.name
        consts[name].name = evt.target.value
      }

      function send(){
         POST_MY('./../php/router.php', 'constants-set', JSON.stringify(consts)).onload = function(){
            if(this.status == 200){
               info.text = 'Сохранено'
            }else{
               console.error(this.responseText)
            }
         }
      }



         Object.keys(consts).forEach((key)=>{
            option.push(div({className:'rows-const'},[
               label('Имя клиники'),
               input({type:'text', name:key, value:consts[key].name, onkeyup:updateClinic}),
               label('Адрес'),
               input({type:'text', name:key, value:consts[key].address, onkeyup:updateAddress}),
               // p({title:"Ключ используется машиной (в куках  и т.д.)"}, 'Ключ'),
               // input({type:'text', name:"key"}),

            ]))
         })

      form.render(()=>{
         return div({className:'form-edit', style:'justify-content: flex-start;'}, 
         [
            div({className:'form'},
               [
                  btn({className:'btn-exit', onclick:exit},'×'),
                  h1('Клиники'),
                  div({className:'rows-const'},
                     [
                        label('Константа {{clinic}} - Имя клиники в сообщении <br>'),
                        label('Константа {{address}} - Адрес клиники')
                     ]),
                  ...option,
                  btn({className:'btn-send', onclick:send}, 'Сохранить'),
                  info.text != ''?p(info.text):div()
               ])
         ])
      })
   }


 }

 export function news(){
    const form = new ExhiDOM('form-edit')
     let info = form.State({text:''})
     let type = ''

      function exit(){
            form.search('.form-edit', {className:'form-edit deactive'}, [])
      }

      function send(){
         let bool = true
         type = ''
        Object.keys(form.WatchValue).forEach((key)=>{
         if(form.WatchValue[key] == ''){
            info.text = `Не заполнено поле "${form.WatchName[key].placeholder}"`
            return bool = false
         }
        })
        if(bool){
            const send = {
               user:[],
               author:"",
               header:form.WatchValue['header'],
               body:form.WatchValue['body'],
               date:formatDate(new Date(), true),
               time:getTimeformat(new Date())
            }

            POST_MY('./../php/router.php', 'new-news', JSON.stringify(send)).onload = function(){
               if(this.status == 200){
                  type = 'color: green;'
                  info.text = 'Новость добавлена'
               }
            }
        }


      }


     form.render(()=>{
         return div({className:'form-edit', style:'justify-content: flex-start;'}, 
         [
            div({className:'form  grose'},
               [
                  btn({className:'btn-exit', onclick:exit},'×'),
                  h1('Новости'),
                  input({type:"text", placeholder:'Заголовок', name:'header'}),
                  textarea({placeholder:'Новость', name:"body"}),
                  btn({className:'btn-send', onclick:send}, 'Сохранить'),
                   info.text != ''? p({style:type }, info.text ):div()
               ])
         ])
      })
   

 }