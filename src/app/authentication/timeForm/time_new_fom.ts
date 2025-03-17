// import {  } from "../../../library/HTML";
import { formatDate_D_M, format_D_Month, getDay } from "../../../library/Date";
import { ExhiDOM, div, vnode, p, button, tr, span, a} from "../../../library/exhibit/exhibit";
import './time_new_form.scss'
interface Visit{
    [name:string]:{ // IDfILIAL
        [name:string]:Array<string> //DATE:[TIME]
    }
}

export function time_new_forms(post:any, onclickForm?:Function,  className:string = 'control-block-time'){
   let Visit:Visit = post.data
   let nameDoctor = post.name
    // пропишем клиники
    const clinic:{[name:string]:string}= {
        '1': "АЛЬТАМЕД+ НА СОЮЗНОЙ",
        '2': "АЛЬТАМАЕД+ НА КОМСОМОЛЬСКОЙ",
        '3': "АЛЬТАМЕД+ НЕДЕЛИНА",
        '4': "АЛЬТАМЕД+ ДУБКИ"
    }
    let deactive_span = ''

 const control_block = new ExhiDOM(className)
 let clinicTime:Array<vnode> = [];
 Object.keys(Visit).forEach((filialId:string)=>{
     let DateBloks:Array<vnode> = []
     let ArrTimeStart:Array<vnode> = []
     let n = 0;
     if(Object.keys(Visit[filialId]).length < 5) deactive_span = 'deactive-span'

    Object.keys(Visit[filialId]).forEach((date:string)=>{
        
        
    if(n == 0){
        DateBloks.push(button({className:'btn-date active-btn', onclick:(evt:any)=>new_time(evt, filialId, Visit[filialId][date], date)}, String( getDay(date, true)) + ' ' + formatDate_D_M(date, true)))
        Visit[filialId][date].forEach((interval:string)=>{
            ArrTimeStart.push(a({className:'time-btn', href:'/ajax/form.php?WEB_FORM_ID=3&target=doctor&docname='+'&doc_clinic='+clinic[filialId]+'&doc_time=' + format_D_Month(date) + ' в '+ interval, onclick:onclickForm}, interval))
        })
    }else{
        DateBloks.push(button({className:'btn-date', onclick:(evt:any)=>new_time(evt, filialId, Visit[filialId][date], date)}, String( getDay(date, true)) + ' ' + formatDate_D_M(date, true)))
    }
    n++
    })


 function new_time(evt:any, filialId:string, VisitTime:Array<string>, date:string){
    let elem = evt.target.parentElement.querySelector('.active-btn')
    // console.log(elem)
    elem.classList.toggle('active-btn')
    evt.target.classList.toggle('active-btn')
    re_time(VisitTime, filialId, date)
 }


    function scrollNext(evt:any){
        let btn_boks:HTMLDivElement
        let span:HTMLSpanElement
        if(evt.target.tagName == 'SPAN'){
            btn_boks = evt.target.parentElement.parentElement.querySelector('.btn-boks')
            span = evt.target
        }else{
            span = evt.target.children[0]
            btn_boks = evt.target.parentElement.querySelector('.btn-boks')
        }
        // console.log(btn_boks)
        // console.log(span)
        btn_boks.scrollBy(btn_boks.clientWidth, 0)

        if(btn_boks.scrollLeft + 2*btn_boks.clientWidth >= btn_boks.scrollWidth ){
            if(span?.className != 'deactive-span') span.classList.toggle('deactive-span')
            }
            let span_brak = btn_boks.parentElement?.querySelector('.back')?.children[0]
            if(span_brak?.className == 'deactive-span') span_brak?.classList.toggle('deactive-span')
    }

    function scrollBack(evt:any){
        let btn_boks:HTMLDivElement
        let span:HTMLSpanElement
        if(evt.target.tagName == 'SPAN'){
            btn_boks = evt.target.parentElement.parentElement.querySelector('.btn-boks')
            span = evt.target
        }else{
            span = evt.target.children[0]
            btn_boks = evt.target.parentElement.querySelector('.btn-boks')
        }

        
        btn_boks.scrollBy(-btn_boks.clientWidth, 0)
        console.log(btn_boks.scrollLeft)
        if(btn_boks.scrollLeft <= btn_boks.clientWidth){
            if(span?.className != 'deactive-span') span.classList.toggle('deactive-span')
            }
            let span_brak = btn_boks.parentElement?.querySelector('.next')?.children[0]
            if(span_brak?.className == 'deactive-span') span_brak?.classList.toggle('deactive-span')
    }

    clinicTime.push(
        div( {className:"block-clinic-time"},
        [
             p({className:'spin_'+ filialId}, clinic[filialId]),
             div({className:'header'},[ 
                deactive_span == ''? button({className:'back', onclick:scrollBack}, [span({className:'deactive-span'})]):
                button({className:'back ',}, [span({className:'deactive-span'})])
                , div({className:'btn-boks'}, DateBloks), 
                deactive_span == ''? button({className:'next ', onclick:scrollNext }, [span()]):
                button({className:'next' }, [span({className:'deactive-span'})])

            ]),
             div({className:'time-bloks', id:'filial_'+ filialId}, ArrTimeStart)
        ]))
 })

function re_time(TimeArr:Array<string>, filialId:string, date:string){
   
    const time  =  new ExhiDOM('filial_'+ filialId)
    
    let vnodeTime:Array<vnode>= []
    TimeArr.forEach((interval:string)=>{
        vnodeTime.push(a({className:'time-btn', href:'/ajax/form.php?WEB_FORM_ID=3&target=doctor&docname='+'&doc_clinic='+clinic[filialId]+'&doc_time=' + format_D_Month(date) + ' в '+ interval, onclick:onclickForm}, interval))
    })

    time.render = () =>{
        return div({className:'time-bloks', id:'filial_'+ filialId}, vnodeTime)
    }
}



 control_block.render = ()=>{
    return div({className:'control-block-time ' + className}, clinicTime)
 }

}