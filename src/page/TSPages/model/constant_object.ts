interface CLINIC {
  [name:string]:string
}
interface ROLE {
    [name:string]:string
  }

export const CLINIC:CLINIC = {
    Altamed:"Альтамед+",
    Odinmed:"Одинмед",
    Odinmedplus:"Одинмед+",
    Dubki:"Дубки-Альтамед",
    Proletarka:"Верхне-пролетарская",
    AltamedBeauty:"Альтамед-Бьюти",
    
}
export const ROLE:ROLE = {
      senior_admin:"Старший Администратор",
      admin:"Администратор",
      doctor:'Доктор',
      marketing:"Маркетинг"
}
export const STATUS:ROLE = {
  '0':"Отправлено",
  '1':"Доставлено",
  '2':"Прочитано",
  '3':"Не Доставлено"
}