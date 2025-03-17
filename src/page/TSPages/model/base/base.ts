import { formatDate } from "../../../../library/Date"
import { POST_MY } from "../../../../library/GetPost"
import { my_cookie } from "../../../../library/cookie"
import { ExhiDOM, btn, div, h1, img, input, li, option, p, select, table, td, th, tr, vnode } from "../../../../library/exhibit/exhibit"
import { IsJsonString, family_min } from "../../../../library/json"
import { click_phone_masck, phone_mask } from "../../../../library/upgrade_form"
import { Loading } from "../../../../models/Loading/Loading"
import { CLINIC, ROLE } from "../constant_object"
import { SendBase, row_base } from "./interface"
import { construct } from "./table"
import { EXELFILE } from "./INEXELE"



export function base_new(render:Function){
    // Формируем начальные данные для запроса
    let date  = new Date()
    const send:SendBase = {
        en:formatDate(date, true),
        st:''
    }
    date.setDate(date.getDate() - 14)
    send.st = formatDate(date, true)

    let clinic:string|undefined = my_cookie.sours_clinic ?my_cookie.sours_clinic:undefined
    if(clinic && clinic != 'All') send.clinic = clinic

    const block = new ExhiDOM('panel')

    const magnifier = require('../../../../images/whatsApp/magnfier.png')
    const breakImg = require('../../../../images/whatsApp/break_1.png')
    const chengeImg = require('../../../../images/whatsApp/chenge.png')
    const BASE:Array<row_base> = []
    
    function get_base(send:SendBase){
        POST_MY('../php/router.php', 'get-base-new',  JSON.stringify(send)).onload = function(){
            if(IsJsonString(this.responseText)){
               
             const row = construct(JSON.parse(this.responseText))
             inform_table(row)
            }else{
                console.error("Не нашел json в запросе функции базы")
                console.error(this.responseText)
            }
        }
        
    }
    function list_sample(){
        POST_MY('../php/router.php', 'sample-variable',  JSON.stringify(send)).onload = function(){
            if(IsJsonString(this.responseText)){
                const post = JSON.parse(this.responseText)
               
                const list:Array<vnode> = []
                list.push(option("Все кнопки"))
                post.sample.buttons.forEach((values:any)=>{
                    list.push(option(values['name']))
                })

                new ExhiDOM('panel-name-sample').render(()=>{
                    return select({id:"list-sample"},list)
                })
               
               }else{
                   console.error("Не нашел json в запросе шаблонов")
                   console.error(this.responseText)
               }
        }
    }

    function list_sender(){
        POST_MY('../php/router.php', 'get-base-sender', 'ok').onload = function(){
            if(IsJsonString(this.responseText)){
                const post = JSON.parse(this.responseText)
                const list:Array<vnode> = []
                list.push(option({value:"-1"},"Все сотрудники"))

                console.log(post)
                post.forEach((values:any)=>{
                    list.push(option({value:values['id']},family_min(values['name'])))
                })

                new ExhiDOM('panel-name-sender').render(()=>{
                    return select({id:"list-sender"},list)
                })
               
               }else{
                   console.error("Не нашел json в запросе шаблонов")
                   console.error(this.responseText)
               }
        }
    }


    get_base(send)
    list_sample()
    list_sender()
    function OnchengeSoursClinic(evt:Event){
        const selectClinic = <HTMLSelectElement> evt.target
        my_cookie.sours_clinic = selectClinic.value
    }

    function source_click(){
        const send:SendBase = {en:"", st:""}
        const Inputelefon = <HTMLInputElement>document.querySelector('#tel-source')
        const selectSample = <HTMLSelectElement>document.querySelector('#list-sample')
        const selectSender = <HTMLSelectElement>document.querySelector('#list-sender')
        const stDate = <HTMLSelectElement>document.querySelector('#stDate')
        const enDate =  <HTMLSelectElement>document.querySelector('#enDate')
        send.st = formatDate(stDate.value, true)
        send.en = formatDate(enDate.value, true)

        if(Inputelefon.value != '') send.telefon = Inputelefon.value
        if(selectSample.value != 'Все кнопки') send.NameSample = selectSample.value
        if(my_cookie.sours_clinic != 'All') send.clinic = my_cookie.sours_clinic
        if(my_cookie.sours_clinic != 'All') send.clinic = my_cookie.sours_clinic
        if(selectSender.value != '-1') send.sender = selectSender.value
      
        get_base(send)
    }

    function inform_table(row:Array<number>){
        const inf = new ExhiDOM('inform-table')
        inf.render(()=>{
            return div({className:'inform-table'},[
                p("Всего строк: " + String(row[0])),
                p("Альтамед+: "+ String(row[1])),
                p("Одинмед: "+ String(row[2])),
                p("Одинмед+: "+ String(row[3])),
                p("Дубки: "+ String(row[4])),
                p("Альтамед Бьюти: "+ String(row[5])),
                p("Пролетарка: "+ String(row[6])),
                p("не определено: "+ String(row[7])),
                btn({onclick:EXELFILE},"в еxcel")
            ])
        })
    }




    block.render(()=>{
        

        let SelectSortClinic:vnode = select({ onchange:OnchengeSoursClinic}, [option({value:'All', selected: my_cookie.sours_clinic == 'All' }, 'Все')])
        Object.keys(CLINIC).forEach((names:string)=>{
            SelectSortClinic.children.push(option({value:names ,  selected: my_cookie.sours_clinic == names}, CLINIC[names]  ))
        })


        return div({className:'panel base'},[
            h1("База сообщений"),
            div({className:'source-pannel'},
            [
               img({ className:'btn-breack', title:'Выход из панели отчета', onclick:()=>{render()}, src:breakImg, }),
               div({className:"column-source"},[
                   div(SelectSortClinic),
                   div({className:"panel-name-sender"}),
                   
                ]),
                div({className:"column-source"},[
                    div({className:"panel-name-sample"}),
                    div([
                        input({type:'tel', onkeydown:phone_mask, onfocus:click_phone_masck, name:'source_telefone', placeholder:'Поиск по телефону', tabIndex:'1', id:'tel-source'}),
                    ]),
                 ]),
                div({className:"column-source"},[
                    div([
                            p('период с'),
                            input({type:'date',  name:'stDate', value:formatDate(send.st),  tabIndex:'5', id:"stDate"}),
                        ]),
                    div([
                            p('по'),
                            input({type:'date', name:'enDate', value:formatDate(send.en),  tabIndex:'6', id:"enDate"}),
                        ])
                ]),
                div({className:"column-source"},[
                    btn({className:"btn-href", tabIndex:'7', onclick:source_click}, "Поиск"),
                    btn({className:"btn-href reset", tabIndex:'8', onclick:()=>{base_new(render)}}, "сброс"),
                   
                ])
            ]),
            div({className:'inform-table'}),
            table({className:'table-base'}, div({className:"load"},Loading())),
            div({className:'btn-table-switches'})
        ])
    })



}