import { formatDate, getDay } from "../../library/Date";
import { ExhiDOM, button, div, h2, p, span, tr, vnode } from "../../library/exhibit/exhibit";
import './timeform.scss'

// DateVisit принимает значения массива  в формате [2023-12-01, 2023-12-02]
/* TimeVisit  принимает значения  {"2023-12-01":[
    "18:30",
    "20:30",
     и т.д.
 ]}*/
export function timeform(filialId:number, DateVisit?:Array<string>|undefined, TimeVisit?:{[name:string]:Array<string>}){
const filial:{[name:string]:{
    name:string
    className:string
}} = {
    "1":{
        name:"АЛЬТАМЕД+ НА СОЮЗНОЙ",
        className:"block-S",
    },
    "2":{
        name:"АЛЬТАМАЕД+ НА КОМСОМОЛЬСКОЙ",
        className:"block-K",
    },
    "3":{
        name:"АЛЬТАМЕД+ НЕДЕЛИНА",
        className:"block-N",
    },
    "4":{
        name:"АЛЬТАМЕД+ ДУБКИ",
        className:"block-D",
    },
    
 }


 const timeform_block = new ExhiDOM(filial[String(filialId)].className)
 
//  console.log(timeform_block);
    const datestart = new Date(formatDate(new Date())+'T00:00:00')
    // console.log(TimeVisit)
    let DateHtml:Array<vnode> = [];
    let Intervals:Array<vnode>|undefined = [];
    let controlActive = true
    for(let i = 0; i < 15; i++){
        i !=0 ? datestart.setDate(datestart.getDate() + 1): datestart.setDate(datestart.getDate())
       DateHtml.push( // собираем массив дат
    div({className:'date ', onclick:(evt:any)=>clickDate(evt, filial[String(filialId)].className)},
        [
            p(`${getDay(datestart, true)}`),
            p(datestart.getDate() < 10?'0'+ `${datestart.getDate()}`: `${datestart.getDate()}`)
        ]))

        if(DateVisit && DateVisit.length != 0){
            DateVisit.forEach((valueVisitDate)=>{
                if(valueVisitDate == formatDate(datestart) && TimeVisit?.[valueVisitDate]){
                    let props = DateHtml[DateHtml.length -1].props
                    props?.onclick? props.onclick = (evt:any)=>clickDate(evt, filial[String(filialId)].className, valueVisitDate):(evt:any)=>clickDate(evt, filial[String(filialId)].className)
                    if(controlActive){
                        controlActive = false
                        Intervals = reTime(valueVisitDate,filial[String(filialId)].className, true)
                        props?.className? props.className = 'date open activ ': 'date'
                    }else{
                        props?.className? props.className = 'date open': 'date'
                    }
                    
                }

            })
        }
    }
    function clickDate(evt:any, className:string, DateVisit?:string){
        let elm = evt.target
        // console.log(evt)
        if(elm.tagName == "P") elm = evt.target.parentElement
        if(elm.className == "date open"){
            let Html = elm.parentElement.querySelector('.activ')
             Html?.classList.toggle('activ')
            elm.classList.toggle('activ')
        }
       
        if(DateVisit){
            reTime(DateVisit, className)
        }
    }

    function reTime(DateVisit:string, className:string, isArr:boolean = false){
     
        let Intervals:Array<vnode> = []
        TimeVisit?.[DateVisit]?.forEach((times:string)=>{
            Intervals.push(button({className:'btn-time-interval'},times))
        })
        if(isArr) return Intervals
        className = 'time-doctor-visit-' + className
       
        const Time_Doctor = new ExhiDOM(className)
        Time_Doctor.render = ()=>{
          return div({className:className}, Intervals)
        }
      }

    function scroll_header(evt:Event){
        let control_elm:any = document.querySelector('.'+ filial[String(filialId)].className)
        let header:HTMLDivElement|null = control_elm.querySelector('.header-day-date')
        let elem:any = evt.target 
        if(elem.tagName == 'DIV') elem = elem.parentElement
        if(elem.tagName == 'SPAN') elem = control_elm.querySelector('.btn-date-next')
        if(elem?.className == 'btn-date-next'){
            header?.scroll(310, 0)
        }
        if(elem?.className == 'btn-date-next btn-date-end'){
            header?.scroll(0, 0)
        }
        elem.classList.toggle('btn-date-end')
    }
    
    timeform_block.render = ()=>{
        return div({className:filial[String(filialId)].className},
        [
        div({className:"time-form"},
        [
            p({className:'filial'},filial[String(filialId)].name),
            div({className:'header-day-date'},[ 
                ...DateHtml,
            ]),
            button({className:'btn-date-next', onclick:scroll_header},[
                div({className:"arrow-7"},
            [
                span(),
            ]
            )]),
            div({className:'time-doctor-visit-'+filial[String(filialId)].className}, Intervals)
        ])
        ])
    }
}