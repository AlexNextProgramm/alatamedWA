export interface row_base{
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
    status:number|undefined
    filial:string
}

export interface SendBase{
    st:string
    en:string
    telefon?:string
    sender?:string
    clinic?:string
    NameSample?:string
} 