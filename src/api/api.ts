// import { error } from "console"
import { ExhiDOM, a, body, div, ex, h1, p, th } from "../library/exhibit/exhibit"


// import { webclient } from "../app/client/webclient"




// Линк id как работет пипшите название сопастовление слова в ссылке если оно сходится то послее какой-то индитификатор который находит в базе 
// нужного клиента товар или агента и т.д.
// по индитификатору пишем какую функцию запустить
//  а сам индитификатор помещаеться в вункцию 
// ПРИМЕР 
// ссылка на которую переходим равна www.exe.com/id23234
// id является словом которое индитифицируется а значечение после него попадает в функцию 23234

interface linkId{
    link:Array<string>
}
interface page{
    [name: string]:Function
}
const domen:Array<string> = [
    "http://localhost:3000",
    "http://lachinfl.beget.tech",
    "https://service-live.ru",
  ]
// ====== Роутинг страниц =========
const page:page = {
    // "/index.php": ,
  }
const linkId = {
    link: ["/master", "/webcabinet", "/confirmation", "/restore", "/webclient", "/confirmclient"],
  }
 export function Route(){
 document.addEventListener('click', (e:any) =>{ // На ссылки добавляем слушатель событий
            if(e.target.tagName == 'A'){
            window.scrollTo(0, 0)
             transition(e.target.href)
             e.preventDefault()
            }
            if(e.target.id == 'exit'){
                // exit_web()
            }
            // e.preventDefault()
    })
    window.onpopstate = handleLocation
    handleLocation()
}

const handleLocation = async () =>{
    let StrPage = StrURLPage()
    let href = ''
    for(let i = 0; i < domen.length; i++){
        if(window.location.origin + '/Public'+ StrPage == window.location.href || 
            window.location.origin + StrPage == window.location.href){
                href = StrPage
        }
    }
    if(page[href]){ // Если сущетвует такая ссылка тогда открываем ее
        page[href]()
    }else{ 
      if(linkId){
        let id:string
        let control = true
        linkId.link.forEach((str:string) => {
            if(StrPage.includes(str)){
                // console.log(str)
                 id = StrPage.slice(str.length, StrPage.length)
                 href = str
                if(page[href]){
                // console.log(id)
                page[href](id)
                control  = false
            }
        }
        });
        if(control) Error404()
      }else{
          Error404()
      }
    }
}
export function transition(path:string){
            window.history.pushState({},'', path)
                 handleLocation()
    }
// определяем страницу
export function StrURLPage(){
    let n = window.location.href.lastIndexOf('/', window.location.href.length )
    let StrPage = window.location.href.substring(n, window.location.href.length )
   
    return StrPage
}
// // 404 Ошибка не возможно найти страницу
export function Error404(massange?:string){ // приписываем страницу 404 при неправильной записи или ссылке 
    let exi = new ExhiDOM('body')
    let info = ''
    if(massange) info = massange
    exi.render = ()=>{
        return(
            body([
                div({className:'error'},
                [
                    h1('Ошибка 404'),
                    p('Такой старицы не существует'),
                    div({className:'error-massange'},[
                        div({ innerHTML:info })
                    ]),
                    a({href:'./'},"Вернуться на главную")
                ])
            ])
        )
    }
}
// // 400 Ошибка регистрации не получилось провести регитрацию вбазу данных
// export function Error400(massange?:string){ // приписываем страницу 404 при неправильной записи или ссылке 
//     let exi = new ExhiDOM('body')
//     let info = ''
//     if(massange) info = massange
//     exi.render = ()=>{
//         return(
//             body([
//                 div({className:'error'},
//                 [
//                     h1('Ошибка 400'),
//                     p('Нет возможности провести в базу данных'),
//                     div({className:'error-massange'},[p(info)]),
//                     a({href:'./'},"Вернуться на главную")
//                 ])
//             ])
//         )
//     }
// }
// // 400 Ошибка регистрации не получилось провести регитрацию вбазу данных
// export function Error401(massange?:string){ // приписываем страницу 404 при неправильной записи или ссылке 
//     let exi = new ExhiDOM('body')
//     let info = ''
//     if(massange) info = massange
//     exi.render = ()=>{
//         return(
//             body([
//                 div({className:'error'},
//                 [
//                     h1('Ошибка 401'),
//                     p('Нет возможности провести в базу данных'),
//                     div({className:'error-massange'},[p(info)]),
//                     a({href:'./'},"Вернуться на главную")
//                 ])
//             ])
//         )
//     }
// }
// export function Error333(massange?:string){ // приписываем страницу 404 при неправильной записи или ссылке 
//     let exi = new ExhiDOM('body')
//     let info = ''
//     if(massange) info = massange
//     exi.render = ()=>{
//         return(
//             body([
//                 div({className:'error'},
//                 [
//                     h1('Ошибка 333'),
//                     p('Ошибка на сервере с файловой системой'),
//                     div({className:'error-massange'},[p(info)]),
//                     a({href:'./'},"Вернуться на главную")
//                 ])
//             ])
//         )
//     }
// }

// export function Error332(massange?:string){ // приписываем страницу 404 при неправильной записи или ссылке 
//     let exi = new ExhiDOM('body')
//     let info = ''
//     if(massange) info = massange
//     exi.render = ()=>{
//         return(
//             body([
//                 div({className:'error'},
//                 [
//                     h1('Ошибка 332'),
//                     p('Ошибка на сервере с файловой системой'),
//                     div({className:'error-massange'},[p(info)]),
//                     a({href:'./'},"Вернуться на главную")
//                 ])
//             ])
//         )
//     }
// }

