import { formatDate } from "../../../../library/Date";
import { POST_MY } from "../../../../library/GetPost";
import { ExhiDOM, a, btn, button, div, h1, img, input, p, table } from "../../../../library/exhibit/exhibit";
import { click_phone_masck, phone_mask, telefon_copy_past } from "../../../../library/upgrade_form";
import { Loading } from "../../../../models/Loading/Loading";
import { table_nalog } from "./table";



export function nalog(render:Function){

   const block = new ExhiDOM('panel')
   const magnifier = require('../../../../images/whatsApp/magnfier.png')
   const breakImg = require('../../../../images/whatsApp/break_1.png')
   const chengeImg = require('../../../../images/whatsApp/chenge.png')
   let date  = new Date()

   const send:any = {
       en:formatDate(date, true),
       st:''
    }
    date.setDate(date.getDate() - 14)
    send.st = formatDate(date, true)
    
    block.InQueue = [
     ()=>table_nalog(send, render)
    ]

    function source(){
        const send:any = {
             en:formatDate(block.WatchName['enDate'].value,  true),
             st:formatDate(block.WatchName['stDate'].value, true)
        }

        if(block.WatchName['bid'].value != '') send.bid = block.WatchName['bid'].value
        if(block.WatchName['source_telefone'].value != '' && block.WatchName['source_telefone'].value != '+7(') send.telefon = block.WatchName['source_telefone'].value
        table_nalog(send, render)
    }

    function all_nezakuty(){
        const send:any = {
             en:formatDate(block.WatchName['enDate'].value,  true),
             st:formatDate(block.WatchName['stDate'].value, true)
        }
        send.position = 'All'
         table_nalog(send, render)
    }
     function all_nevidan(){
        const send:any = {
             en:formatDate(block.WatchName['enDate'].value,  true),
             st:formatDate(block.WatchName['stDate'].value, true)
        }
        send.nevidan = 'All'
         table_nalog(send, render)
    }

    function source_famyli(){
         const send:any = {
             famyli:block.WatchName['source_famyli'].value
        }
        table_nalog(send, render)
    }



    block.render(()=>{
    return div({className:'panel base nalog-panel'},[
            h1("Налоговый вычет"),
            div({className:'source-pannel'},
            [
               img({ className:'btn-breack', title:'Выход из панели отчета', onclick:()=>{render()}, src:breakImg, }),
                div({className:"column-source"},[
                    div([
                         input({type:'text', name:'source_famyli', placeholder:'Введите фамилию', tabIndex:'1'}),
                    ]),
                    div([
                        btn({className:"btn-href btn-fam", tabIndex:'7', onclick:source_famyli}, "Поиск по фамилии"),
                    ]),
                ]),
               div({className:"column-source"},[
                    div([
                         input({type:'tel', onkeydown:phone_mask, onfocus:click_phone_masck, onpaste:(evt)=>telefon_copy_past(<HTMLInputElement>evt.target), name:'source_telefone', placeholder:'Поиск по телефону', tabIndex:'1', id:'tel-source'}),
                    ]),
                    div([
                        input({type:'text', name:'bid', placeholder:'Поиск по заявке', tabIndex:'1', id:'tel-source'}),
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
                    div([
                        btn({className:"btn-href reset btn-red", tabIndex:'8', onclick:all_nezakuty},"Все незакрытые"),
                        btn({className:"btn-href", tabIndex:'7', onclick:source}, "Поиск"),
                    ]),
                    div([
                         btn({className:"btn-href reset btn-blue", tabIndex:'8', onclick:all_nevidan}, "Ожидают выдачу"),
                         
                         btn({className:"btn-href reset", tabIndex:'8', onclick:()=>{nalog(render)}}, "Сброс"),
                     ]),
                ]),
                // div({className:"column-source"},[
                //  ]),
            ]),
            div({className:'inform-table-dop'},[
                p("Лицензии: "),
                p({className:"a", onclick:()=>printFile('../php/licenses/Altamed.pdf') },"Альтамед+"),
                p({className:"a", onclick:()=>printFile('../php/licenses/odinmed.pdf') },"Одинмед"),
                p({className:"a", onclick:()=>printFile('../php/licenses/odinmedplus.pdf') },"Одинмед+"),
                p({className:"a", onclick:()=>printFile('../php/licenses/dubki.pdf') },"Альтамед+ Дубки"),
                
            ] ),
            div({className:'inform-table'}),
            table({className:'table-nalog'}, div({className:"load"},Loading())),
        ])
    })
}


export function printFile(url:string){
    let new_window:any = window.open(url);
      new_window.print();
}
