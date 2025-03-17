import { img, td, th, tr, vnode, p, div, ExhiDOM, table } from "../../../../library/exhibit/exhibit"
import { CLINIC, ROLE, STATUS } from "../constant_object"
import { row_base } from "./interface"
const ERRORSEND:any = {
    '0':'Без ошибок',
    '1':'Ошибки при отправке'
}

export function construct(BASE:Array<row_base>){

    const block = new ExhiDOM('table-base')

    const sortImg = require('../../../../images/whatsApp/sort.png')
    const sortReturnImg = require('../../../../images/whatsApp/sort-return.png')
    const table_base:Array<vnode> = []

    table_base.push(

        tr([
                th([ p('Дата'),
                //  img({className:'sort', src:sortImg,})
                ]),
                th('Время'),
                th('Имя получателя'),
                th('Номер'),
                th('Имя кнопки'),
                th('Имя отправителя и роль'),
                th('Клиника'),
                th([ p('Ошибки'), 
                // img({className:'sort', src:sortImg, })
            ]),
                th('Ответ сервера'),
                th('Статус')
            ])

    )
        let AltameRow = 0
        let DubRow = 0 
        let ProleRow = 0 
        let OdinRow = 0
        let OdinNedRow = 0 
        let BeautyRow = 0
        let NeoprFili = 0

        
    for(let i =  BASE.length - 1; i > -1 ; i--){ //**цикл по таблице */
        const filial = CLINIC[BASE[i]['filial']]? CLINIC[BASE[i]['filial']]:'Не определено'
         switch(BASE[i]['filial']){
                case "Altamed":AltameRow++; break;
                case "Odinmedplus":OdinNedRow++; break;
                case "Dubki":DubRow++; break;
                case "AltamedBeauty":BeautyRow++; break;
                case "AltamedBeauty":BeautyRow++; break;
                case "Odinmed":OdinRow++; break;
                case "Proletarka":ProleRow++; break;
                case '':NeoprFili++; break;
                case null:NeoprFili++; break;
                case undefined:NeoprFili++; break;
                default: NeoprFili++; break;
             }


        table_base.push(
            tr({className:BASE[i]['Error'] == '1'?'red':''},[
                td(BASE[i]['date'].split(' ')[0]),
                td(BASE[i]['date'].split(' ')[1]),
                td(BASE[i]['sender_name']),
                td(BASE[i]['telefone']),
                td([p(BASE[i]['NameSample'].slice(0, 50)), p({className:'message'}, BASE[i]['message'])]),
                td([
                    p(BASE[i]['name_user']),
                    p({className:'role-text'},ROLE[BASE[i]['role_user']]),
                ]),
                td(filial),
                td(ERRORSEND[BASE[i]['Error']]),
                td({className:'td-responce'},BASE[i]['requestId']),
                td(STATUS[String(BASE[i]['status'])])
            ])
        )
    }


    block.render(()=>{
        return  table({className:'table-base'},[
            ...table_base
        ])
    })

    return [table_base.length -1, AltameRow,OdinRow,OdinNedRow, DubRow,BeautyRow, ProleRow, NeoprFili ]
}