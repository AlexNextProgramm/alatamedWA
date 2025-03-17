
export function formatDate(date:string|Date , DMY = false) {
  if(typeof date == 'string'){
    let arDate = date.split('.')
    if(arDate[1]){
      if(Number(arDate[0]) < 10) arDate[0] = '0' + Number(arDate[0])
      return arDate.reverse().join('-')
    }
  }
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2){  month = "0" + month;}
    if (day.length < 2) {  day = "0" + day;}
    if(DMY){
        return [day, month, year].join(".");
    }else{
        return [year, month, day].join("-");
    }
  }
  export function formatDate_D_M(date:string|Date , DMY = false) {
    if(typeof date == 'string'){
      if(date.split('.')[1]){
        return date.split('.').reverse().join('-')
      }
    }
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2){  month = "0" + month;}
      if (day.length < 2) {  day = "0" + day;}
      if(DMY){
          return [day, month].join(".");
      }else{
          return [year, month, day].join("-");
      }
    }

export function booleanDateTime(Array:Array<string>,interval:string,date:string){
  let ArrayTimeResult:Array<string> = []
  let Nuldat = new Date(0)
  Nuldat.setMinutes(15)
  for(let i = 0; i < Array.length; i++){
    let Dat = new Date(date + 'T' + Array[i])
    let final = new Date(date + 'T' + Array[i])
    final.setHours(final.getHours() + Number(interval.split(':')[0]))
    final.setMinutes(final.getMinutes() + Number(interval.split(':')[1]))
    let alfa:number =  (Date.parse(final.toString()) - Date.parse(Dat.toString())) / Date.parse(Nuldat.toString())
 
      for (let un = 1; un <= alfa; un++){
        Dat.setMinutes(Dat.getMinutes() + 15)
       if(Date.parse(Dat.toString()) === Date.parse(new Date(date + 'T' + Array[i + un]).toString())){
          if(Date.parse(final.toString()) === Date.parse(new Date(date + 'T' + Array[i + un]).toString())){
           ArrayTimeResult.push( getTimeformat(new Date(date + 'T' + Array[i])))
          }
       }else{break}
      

      }
  }
  
    return ArrayTimeResult
}
// возвращает формат время 12:00
export function getTimeformat(date:Date){
  let Hours:string
  let Minutes:string
    if (date.getHours()< 10){
      Hours = '0'+ date.getHours()
    }else{Hours = `${date.getHours()}`}
    if (date.getMinutes()< 10){
      Minutes = '0'+ date.getMinutes()
    }else{Minutes = `${date.getMinutes()}`}
    return Hours + ':' + Minutes
}
// Принимет Дату Возвращает время
export function getTimeSecformat(date:Date){
  let Hours:string
  let Minutes:string
  let second:string

      if (date.getHours()< 10){
        Hours = '0'+ date.getHours()
      }else{
        Hours = `${date.getHours()}`
      }

    if (date.getMinutes()< 10){
      Minutes = '0'+ date.getMinutes()
    }else{
      Minutes = `${date.getMinutes()}`
    }
    if (date.getSeconds()< 10){
      second = '0'+ date.getSeconds()
    }else{
      second = `${date.getSeconds()}`
    }
    return Hours + ':' + Minutes + ':'+ second
}

// Выбрать из массива дат даты только от настоящего времени 
 export function date_from_now(allArryDate:Array<string>, week?:number):string[]{
  let NowFromDate: Array<string> = [];
  if(week){
    for (let i = 0; i < allArryDate.length; i++) {
      if(week == getWeek(new Date(allArryDate[i]))){
          NowFromDate.push(allArryDate[i])
      }
    }
  
  }else{
    for (let i = 0; i < allArryDate.length; i++) {
      if (
        Date.parse(new Date(allArryDate[i]).toString()) >=
        Date.parse(new Date(formatDate(new Date()) + "T00:00:00").toString())
      ){
        NowFromDate.push(allArryDate[i]);
      }
    }
  }
  NowFromDate = sortArrayDateString(NowFromDate)
  return NowFromDate
 }
//  возвращает формат времени в зависимости от установленных опций
 export function formatTime(time:number, shortcut:boolean = false):string{

  let d = new Date(time)
  let h = `${d.getUTCHours()}`
  let m =  `${d.getUTCMinutes()}`
  let s = `${d.getUTCSeconds}`
  if(d.getUTCHours() < 10) h = '0'+ d.getUTCHours()
  if(d.getUTCMinutes() < 10) m = '0'+ d.getUTCMinutes()
  if(d.getUTCSeconds() < 10) s = '0'+ d.getUTCSeconds()
  if(shortcut) return [h, m].join(':')
  return [h, m, s].join(':')
 }

 export function getWeek(date:Date):number{
    let year = date.getFullYear();
    let NullTochka = new Date(year + '-01-01T00:00:00').getTime();
    date.setHours(0)
    let today = date.getTime()
    return Math.ceil((today - NullTochka) / (1000 * 60 * 60 * 24 * 7));
 }
//  Сортирует массив дат по дням недели
 export function sortArrayDateString(Array:Array<string>):string[]{
  let newArray:Array<string> | Array<number> | any= []
  for (let i = 0; i < Array.length; i++) {
    newArray.push( new Date(Array[i]).getTime())
    
  }
  newArray.sort((a:number, b:number)=>{
    return a - b
 })
 Array = []
  for (let i = 0; i < newArray.length; i++) {
    let date = new Date(newArray[i])
    Array.push(formatDate(date))
  }
  return Array
 }
// Возвращает день недели 
 export function getDay(date:string|Date, StrDay:boolean = false):number|string{
    let Dat:Date
  if(typeof date == 'string'){
      Dat = new Date(date)
    }else{ 
      Dat = date
    }
    if(Dat.getDay()== 0){
          let day = StrDay? "Вс": 7
          return day;
      }else{
        const Arr = ["Вс",  "Пн", "Вт", "Ср","Чт", "Пт", "Сб"]
        let day = StrDay? Arr[Dat.getDay()]: Dat.getDay()
        return day
      }
 }
 export function getNameDay(number:number, option:boolean = true):string{
  if(option){
    const ArrayName = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота','Воскресенье']
    return ArrayName[number-1]
  }else{
    const ArrayName = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб','Вс']
    return ArrayName[number-1]
  }
 }
//  Функция принимает мс возврящает формат 1ч 30мин
 export function getformatInterval(num:number):string{
  let Hours = String(num / (1000 * 60* 60)).split('.')[0]
  let Minutes = String(Math.round(num / (1000 * 60) - (Number(Hours)*60)));
  if(Number(Minutes) < 10) Minutes = '0'+ Minutes
  if(Number(Hours) >= 1){
    if(Number(Hours) >= 24){
      let day = String(Number(Hours)/24).split('.')[0]
      Hours = String(Number(Hours) - Number(day)*24)
      return day +' д. '+ Hours +' ч. '+ Minutes + ' мин.'
    }
    return Hours +' ч. '+ Minutes + ' мин.'
  }
    return  Minutes + ' мин.'
 }
 export function getTimeZeroHour(date?:Date|string):number{
  if(date){
    if(typeof date == 'string'){ 
      return new Date(date+'T00:00:00').getTime()
    }else{
      date.setHours(0)
      return date.getTime()
    }
  }
  // let dat = new Date(0)
  return new Date(0).getTime()
 }

export function milliseconds(str?:string):number{
  let Hours = Number(str?.split(':')[0])
  let Minutes = Number(str?.split(':')[1])
  let Second = Number(str?.split(':')[2])
  let res = (Hours*60*60*1000) + (Minutes*60*1000) + (Second*1000)
  return res
}
// Принимает мс 900000  возвращает формат 01:00
 export function format_miliseconds(ms:number){
  let Hours = String(ms / (1000 * 60* 60)).split('.')[0]
  let Minutes = String(Math.round(ms / (1000 * 60) - (Number(Hours)*60)));
  if(Number(Minutes) < 10) Minutes = '0'+ Minutes
  if(Number(Hours) >= 1){
    if(Number(Hours) < 10){
      Hours = '0' + Hours
    }
    return Hours +':'+ Minutes
  }
    return '00:'+ Minutes
 }
//  принимает string 2023-12-12
 export function format_D_Month(date:string){
  let d = date.split('-')[2]
  let M = Number(date.split('-')[1])
  let month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября','Октября', 'Ноября', 'Декабря'];
   return d+ ' ' + month[ M - 1 ]

 }
 