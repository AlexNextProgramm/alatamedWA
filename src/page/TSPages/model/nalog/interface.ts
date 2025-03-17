export interface nalogSQL{
    nameNalog: string
    id:number
    email:string
    clinic:string
    name:string
    date:string
    telefon:string
    "link-files":string
    admin:string
    status:number
    place:string
    "data-done":string
    "date-birth":string
    "date-season":string
    INN:string
    RELATION_DEGREE:string
    send_wa:number
}

export const pl_clinic:any = {
    '117':'Альтамед+ на Союзной',
    '118':'Альтамед+ на Комсомольской',
    '119':'Альтамед+ на Неделина',
    '120':'Альтамед+ Дубки'
}
export const pl_clinic_engl:any = {
    '117':'Altamed',
    '118':'Odinmed',
    '119':'Odinmedplus',
    '120':'Dubki'
}

export const color_cl:any = {
    'Альтамед+ на Союзной':'#68BCFF',
    'Альтамед+ на Комсомольской':'#F000A4',
    'Альтамед+ на Неделина':'#FF7145',
    'Альтамед+ Дубки':'#008F45',
    'Альтамед+ Верхне-Пролетарская':'#A64DFF'
}

export const RELATION_DEGREE:any = {
     "139":"Пациент - является налогоплательщиком",
     "140":"Пациент - дочь",
     "141":"Пациент - супруг",
     "142":"Пациент - супруга",
     "143":"Пациент - отец",
     "144":"Пациент - мать",
     "174":"Пациент - сын",
}
