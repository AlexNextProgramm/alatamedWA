
import { emit } from "process";
import { forEach } from "../../../../../webpack.config";
import { formatDate } from "../../../../library/Date";
import { POST_MY } from "../../../../library/GetPost";
import { my_cookie } from "../../../../library/cookie";
import { drag_and_drop } from "../../../../library/darg_and_drop";
import { ExhiDOM, div, td, th, tr, vnode, table, btn, p, a, h1, input, label, h2, img } from "../../../../library/exhibit/exhibit";
import { delfile, nameFile, openFile } from "./form";
import { family_min, replaceArrayAll } from "../../../../library/json";
import { RELATION_DEGREE, color_cl, nalogSQL, pl_clinic, pl_clinic_engl } from "./interface";
import { printFile } from "./nalog";
import { format_tel } from "../../../../library/upgrade_form";
import { cl_btn_sample_wa } from "../right_panel";

const status:any = {
    0: "Новая",
    1: "В работе",
    2: "Готово"
}



export function table_nalog(time:any, render:Function){
       
   POST_MY('../php/nalog.php', 'get-table', JSON.stringify(time)).onload = function(){
       if(this.status == 200){
           construct(JSON.parse(this.responseText), render)
        }else{
        console.error(this.responseText)
    }
   }
}



function construct(tab:Array<nalogSQL>, render:Function){

    const waIcon = require('../../../../images/whatsApp/Whatsapp_2.png')
    const printIcon = require('../../../../images/whatsApp/print_2.png')
    const widatIcon = require('../../../../images/whatsApp/vidat_2.png')

    const block = new ExhiDOM('table-nalog')
    
    if(tab.length == 0){
         block.render(()=>{
            return table({className:"table-nalog"}, h2("Не найдено результатов"))
            })
        return
    }
    const tab_n:Array<vnode> = []
    tab_n.push(
        tr([
            th("Заявка"),
            th('Дата и время'),
            th('Данные пациента'),
            th('Данные Налогоплательщика'),
            // th('Файлы'),
            th("Клиника"),
            th("Статус"),
            th("Админ"),
            th("Файлы"),
            th("Действия")
        ]))

    let z = 0
    let o = 0
    let v = 0
    tab.reverse().forEach((row:nalogSQL)=>{
        const GlobalStatus = `glob-status-${row.status}`
        let is_control = false
       if(row.status != 2){
        z++
        }
        if(row.status == 1){
        o++
        }
         if(row.status == 2){
            v++
         }
         
        let cl:Array<vnode> = []

        const CLO = JSON.parse(row.clinic)
        let r = Object.keys(CLO).length
        let place = true

           Object.keys(CLO).forEach((key, ind)=>{
             if(pl_clinic[row.place] == key){
                place = false

            }
           })
           if(place) r = r + 1

        const ArrayArgument:[Function, string, string, string, ] = [render, row['nameNalog'], pl_clinic_engl[row['place']],format_tel(row.telefon)]
        const Datedo = new Date(row.date.split(' ').join("T"))
        Datedo.setDate(Datedo.getDate() + 10);
        const DateOst = new Date()
        const Timest =Datedo.getTime() -  DateOst.getTime() 
        let OST = 0
        if(Timest > 0){
         OST = Math.round(Timest /(1000 * 60 * 60 * 24));
        }


       
        
        cl.push(
             td({className:'bl-rw-gl '+ GlobalStatus + ' zayvka', rowspan:r},"#" + String(row.id)),
             td({className:'bl-rw-gl '+ GlobalStatus, rowspan:r},
             [
                p(formatDate(row.date.split(' ')[0], true)) , p(row.date.split(' ')[1]), 

                row.status == 1?
                p({className:"gotov"},"Подготовлено"):
                row.status == 2? p({className:"gotov"},"Выдано"):
                p("<br> Подготовить до " + formatDate(Datedo, true) + " <br> "),

                row.status == 0?
                OST > 3? p({className:"gotov"}, "Осталось дн.: " + OST):
                OST > 0? p({className:"new"},"Осталось дн.: " + OST):
                p({className:"new"},"ПРОСРОЧЕНО")
                :div()
                
            ]),
             td({className:'bl-rw-gl '+ GlobalStatus, rowspan:r},[ 
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, "Имя: "+row['name']), 
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, "Дата рожд.: " + row['date-birth']),
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, row.email), 
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, format_tel(row.telefon))]),
             td({className:'bl-rw-gl '+ GlobalStatus, rowspan:r},[ 
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover},  "Имя: " + row['nameNalog']),
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, "ИНН: " + row.INN),
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, "Степень родства: " + RELATION_DEGREE[row.RELATION_DEGREE]), 
                         p({className:"mail-click", data:'Кликни, чтобы скопировать в буфер', onclick:copy, onmouseover:copyHover}, "За период: " + row["date-season"])]),
        )
           

        Object.keys(CLO).forEach((key, ind)=>{

            let Files:Array<vnode> = [ p({className:'slip', onclick:()=>zayvlenie(row.id, key)},'Заявление'), p("Нет файлов") ];
            let clas = 'bl-br '+  GlobalStatus
            let classStatus = 'new'
            const rowBtn:Array<vnode> = [div({className:"btn-row", id:"row_btn_" + row.id + "_" + ind  },[])]

            if(CLO[key]['file']){

             Files = [ p({className:'slip', onclick:()=>zayvlenie(row.id, key)}, 'Заявление')]

             CLO[key]['file'].forEach((file:string, i:number)=>{i++; Files.push(div({className:'files-block'},
                [
                a({href:file, target:"_blank"}, nameFile(file)), 
                CLO[key].adminID == my_cookie.id_user && CLO[key].status != 2? btn({ onclick:(evt:any)=>delfile(evt, key, row.id)}, '×'):div(),
               
                ])
                )})
            }


        if(ind != 0) cl = []
        if(ind == r-1) clas = "bl-rw "+ GlobalStatus
        if(place && ind == r-2) clas = "bl-rw "+ GlobalStatus

        let btv:vnode =  td({className:clas}, btn({className:'hire', onclick:(evt:any)=>hire_document(evt, row.id, key, ind, ArrayArgument), id:'btn_' + row.id+'_'+ind},"Взять в работу"))
        let flv:vnode = td({className:clas, id:'fl_' + row.id +'_'+ind}, div({className:"flex"}, [...Files, ...rowBtn]))


        if(CLO[key].status == 1){
           
            classStatus = 'inhere'
            if( CLO[key].adminID == my_cookie.id_user){
                flv =  td({className:clas, id:'fl_' + row.id+'_'+ind},[ div({className:"flex"},  [...Files, ...rowBtn]), btn({className:"a_bt",onclick:()=>openFile(ind, key, row.id, ArrayArgument)}, "Ещё загрузить")])
                btv =  td({className:clas}, btn({className:'hire', onclick:()=>closeHire(key, row.id, ind, ArrayArgument), id:'btn_' + row.id + '_' + ind},  "Закрыть заявку"))
            }else{
                flv =  td({className:clas, id:'fl_' + row.id+'_'+ind},div({className:"flex"},  [...Files, ...rowBtn]))
                btv =  td({className:clas}, btn({className:'hire', onclick:()=>openFile(ind, key, row.id, ArrayArgument), disabled:true, id:'btn_' + row.id+'_'+ind}, "Выполняется..."))
            }
        }



        if(CLO[key].status == 2){
             classStatus = 'gotov'
             if(ind == Object.keys(CLO).length - 1 && row.status != 0) 
                rowBtn[0].children.push(

                        img({className:'btn-print-all', src:printIcon, onclick:()=>printAllFile(row.id)}),
                        row.send_wa == 1? img({className:"btn-print-all disabled", src:waIcon}):
                        img({className:"btn-print-all", src:waIcon, onclick:()=>wa_send(...ArrayArgument, String(row.id) ),}),
                        row.status == 2? img({className:'btn-print-all disabled', src:widatIcon }):
                        img({className:'btn-print-all', src:widatIcon ,  onclick:(evt:any)=>gotovnost(evt, row.id)}),

                        )
                
                
             btv = td({className:clas}, btn({className:'hire', disabled:true , id:'btn_' + row.id+'_'+ind}, "Исполнено")),
             flv = td({className:clas, id:'fl_' + row.id+'_'+ind},div({className:"flex"}, [...Files, ...rowBtn] ))
        }



            cl.push(
                  td({className:clas + ' tab-color',  style:'--color-tab:'+ color_cl[key]+';', data: pl_clinic[row.place] == key? "★":" "  },  key ),
                  my_cookie.role == 'senior_admin' || my_cookie.role == 'system_admin'?
                  td({className:clas, id:'st_' + row.id+'_'+ind}, p({className:classStatus + ' pointer', onclick:()=>returnStatus( key, String(row.id), ind, ArrayArgument)}, status[String(CLO[key].status) ]))
                  :
                  td({className:clas, id:'st_' + row.id+'_'+ind}, p({className:classStatus}, status[String(CLO[key].status) ])),
                  td({className:clas, id:'fm_' + row.id+'_'+ind}, CLO[key].adminName?family_min( CLO[key].adminName):"Не назначено"),
                   flv,btv
           )
           
          

           let  cll = []
           if(place && !is_control){
            is_control = true
            cll.push(
                  td({className:clas + ' tab-color',  style:'--color-tab:'+ color_cl[pl_clinic[row.place]]+';', data: "★" },  pl_clinic[row.place] ),
                  td({className:clas, colspan:"4"}, p("Только получение")),
                  
                  )
                  
               
           }


            tab_n.push(tr(cl))
            if(cll.length != 0) tab_n.push(tr(cll))
        })


    })
    info_table(tab.length, z, o, v)

    block.render(()=>{
        return table({className:"table-nalog"}, tab_n)
    })
}


function wa_send(render:Function, name:string, clinic:string, telefon:string, id:string){
     POST_MY('../php/nalog.php', 'wa-status', JSON.stringify({
               bid:id
           })).onload = function (){

               my_cookie.clinic = clinic
               render();

               function source_el(callback:Function, id:string){
                    let btn = document.getElementById(id);
                    if(!btn){
           
                        setTimeout(()=>{
                           btn = document.getElementById(id);
                            if(btn){
                               callback(btn)
                            }else{
                               source_el(callback, id)
                            }
                        }, 20)
                    }
           }

    

   source_el((bt:any )=>{
    bt.click()
    source_el((inpt:any)=>{
        inpt.value = telefon
        let FIO = inpt.parentElement.parentElement.querySelectorAll('input')
        FIO[1].value = name
        FIO[2].value = id

    },"tel-left-send")

  }, "65fbf7f5edc77_sample")
// }, "65fbf4f335b9a_sample")
           }
}

function gotovnost(evt:any, id:number){
    evt.target.className = 'btn-print-all disabled'
    console.log(id)
     POST_MY('../php/nalog.php', 'set-status-2', JSON.stringify({
               bid:id
           })).onload = function(){
             if(this.status == 200){
                 alert("Статус заявки изменен - Выдано")
             }
               
           }
}

function info_table(l:number, z:number, o:number, v:number){
    const info = new ExhiDOM('inform-table')
    info.render(()=>{
        return div({className:'inform-table inform-table-dop'}, 
        [
            p("Количество строк: " + String(l)),
            p("Незакрытые заявки: " + String(z)),
            p("Ожидают выдачу: " + String(o)),
            p("Выдано: " + String(v))
        ])
    })
}




function copyHover(evt:any){
     if(document.hasFocus() && navigator.clipboard){
        navigator.clipboard.readText().then((text)=>{
             let textCopy = replaceArrayAll(['ИНН: ', 'Дата рожд.:','За период: ', 'Степень родства: ',  'Имя: '], "", evt.target.textContent)
            if(text != textCopy){
                evt.target.setAttribute('data', "Кликни, чтобы скопировать в буфер")
            }
        })
     }
}

function copy(evt:any){
    if(navigator.clipboard){
        let text = replaceArrayAll(['ИНН: ', 'Дата рожд.:','За период: ', 'Степень родства: ', 'Имя: '], "", evt.target.textContent)
        navigator.clipboard.writeText(text)
        evt.target.setAttribute('data', "Скопированно в буфер")
    }else{
          evt.target.setAttribute('data', "Нужно разрешение буфер обмена")
    }
}

export function closeHire(clinic:string, bid:number, ind:number, Array:[Function, string, string, string]){

    const [st, fm, fl, bt] = getElement(Number(bid), ind)
    if(fl.children[0].children[1].tagName != 'P'){
    POST_MY('../php/nalog.php', 'close-hire', JSON.stringify({
            clinic:clinic,
            bid:bid
        })).onload = function(){
            console.log(this.responseText)
            bt.setAttribute('disabled', '')
            bt.textContent = status[2]
            st.textContent = status[2]
            st.className = "gotov"
            fl.children[1].remove() 
            fl.querySelectorAll('button').forEach((el)=>{el.remove()})

            if(Number(this.responseText) > 0){
               
                createBTN(bid, String(ind), Array)
              
            }
        }
        }
    
}


function printAllFile(bid:number){
    let dublePrint = confirm("Двусторонняя печать?")
    
         POST_MY('../php/nalog.php', 'print-all-files', JSON.stringify({
               bid:bid,
               dublePrint:dublePrint
           })).onload = function(){
               console.log(this.responseText)
               if(this.status == 200){
                 const mr = JSON.parse(this.responseText)
                 if(mr.error != ''){
                    alert("Ошибка в файле " + mr.error + " Попробуте обновить версию word и пересохранить файл ")
                 }
                 printFile(window.location.origin + '/' + mr.marge)
                 mr.all.forEach((url:string)=>{
                    printFile(window.location.origin + '/' + url)
                 })
                 

   
               }else{
                alert('Что-то пошло не так Статус сервера ' +  this.status  );
               }
           }
}

function hire_document(evt:any, bid:number, clinic:string, ind:number, ArrayArcument:[Function, string, string, string]){
        const id = my_cookie.id_user
        const name = my_cookie.name_user

        POST_MY('../php/nalog.php', 'set-hire', JSON.stringify({
            adminID:id,
            adminName:name,
            bid:bid,
            clinic:clinic
        })).onload = function(){
            const [st, fm, fl, bt] = getElement(bid, ind)

            fl.querySelectorAll('.files-block').forEach((el:any)=>{
                const btn = document.createElement('button')
                btn.textContent = '×'
                btn.onclick = (evt:any)=>delfile(evt, clinic, bid)
                el.append(btn)
            })

            st.textContent = status[1]
            st.className = 'inhere'
            fm.textContent = family_min(name)
            bt.textContent = "Загрузить файлы"
            bt.onclick = ()=>openFile(ind, clinic, bid, ArrayArcument)
        }
    }


 function returnStatus(clinic:string, bid:string, ind:number, ArrayArcument:[Function, string, string, string]){

    let isConfirm = confirm("Вы хотите сбросить заявку?");
    if(!isConfirm) return;
     
    POST_MY('../php/nalog.php', 'return-status', JSON.stringify({

            adminName:name,
            bid:bid,
            clinic:clinic

        })).onload = function(){

            const [st, fm, fl, bt] = getElement(Number(bid), ind)
            console.log(bid, ind)
            st.textContent = status[0]
            st.className = 'new'
            fm.textContent = 'Не назначено'
            bt.textContent = "Взять в работу"
            bt.removeAttribute('disabled')
            bt.onclick = (evt:any)=>hire_document(evt, Number(bid), clinic, ind, ArrayArcument)

        }
    }

 

export function getElement(bid:number, ind:number ):Array<HTMLElement>{
    const fl:HTMLElement = <HTMLElement>document.querySelector('#fl_'+bid +'_'+ ind)
    const st:HTMLElement = <HTMLElement>document.querySelector('#st_'+bid +'_'+ ind)?.children[0]
    const fm:HTMLElement = <HTMLElement>document.querySelector('#fm_'+bid +'_'+ ind)
    const bt:HTMLElement = <HTMLElement>document.querySelector('#btn_' + bid +'_'+ ind)
    
    return [st, fm, fl, bt]
}

export function zayvlenie(id:number, clinicZ:string){
    console.log(clinicZ)
    POST_MY('../php/nalog.php', 'get-zayavlenie', JSON.stringify({id:id, clBoss:clinicZ})).onload = function(){
        console.log(this.responseText)
        if(this.status == 200){
            window.open('../sample/'+ this.responseText )
        }else{
            console.log(this.responseText)
        }

    }
}

export function createBTN(bid:number, nCl:string, ArrayArgument:[Function, string, string, string]){
    const waIcon = require('../../../../images/whatsApp/Whatsapp_2.png')
    const printIcon = require('../../../../images/whatsApp/print_2.png')
    const widatIcon = require('../../../../images/whatsApp/vidat_2.png')
    const blockBTN = new ExhiDOM("row_btn_"+ bid + '_' + (Number(nCl)))
    console.log("row_btn_"+ bid + '_' + (Number(nCl)))

    blockBTN.render(()=>{
        return div({className:'btn-row', id:"row_btn_"+ bid + '_' + (Number(nCl))}, 
        [
              img({className:'btn-print-all', src:printIcon, onclick:()=>printAllFile(bid)}),
              img({className:"btn-print-all", src:waIcon, onclick:()=>wa_send(...ArrayArgument, String(bid))}),
              img({className:'btn-print-all',src:widatIcon ,  onclick:(evt:any)=>gotovnost(evt,bid)})
        ])
    })

}