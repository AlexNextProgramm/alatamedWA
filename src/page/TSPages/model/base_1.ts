import { forEach, values } from "../../../../webpack.config";
import { formatDate } from "../../../library/Date";
import { POST_MY } from "../../../library/GetPost";
import { my_cookie } from "../../../library/cookie";
import { ExhiDOM, btn, div, h1, img, input, label, option, p, select, table, td, th, tr, vnode } from "../../../library/exhibit/exhibit";
import { IsJsonString, replaceAll, replaceArrayAll } from "../../../library/json";
import { click_phone_masck, phone_mask } from "../../../library/upgrade_form";
import { system } from "../system_admin";
import { CLINIC } from "./constant_object";

interface row_base{
    id:string
    date:string
    id_user:string
    message:string
    NameSample:string
    name_user:string
    requestId:string
    sender_name:string
    telefone:string
    role_user:string
    Error:string
    status:number
    filial:string
}


const ROLE:any =  {
     admin:"Администратор клиники",
     senior_admin:"Старший Администратор",
     doctor:"Врач",
     marketing:"Маркетинг",
     system_admin:"Системный администратор",
     "":"Не определено"
}
const ERRORSEND:any = {
    '0':'Без ошибок',
    '1':'Ошибки при отправке'
}
let data_base:Array<row_base> = []

export function base(render:any){
    let date  = new Date()
    let DateEnd = formatDate(date, true)
    date.setDate(date.getDate() - 14)
    let DateStart = formatDate(date, true)

    POST_MY('../php/router.php', 'get-base',  JSON.stringify({
        start:DateStart,
        end:DateEnd
    })).onload = function(){
        const base_block = new ExhiDOM('panel')

        let table_base:Array<vnode> = []

        const sortImg = require('../../../images/whatsApp/sort.png')
        const sortReturnImg = require('../../../images/whatsApp/sort-return.png')
        const magnifier = require('../../../images/whatsApp/magnfier.png')
        const breakImg = require('../../../images/whatsApp/break_1.png')
        const chengeImg = require('../../../images/whatsApp/chenge.png')

        let sort_d = false
        let sort_er = false
        let btn_switches:Array<vnode> = []


        if(IsJsonString(this.responseText)){
             data_base = JSON.parse(this.responseText)
            sort_data(false) //  сортировка
            if(my_cookie.sours_clinic && my_cookie.sours_clinic != 'All') data_base = source_clinic(my_cookie.sours_clinic)
            construct_table(data_base)
        }else{
            console.error("Не нашел json в запросе функции базы")
            console.error(this.responseText)
        }



        function construct_table(data_base:Array<row_base>, sortReturn:boolean = false, tabNumber:number = 1){
            const step = 9
            table_base = []
            table_base.push(tr(
                [
                    th([p('Дата'), img({className:'sort', src:sort_d?sortReturnImg:sortImg, onclick:()=>sort_data(sortReturn)})]),
                    th('Время'),
                    th('Имя получателя'),
                    th('Номер'),
                    th('Имя кнопки'),
                    th('Имя отправителя и роль'),
                    th('Клиника'),
                    th([p('Ошибки'), img({className:'sort', src:sort_er?sortReturnImg:sortImg, onclick:()=>sort_error(sortReturn)})]),
                    th('Ответ сервера'),
                    th('Статус')
                ]
            ))

           
            btn_switches = []
            let show = ''
            const z = Number(String(data_base.length/10).split('.')[0]) + 1// получаем количетсво табов 

            for(let i = 1; i <= z; i++){
                Math.ceil(tabNumber/10)*10 >= i && Math.ceil(tabNumber/10)*10 - 10 < i? show = '': show = 'show'
                    btn_switches.push(
                                    div({className:'block-btn-sw '+ show },
                                        [
                                            input({type:'radio', name:'switches', id:'sw'+ i, checked:true}),
                                            label({for:'sw'+ i, onclick:()=>nextlist(i, data_base)}, String(i)),
                                        ]))
            }


            for(let i = 0; i < data_base.length; i++){ //**цикл по таблице */

 
               
                if(i  <= tabNumber*10  && i  >= tabNumber*10 - (step + 1)){
                const filial = CLINIC[data_base[i]['filial']]? CLINIC[data_base[i]['filial']]:'Не определено'


                    table_base.push(
                        tr({className:data_base[i]['Error'] == '1'?'red':''},[
                            td(data_base[i]['date'].split(' ')[0]),
                            td(data_base[i]['date'].split(' ')[1]),
                            td(data_base[i]['sender_name']),
                            td(data_base[i]['telefone']),
                            td([p(data_base[i]['NameSample'].slice(0, 50)), p({className:'message'}, data_base[i]['message'])]),
                            td([
                                p(data_base[i]['name_user']),
                                p({className:'role-text'},ROLE[data_base[i]['role_user']]),
                            ]),
                            td(filial),
                            td(ERRORSEND[data_base[i]['Error']]),
                            td({className:'td-responce'},data_base[i]['requestId']),
                            td(String(data_base[i]['status']))
                        ])
                    )
                }
            }
            

           if(btn_switches.length > 10){
               btn_switches.push( div({className:'block-btn-list', },
               [
                   input({type:'radio', name:'switches', id:'sw-next', }),
                   label({for:'sw-next', onclick:nextbtnList},'>'),
               ]))

               btn_switches.unshift(div({className:'block-btn-list' },
               [
                   input({type:'radio', name:'switches', id:'sw-end', }),
                   label({for:'sw-end', onclick:endbtnList},'<'),
               ]))
           }
           
        }

        function endbtnList(){
            let ArraytabEl = document.querySelectorAll('.block-btn-sw')
            let tab = 0

            for(let i = ArraytabEl.length-1; i > -1 ; i--){
                if(ArraytabEl[i].className == 'block-btn-sw '){
                    tab = i
                   if(ArraytabEl[0].className == 'block-btn-sw show')  ArraytabEl[i].className = 'block-btn-sw show'
                }
            }
            
           
           if(tab != 0){
               for(let i = tab - 10 ; i < tab ; i++){
                   console.log(i)
                   ArraytabEl[i].className = 'block-btn-sw '
               }
           }
           
        }


        function nextbtnList(){
                let ArraytabEl = document.querySelectorAll('.block-btn-sw')
                let tab = 0

                for(let i = 0; i < ArraytabEl.length; i++){
                    if(ArraytabEl[i].className == 'block-btn-sw '){
                        tab = i
                    if(ArraytabEl[ArraytabEl.length -1].className == 'block-btn-sw show')  ArraytabEl[i].className = 'block-btn-sw show'
                    }
                }
                tab++
                let max =  ArraytabEl.length < tab + 10?ArraytabEl.length:tab + 10
                for(let i = tab; i < max; i++){ 
                    ArraytabEl[i].className = 'block-btn-sw '
                }

        }

        function nextlist(len:number, data_base:Array<row_base>){
            construct_table(data_base, false, len)
            base_block.render()
        }

        function sort_data(sortReturn:boolean){
          data_base.sort(function(a:row_base, b:row_base){

                let d = formatDate(a.date.split(' ')[0])
                let datA = new Date(d +'T'+ a.date.split(' ')[1])
                      d = formatDate(b.date.split(' ')[0])
                let datB = new Date(d +'T'+ b.date.split(' ')[1])
                
                if(sortReturn){
                    if(datA.getTime() > datB.getTime()) return 1
                    if(datA.getTime() < datB.getTime()) return -1
                }else{
                    if(datA.getTime() < datB.getTime()) return 1
                    if(datA.getTime() > datB.getTime()) return -1
                }

                return 0
            })
                if(sortReturn){
                    sort_d = false
                    construct_table(data_base, false)
                }else{
                    sort_d = true
                    construct_table(data_base, true)
                }
           base_block.render()
        }

        function sort_error(sortReturn:boolean){
           let sort_base = data_base.sort(function(a:row_base, b:row_base){
                if(sortReturn){
                    // if(Number(a.Error) < Number(b.Error)) return 1
                    if(Number(a.Error) > Number(b.Error)) return -1
                }else{
                    // if(Number(a.Error) > Number(b.Error)) return 1
                    if(Number(a.Error) < Number(b.Error)) return -1
                }
                return 0
            })
            if(sortReturn){
                sort_er =false
                construct_table(sort_base, false)
            }else{
                sort_er = true
                construct_table(sort_base, true)
            }
           
           base_block.render()
        }


        function source_telefone(evt:any){

            const input  = <HTMLInputElement>evt.target.parentElement.children[0]
            if(input.value != '' && input.value != '+7('){
                let tel = replaceArrayAll(['+', ')', '(', '-', ' '],'', input.value)
                let source_data:Array<row_base> = []

                if( my_cookie.sours_clinic != "All"){
                    data_base = source_clinic(my_cookie.sours_clinic)
                }else{
                    source_date(false)
                }

                data_base.forEach((data:row_base)=>{
                    if(data.telefone == tel){
                        source_data.push(data)
                    }
                })

                construct_table(source_data)
                base_block.render()
            }

        }

        function source_date(bolrender = true){
            
            DateStart = formatDate( base_block.WatchValue['stDate'], true)
            DateEnd = formatDate(base_block.WatchValue['enDate'], true)
           
            POST_MY('../php/operation.php', 'get-base',  JSON.stringify({
                start:DateStart,
                end:DateEnd
            })).onload = function(){


                if(IsJsonString(this.responseText)){
                    data_base = JSON.parse(this.responseText)
                    construct_table(data_base)
                   if(bolrender) base_block.render()
               }else{
                   console.log(this.responseText)
                   // !Написать ошибку со стороны сайта не пришел json file
               }
            }
        }


        function source_but(){

            if(base_block.WatchValue['source_but'] != '' && base_block.WatchValue['source_but'].length >= 2){
                let source_data:Array<row_base> = [];

                if(my_cookie.sours_clinic != "All"){
                    data_base = source_clinic(my_cookie.sours_clinic)
                }else{
                    source_date(false)
                }

                data_base.forEach((data:row_base)=>{
                    if(data.NameSample.trim().toLowerCase().includes(base_block.WatchValue['source_but'].trim().toLowerCase())){
                        source_data.push(data)
                    }
                })
               
                construct_table(source_data)
                base_block.render()
            }else{
                construct_table(data_base)
                base_block.render()
            }
        }

        function breackBtn(){
           render()
        }

        function source_clinic(names:string):Array<row_base>{
           
            const data_clinic:Array<row_base> = []

            if(names != 'All'){
                data_base.forEach((row_base:row_base)=>{
                    if(row_base.filial == names) data_clinic.push(row_base)
                })
              
                return data_clinic
            }
            return data_base
        }


        function OnchengeSoursClinic(evt:Event){
            const selectClinic = <HTMLSelectElement> evt.target
            my_cookie.sours_clinic = selectClinic.value
           
            if(selectClinic.value == "All"){
                source_date()
            }else{
                source_date(false)
                data_base = source_clinic(selectClinic.value)
                sort_data(false)
                construct_table(data_base)
                base_block.render()
            }
        }
      

        base_block.render(()=>{


            if(btn_switches.length == 1) btn_switches = []
            if(!my_cookie.sours_clinic) my_cookie.sours_clinic = 'All'
            let SelectSortClinic:vnode = select({ onchange:OnchengeSoursClinic}, [option({value:'All', selected: my_cookie.sours_clinic == 'All' }, 'Все')])
            Object.keys(CLINIC).forEach((names:string)=>{
                SelectSortClinic.children.push(option({value:names ,  selected: my_cookie.sours_clinic == names}, CLINIC[names]  ))
            })



            return div({className:'panel base'},[
                h1("База сообщений"),
                div({className:'source-pannel'},
                [
                   img({ className:'btn-breack', title:'Выход из панели отчета', src:breakImg, onclick:breackBtn }),
                    div(SelectSortClinic),
                    div([
                        input({type:'tel', onkeydown:phone_mask, onfocus:click_phone_masck, name:'source_telefone', placeholder:'Поиск по телефону', tabIndex:'1'}),
                        img({src:magnifier,title:'Осуществить поиск', onclick:source_telefone, tabIndex:'2'})
                    ]),
                    div([
                        input({type:'text',  name:'source_but', onkeyup:source_but, placeholder:'Поиск по имени кнопки', tabIndex:'3'}),
                        // img({src:magnifier,title:'Осуществить поиск', onclick:source_but, tabIndex:'4'})
                    ]),
                    div([
                        p('период с'),
                        input({type:'date',  name:'stDate', value:formatDate(DateStart),  tabIndex:'5'}),
                        p('по'),
                        input({type:'date', name:'enDate', value:formatDate(DateEnd),  tabIndex:'6'}),
                        img({src:chengeImg, title:'Обновить таблицу', onclick:source_date, tabIndex:'7'})
                    ]),
                ]),
                table({className:'table-base'},table_base),
                div({className:'btn-table-switches'}, btn_switches)
            ])
        })
    }



 }