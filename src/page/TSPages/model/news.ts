import { forEach } from "../../../../webpack.config";
import { POST_MY } from "../../../library/GetPost";
import { my_cookie } from "../../../library/cookie";
import { ExhiDOM, btn, button, div, h1, h3, h4, img, p, vnode } from "../../../library/exhibit/exhibit";
import { IsJsonString, family_min } from "../../../library/json";


interface news{
    user:Array<string>
    author:string
    date:string,
    body:string,
    header:string,
    id:string
}



export  function new_page(render:Function){
const new_block = new ExhiDOM('panel')
const breakImg = require('../../../images/whatsApp/break_1.png')
const content:Array<vnode> = []
let deletes = false
if(my_cookie.role == 'system_admin' || my_cookie.role == 'marketing') deletes = true
    POST_MY('../php/router.php', "get-news", 'ok').onload = function(){
        if(IsJsonString(this.responseText)){
            const newsGlob:{news:Array<news>} = JSON.parse(this.responseText)
           

            newsGlob['news'].reverse().forEach((news:news)=>{
            
                let read = ''
               
                if(!news['user'].includes(my_cookie.id_user)) read = 'read'


                content.push(
                    div({className:'block-news ' + read, onclick:()=>open_news(news.id), id:"read_" + news.id}, 
                    [
                        
                        div({className:"header-news"},
                        [
                            deletes? btn({className:'btn-exit', onclick:()=>dellNews(news.id)},'×'):div({className:'deactive'}),
                            h3({className:'pin_' + read}, news.header),
                            p(news.date)
                        ]),
                        div({className:"text-news deactive", id:news.id}, 
                        [
                            h4("Автор : "+ family_min(news.author)),
                            p(news.body)
                        ])
                    ])
                )
            })
            new_block.render()
        }else{
            console.log(this.responseText)
        }
        
        
    }
function dellNews(id:string){
     POST_MY('../php/router.php', "del-news", id).onload = function(){
        if(this.responseText == '1'){
            new_page(render)
        }
     }
}

function open_news(id:string){
    let el = document.getElementById(id)
    el?.classList.toggle('deactive')
    POST_MY('../php/router.php', "set-read", id).onload = function(){
        if(this.responseText == '1'){
            let bt:HTMLElement = <HTMLElement>document.querySelector('.news-btn')
            let n = Number(bt.getAttribute('data')) - 1
            if(n == 0) bt.className = 'btn-href news-btn count'
            bt.setAttribute('data', String(n))
            let evt = <HTMLElement>document.getElementById('read_'+id)
            console.log(evt)
            evt.className = 'block-news'
        }
        console.log(this.responseText)
    }
}





new_block.render(()=>{
        return div({className:'panel base'},[
            h1("Новости"),
              div({className:'source-pannel', style:"border: none;"},
              [
                img({className:'btn-breack', title:'Выход из панели пользователей', src:breakImg, onclick:()=>render() }),
            ]),
            div({className:'body-news'},content)
        ])
    })
}

 export function update_news(){
    let update = setInterval(()=>{

    POST_MY("../php/router.php", "update-news", my_cookie.news_count ).onload = function(){
        if(this.responseText == '1'){
            let bt:HTMLElement = <HTMLElement>document.querySelector('.news-btn')
             bt.className = 'btn-href news-btn'
             bt.setAttribute('data', my_cookie.news_count)
        }
        console.log(this.responseText)
    }

    
    }, 300000)
}
