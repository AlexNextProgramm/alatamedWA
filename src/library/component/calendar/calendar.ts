import './calendar.scss'
// import { DOM, atribute, el, vnode } from "../../HTML";
import { atribute, div, p, table, td, th, tr, vnode } from "../../exhibit/exhibit";
// скелет сборки календаря '
interface weekend {
    Mon?:atribute
    Tue?:atribute
    Wed?:atribute
    Thu?:atribute
    Fri?:atribute
    Sat?:atribute
    Sun?:atribute

}
interface option{
    // month:number
    // year:number
    date:Date
    button_next:vnode
    button_end:vnode
    week?:atribute // для описания атрибутов дней недели в основном для стилизации
    table?:atribute
    activ_date?:Array<string|null>
    day?: (date:Date, td:Function) => vnode
    weekend?:weekend|any
    header?:atribute

}
 export class calendar{
    week:vnode = tr()
    vnode:vnode
    table:vnode = table()
    MonthString: Array<string> = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    weekend:Array<string> = ['Mon','Tue','Wed','Thu','Fri','Sat', 'Sun']
    option:option
    date:Date
   
    constructor( option:option){
        this.option = option
        this.date = option.date
        // this.month = option?.month || new Date().getMonth()
        // this.year = option?.year || new Date().getFullYear()
        this.vnode = this.create(this.option)
    }
   create(option:option):vnode{
        if(option && option?.week) this.week.props = option.week // добавляем атрибуты 
        const week:Array<string> = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
       //  определяем детей=======|||
        this.week.children = [] 
        // this.table.props = option?.table || {}
        this.table.children = []
        //===========================
        let date:Date = first_day_month(this.date.getFullYear(), this.date.getMonth())
         
        for (let i = 0; i < 7; i++) {
            if(option?.weekend && option.weekend.hasOwnProperty(this.weekend[i])){
                option.weekend[this.weekend[i]].textContent = `${week[i]}`
                this.week.children.push(th(  option.weekend[this.weekend[i]] ))
            }else{
                this.week.children.push(th( { textContent: `${week[i]}` }));
            }
           }
        this.table.children.push(this.week)
        for (let i = 0; i < 6; i++) {
            let array:Array<vnode> = []
            for (let i = 0; i < 7; i++) {
            date.setDate(date.getDate() + 1);
            // нужные условия отображения дат 
                if( option?.day){
                    array.push(option.day(date, td))
                }else{
                     array.push(td(`${date.getDate()}`))
                }
            }
            this.table.children.push(tr(array))
        }
       let caledar:vnode =  this.header(option)
       if(caledar.children)caledar.children.push(this.table)
        return caledar
    }
    // заголовок кнопки и текст месяца
    header(option:option):vnode{
        let block = div(option?.table || {},[
            div( option?.header || {}, 
                    [
                        option.button_end,
                        p({textContent:`${this.MonthString[this.date.getMonth()]}`+` ${this.date.getFullYear()}`}),
                        option.button_next 
                    ])
             ])
        return block
    }
    // независимая функция обновления
    update(caledar:calendar, dates:Date){
          caledar.date = dates
          caledar.vnode = caledar.create(caledar.option)
    }
}

//  Возвращает дату первого понеделника в календаре 
function first_day_month(Year: number, Month: number):Date {
    let date:Date = new Date(Year, Month , 0); 
    let day: number = date.getDay();
    if (day == 0) { day = 6;
    } else { day--;}
    date.setDate(date.getDate() - day - 1);
    return date;
  }