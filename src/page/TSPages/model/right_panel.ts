
import { formatDate } from "../../../library/Date";
import { POST_MY } from "../../../library/GetPost";
import { ExhiDOM, btn, button, div, h4, input, label, p,  span,  vnode } from "../../../library/exhibit/exhibit";
import { IsJsonString, replaceAll } from "../../../library/json";
import { click_phone_masck, phone_mask, tel_preobr, telefon_copy_past } from "../../../library/upgrade_form";
import {  send, variable } from "./forms";
import { info_left_whatsApp } from "./left_panel";
import { collect } from "./massage_panel";
import '../../../CSS/news.scss'
import { my_cookie } from "../../../library/cookie";
import { time } from "console";
import { forEach } from "../../../../webpack.config";



export interface option_panel{
    record:boolean
    general:boolean
    analysis:boolean
    programm:boolean
    links:boolean
}



export interface clinic{
    "Альтамед+":boolean
    "Одинмед":boolean
    "Одинмед+":boolean
    "Дубки-Альтамед":boolean
    "Верхне-Пролетарская":boolean
    "Альтамед-Бьюти":boolean
}


export var cl_btn_sample_wa:any = null


export function right_panel( clinic:any, role:string){

    info_left_whatsApp()
    
    const right  = new ExhiDOM('right-panel')
    let blocks:Array<vnode>  = []
    let buttonName:{[name:string]:string} = {}
    let payload:{[name:string]:string} = {}

// ** по клику созданой кнопки происходит 
      function click_btn(bt:send){
        // console.log(bt)
        const fbt = new ExhiDOM('form-left-enter')

        let info = new Proxy({text:'', type:''},{
            set:function(target:any, props:any, newValue:any){
            let e =  <HTMLElement>document.querySelector('#info')
            
            if(props == 'text'){
                target[props] = newValue
                if(newValue != ''){
                   e.className = 'info'
                   e.textContent = newValue
                }else{
                   e.className = 'deactive'
                   e.textContent = ''
                }
            }


            if(props == 'type'){
                e.classList.toggle(newValue)
            }
               return true
            }
         })

        let  NameSender:any = null
        fbt.render(()=>{
        return div({className:'block-left form-left-enter'}, 
                    [
                        span({className:'loader-pannel'})
                    ])})

        POST_MY('../php/router.php', 'sample-variable','ok').onload = function(){
            let response = JSON.parse(this.responseText)
            let arrVariable = response.variable.variable
            const ClinicOBJ:any = response.constns
            let vn:Array<vnode> = []

            buttonName = {}
            payload = {}
            let tabIndex = 1
            arrVariable.forEach((vr:variable)=>{
                if(bt[vr.nameInput]){
                    if(typeof vr.html_input != 'string'){
                        vr.html_input.props.placeholder = vr.comment
                        if(!vr.html_input.props.name) vr.html_input.props.name = vr.nameInput
                        if(vr.html_input.props.name == 'button') vr.html_input.props.name = vr.html_input.props.name + '-' + vr.nameInput
                        if(vr.buttonName) buttonName['buttonName-'+vr.nameInput] = vr.buttonName
                        if(vr.buttonType) buttonName['buttonType-'+vr.nameInput ] = vr.buttonType
                        if(vr.payload) payload['payload-'+vr.nameInput ] = vr.payload
                        if(vr.payloadText){
                            payload['payloadText-'+vr.nameInput ] = vr.payloadText
                            vr.html_input.props.className  = 'deactive'
                        }

                       
                        if(!vr.buttonURL && !vr.buttonPHONE){
                            vr.html_input.props.tabIndex = String(tabIndex++)
                            vn.push(vr.html_input)
                        }else{
                            if(vr.buttonURL) buttonName['button-'+vr.nameInput] = encodeURIComponent(vr.buttonURL)
                            if(vr.buttonPHONE) buttonName['button-'+vr.nameInput] = vr.buttonPHONE
                      }

                        if(vr.NameSender) NameSender = vr.nameInput
                    }
                }
            })
           


        function send(){
            
            let contol = false //!контроль проверки кроме поля телефона
            let sample:string = bt['massenge-sample']
            let send:any = {
                NameSample:bt['name']
            }
            const inTel = <HTMLInputElement>document.querySelector("#tel-left-send")
            fbt.WatchValue['telefon'] = inTel.value
            fbt.WatchName['telefon'] = inTel
            
            if(bt.header) send.header = bt.header
            if(bt.footer) send.footer = bt.footer

            

            Object.keys(fbt.WatchValue).forEach((key)=>{ 

                if(fbt.WatchName[key].value == '') contol = true 
                 
               
                 
                if(NameSender && NameSender == key){
                    send['NameSender'] = fbt.WatchName[key].value
                }
                 
                if(sample.includes(`{{${key}}}`)){ //** еслт есть ключ меняем его из поля в массиве */

                 //  *    Исправляем дату 2023-10-12 12.10.2023   выискиваем методом валидации /
                if(fbt.WatchName[key].value.match(/([0-9]){4}(\-)([0-9]){2}(\-)([0-9]){2}$/)){
                    sample = replaceAll(`{{${key}}}`, formatDate(String(fbt.WatchName[key].value), true), sample)
                }else{
                    sample = replaceAll(`{{${key}}}`, fbt.WatchName[key].value, sample)
                }
                
                }
                
                if(key.split('-')[0] == 'button'){
                    send[key] = fbt.WatchName[key].value
                }
                 
                })
            
                // *Константы в шаблон*
            if(sample.includes(`{{clinic}}`)){ //** Если есть имя клиники*/
                sample = replaceAll(`{{clinic}}`, ClinicOBJ[clinic].name, sample)
            }
            
            if(sample.includes(`{{address}}`)){ //** Если есть имя клиники*/
                sample = replaceAll(`{{address}}`, ClinicOBJ[clinic].address, sample)
            }
            // *Кнопки *
            if(Object.keys(buttonName).length != 0){
                Object.keys(buttonName).forEach((key)=>{
                    send[key] = buttonName[key]
                })
            }
            
            if(Object.keys(payload).length != 0){
                Object.keys(payload).forEach((key)=>{
                    send[key] = payload[key]
                })
            }
            
            if(contol) return info.text = 'Не все поля заполнены'
            
            if(fbt.WatchValue['telefon'] != '' && fbt.WatchValue['telefon'].match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
                send.sample = sample
                send.examination = bt['examination']
                send.telefon = fbt.WatchName['telefon'].value
                if(bt['examination_day']) send.examination_day = bt['examination_day']

                console.log(send)


                let hash =  createSHA256Hash(JSON.stringify(send))
              
                if(!checkHash(JSON.stringify(send))) return info.text = 'Вы уже отправляли данное сообщение! ограничено время отправки одинаковых сообщений 3 минуты'
                btn_deactive(true);
                    // ! Закрыл отправку для тестига формы 
                POST_MY('../php/router.php', 'send-wa', JSON.stringify(send)).onload = function(){
                    btn_deactive(false);

                    if(this.status == 200 && IsJsonString(this.responseText)){

                        const  open_response = JSON.parse(this.responseText)

                         if(open_response.status == 200){
                             info.text = "Сообщение отправлено, но это не значит что сообщение доставлено. Смотрите статусы в правой панели"
                             info.type = 'green'
                             collect(false, true)// обновляем панель сообщений
                             //  обнулить формы
                            const _left = <HTMLDivElement>document.querySelector('.form-left-enter')
                              let inp = _left.getElementsByTagName('input')
                                for(let i = 0; i < inp.length; i++){
                                 let input  = <HTMLInputElement>inp.item(i)
                                     input.value = ''
                                }
                              let tex = _left.getElementsByTagName('textarea')
                                  for(let i = 0; i < tex.length; i++){
                                   let text  = <HTMLTextAreaElement>tex.item(i)
                                       text.value = ''
                                  }
                            info_left_whatsApp(fbt.WatchValue['telefon'])
                         }else{
                            if(info.type == 'green') info.type = 'green'
                             if(open_response.status == 201) info.text = open_response.text
                             if(open_response.status == 203) info.text = "Не правильно собран шаблон или ошибки в шаблоне обратитесь к разработчикам"
                             if(open_response.status == 511) window.location.href =  './../index.php'
                             if(open_response.status == 500) info.text =  "Сообщение не отправлено по техническим причинам сфотографируйте ошибку и оправьте в отдел маркетинга (Возможно нет денег на балансе) Error: "+ this.responseText 
                             if(open_response.status == 400){
                                 const btn = <HTMLButtonElement>document.querySelector('#btn-send-whatsApp')
                                 bt.examination = 0
                                 info.text = 'Сообщение уже было отправлено '+ open_response.text + ' Отправить повторно?'
                                 btn.textContent = "Отправить повторно"
                             }
                         }

                    }else{
                        if(this.status == 511) window.location.href =  './../index.php'
                    }
                        console.log('Ответ сервера: ', this.responseText)
                    }
            
            }else{
                info.text = "Неверно введен телефон"
            }
        }
        
       function focus_past(evt:Event){
        const input = <HTMLInputElement>evt.target
        if(input.value =="+7(" || input.value =="" ){
            navigator.clipboard.readText().then((data)=>{
             if(data != ''){ 
                 let tel = tel_preobr(data)
                 if(typeof tel == 'string'){
                     const past = <HTMLButtonElement>document.querySelector('.put-copy-paste')
                     past.className = "put-copy-paste"
                     
                 }else{
                     console.error('Не соответсвует номеру')
                 }
              }
         })
        }
       }

       function past_value(){
        const past = <HTMLButtonElement>document.querySelector('.put-copy-paste')
        past.className = "put-copy-paste deactive"
        const input = <HTMLInputElement>document.querySelector('#tel-left-send')
        navigator.clipboard.readText().then((data)=>{
            if(data != ''){ 
                telefon_copy_past(input)
            }
        })
       }

       function offpaste(evt:any){
        const input = <HTMLInputElement>evt.target
        const past = <HTMLButtonElement>document.querySelector('.put-copy-paste')
        if(input.value =="+7(" || input.value == "" ){
            navigator.clipboard.readText().then((data)=>{
                if(data != ''){ 
                    let tel = tel_preobr(data)
                    if(typeof tel == 'string'){
                        const past = <HTMLButtonElement>document.querySelector('.put-copy-paste')
                        past.className = "put-copy-paste"
                    }}})
        }else{
            past.className = "put-copy-paste deactive"
        }
       }

        fbt.render(()=>{
        return div({className:'block-left form-left-enter'}, 
                    [
                        p('Телефон'),
                        div({className:'column'},[
                        input({type:'tel', name:'telefon', placeholder:'Телефон',onclick:focus_past, onkeydown:(evt)=>{phone_mask(evt);  offpaste(evt)}, tabIndex:'1', onfocus:(evt:Event)=>{click_phone_masck(evt)} , onpaste:(evt)=>telefon_copy_past(<HTMLInputElement>evt.target), id:'tel-left-send'}),
                        btn({className:"put-copy-paste deactive", onclick:past_value},'Вставить из буфера')
                        ]),
                        ...vn,
                        btn({className:'btn-href', id:'btn-send-whatsApp',onclick:send}, "Отправить"),
                        p({className:'deactive', id:'info'})
                    ])
        })
    
    }
}

cl_btn_sample_wa = click_btn // передаем во внешний источник

function ShowSample(strSample:string){
    const bl = <HTMLDivElement>document.querySelector('.samp-clue')
    if(bl.className.includes('deactive')) bl.classList.toggle('deactive')
    bl.children[1].textContent = strSample
}






    POST_MY('../php/router.php', 'sample', 'ok ').onload = function(){
        const sample = JSON.parse(this.responseText)
       
        let contrChapter:Array<string> = []
        let l:number = -1;
        
        sample.buttons.forEach((bt:send)=>{
             
                if(!contrChapter.includes(bt.chapter)){
                    l = l + 1
                    blocks.push(div({className:'block-right deactive'},[h4(bt.chapter),div({className:'row-btn'})]))
                    contrChapter.push(bt.chapter)
                }


                if(bt.clinic.includes(clinic) && bt.role.includes(role)){
                    
                            blocks[ contrChapter.indexOf(bt.chapter) ].props.className = 'block-right'
                            blocks[ contrChapter.indexOf(bt.chapter) ].children[1].children.push(

                            div({className:'btn-massange'},
                                [
                                    btn({className:'clue', onclick:()=>ShowSample(bt['massenge-sample'])}, '?'),
                                    input({type:'radio' , name:'forms', id:bt.id }),
                                    label({for:bt.id, onclick:()=>click_btn(bt), id:bt.id + "_sample"}, bt.name ),
                                    bt.comment != ''?p({className:'title'}, bt.comment):p()
                                ])
                            )
                }
        })

        function endClue(){
            const bl = <HTMLDivElement> document.querySelector('.samp-clue')
            bl.children[1].textContent = ''
            bl.classList.toggle('deactive')
        }

        
        right.render(()=>{
            return div({className:'right-panel'},[
                 div({className:'samp-clue deactive'},
                        [
                            btn({className:'btn-exit', onclick:endClue},'×'),
                            p(),
                        ]), ...blocks]) }
        )
        
    }


    function btn_deactive(bool:boolean){

        let btn = document.querySelector("#btn-send-whatsApp")
        console.log(btn)
        if(bool){
            btn?.setAttribute('disabled', '')
        }else{
            btn?.removeAttribute('disabled')
        }
   }

//    hash
    function createSHA256Hash(string:string):string {

        
        let hash = 0;

        if (string.length == 0) return String(hash);

        for (let  i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return hash+'/'+ (new Date().getTime() + 3*60000);
    }

    function checkHash(string:string){
        let  hash = createSHA256Hash(string);
        let control = true;
        if(my_cookie.sendHash){

            let Hash = JSON.parse(my_cookie.sendHash)
            console.log(Hash)
             Hash.forEach((el:any, i:number)=>{
                 if(el.split('/')[0] == hash.split('/')[0]){
                      control = false;
                 }
                if(el.split('/')[1] < new Date().getTime()){
                     Hash.splice(i, 1)
                }
             })
             if(control) Hash.push(hash)
            my_cookie.sendHash = JSON.stringify(Hash)

        }else{
            my_cookie.sendHash = JSON.stringify([hash])
        }

        return control;
    }

    }
