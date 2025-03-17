import { POST_MY } from "../../../library/GetPost";
import { ExhiDOM, div, h1, input, label, p, span, vnode } from "../../../library/exhibit/exhibit";
import '../../../CSS/messag_panel.scss'
import { formatDate } from "../../../library/Date";
import { IsJsonString } from "../../../library/json";
import { row_base } from "./base/interface";
import { format_tel } from "../../../library/upgrade_form";
import { my_cookie } from "../../../library/cookie";
require('../../../images/wa-bg6.jpg')

var basesChenge:Array<row_base> = []
let VarSetTimebasesChenge:any
let VarSetTimeCollect:any
 


export function massage_panel(animation:boolean = false){
    const message_block = new ExhiDOM('message-panel')
    const stDate = new Date();
   
    message_block.InQueue = [ ()=>{
       if(my_cookie.status_refresh && my_cookie.status_refresh == 1){
        check()
       }
    } ]
    function clue(){
        const bl = <HTMLDivElement>document.querySelector('.samp-clue')
        if(bl.className.includes('deactive')) bl.classList.toggle('deactive')
        bl.children[1].innerHTML = `x - такой номер телефона не существует в WhatsApp или сообщение не соответсвует шаблону.<br><br>
     Одна серая галочка - сообщение отправлено.<br><br>
     Две серые галочки - сообшение доставлено но не прочитано.<br><br>
     Две цветные галочки - сообщение прочитано.<br><br>
     "Обновлять статусы автоматичеси" - статусы сообщений будут автоматически обновляться каждую минуту.<br>
     Также статусы можно обновить и в ручную если навести на номер и кликнуть по номеру
    `
    }
  

   

    message_block.render(()=>{
        return div({className:'message-panel'}, 
        [
            div({className:'sort-date'},
            [
                h1('Статус'),
                p({className:'FAQ', onclick:clue},'?')
            ]),
            div({className:'sort-date'},
            [
                p({className:'avtom'},'Обновлять автоматически'),
               div({className:'switch', title:'Включить или выключить автоматическое обновление статусов'}, 
               [
                input({type:'checkbox', id:'switch-input', onchange:()=>check(), checked: my_cookie.status_refresh && my_cookie.status_refresh ==1? true:false}),
                label({for:'switch-input'})
               ])
            ]),
            div({className:'sort-date', title:'Дата отправленных сообщений'},
            [
               
                input({type:'date', value:formatDate(stDate), onchange:()=>collect(), id:'re-date'}),
            ]),
            div({className:'array-telefon'})
        ] )
    })
   
    collect(false, animation)
}



// строим список телефонов
// otpr - отправлено
// '' -доставлено
// prot - прочитано
// nowhatsaap -нет в ватсап

export function collect(refreshBol:boolean = false, animation:boolean = false){

    const InputDate = <HTMLInputElement> document.querySelector('#re-date')
    const TelefonBlock = new ExhiDOM('array-telefon')
    let base:Array<any> = []
   
    const status:any = {
        '3':'otpr',
        '4':'dos',
        '6':'prot',
        '5':'nowhatsaap',
        '400':'nowhatsaap'
    }
   

    POST_MY('../php/router.php', 'get-base-for-status', 
       JSON.stringify({
               start:formatDate(InputDate.value,true),
               end:formatDate(InputDate.value,true)
           }) ).onload = function(){
            
           if(this.status == 200 && IsJsonString( this.responseText)){
            base = JSON.parse(this.responseText)
            basesChenge = base
           
            const ArrayBlockTelefone:Array<vnode> = []

            for(let i = base.length - 1 ; i > -1; i-- ){

                let anim = ''
                base.length - 1 == i && animation && formatDate(InputDate.value,true) == formatDate(new Date(), true)? anim = 'shift_anim':anim =''; // Анимация при добавлении  нового телефона
                let st:number = 0
                if(base[i].status) st = <number>base[i].status 

                const stT = base[i].date.split(' ')[1]
                const stD = base[i].date.split(' ')[0]

                //! Делаем запрос на первичный статуc по последнему номеру  если обновление не установлено
                if(animation && base.length - 1 == i){
                    anim = ' shift_anim'
                    if(my_cookie.status_refresh == 0) {
                        setTimeout(()=>refrech_status(base[i].telefone, stD, stT, base[i].id,  ()=>collect(false, false)), 10000)
                    }
                }
               

                //!Делаем запросы по интервалу если рефреш включен и статусы раны 1 и 0
                if(refreshBol  && base[i].status <= 3){
                    refrech_status(base[i].telefone, stD, stT, base[i].id)
                }

                // !Собираем объект для рендеринга
                ArrayBlockTelefone.push(
                 //  !Объет HTML номера
              div({className:'row-phone'+ anim +' '+ status[st] , id:'tel_'+base[i].id, title:base[i].status <=  3?"Нажмите на сообщение чтобы обновить статус":"", onclick:()=>{examinatin_automatic(base[i])}},
                    [
                        p({className:'tel'}, format_tel(base[i].telefone) ),
                        p({className:'p',data:base[i].NameSample}, base[i].NameSample),
                            p({className:'status-mes'},
                            [
                                
                                p({className:'time'}, stT.split(':')[0] + ':' + stT.split(':')[1]),
                                span(),
                                span({className:'two'})
                            ]),
                    ]))
                }
                if(ArrayBlockTelefone.length == 0){
                    ArrayBlockTelefone.push(p({className:'pusto-info'},"За "+ formatDate(InputDate.value,true)+ ' нет сообщений'))
                    ArrayBlockTelefone.push(p({className:'pusto-info-comment'},'Тут увидете статусы сообщений после отправки'))
                    ArrayBlockTelefone.push(p({className:'pusto-info-comment'},'Чтобы посмотреть сообщения за другие дни измените дату'))
                }


                
                    TelefonBlock.render(()=>{
                        return  div({className:'array-telefon'}, ArrayBlockTelefone)
                    })

           }else{
               console.error(this.responseText)
           }
   }
}

function examinatin_automatic(base:any){
    const stT = base.date.split(' ')[1]
    const stD = base.date.split(' ')[0]
    if(my_cookie.status_refresh == 0) {
        if(base.status <= 3) refrech_status(base.telefone, stD, stT, base.id,  ()=>collect(false, false))
      }else{
          const bl = <HTMLDivElement>document.querySelector('.samp-clue')
          if(bl.className.includes('deactive')) bl.classList.toggle('deactive')
          bl.children[1].innerHTML = "Отключите автоматическое обновление статусов чтобы вы могли обновить в ручную"
      }
}


function refrech_status(telefon:string, fromDate:string, fromTime:string, id_base:string, collect:Function|null = null ){

    POST_MY('../php/router.php', 'get-status', 
       JSON.stringify({
              telefon:telefon,
              fromDate:formatDate(fromDate),
              fromTime:fromTime,
              id_base: id_base,
           }) ).onload = function(){

            console.log(this.responseText)
           console.log('Status:'+ this.responseText)

            if(this.status == 200){

                switch(this.responseText){

                    case '2':collect?  collect(false, false):'';break;
                    case '3':collect?  collect(false, false):'';break;
                    case '4':collect?  collect(false, false):'';break;
                    case '5':collect?  collect(false, false):'';break;
                    case '6':collect?  collect(false, false):'';break;
                    case '400':collect?  collect(false, false):'';break;

                    default: console.error(this.responseText)
                }



            }else{
                console.error(this.responseText)
            }
           }

}



function check(){

    const el = <HTMLDivElement>document.querySelector('.switch')
    const Input = <HTMLInputElement>document.querySelector('#switch-input')
    
    if(Input.checked){

        my_cookie.status_refresh = 1
        el.className = 'switch check-switch'
        VarSetTimebasesChenge = setInterval(()=>collect(true, false), 60000)
        VarSetTimeCollect = setInterval(()=> collect(false, false), 61000)

    }else{

     my_cookie.status_refresh = 0
     el.className = 'switch';
     clearInterval(VarSetTimebasesChenge)
     clearInterval(VarSetTimeCollect)

    }
}