import { cli } from "webpack";
import { POST_MY } from "../../../../library/GetPost";
import { drag_and_drop } from "../../../../library/darg_and_drop";
import { ExhiDOM, a, btn, div, h1, input, label, p } from "../../../../library/exhibit/exhibit";
import { closeHire, getElement, zayvlenie } from "./table";

// загрузка файлов админом 
 export function openFile(int:any, clinic:string, bid:number, ArrayArcument:[Function,string, string, string]){
     const form = new ExhiDOM('form-edit')
     form.InQueue =  [
        ()=>drag_and_drop(<HTMLElement>document.querySelector('.dragAria'), sendfile)
     ]

     var URLFILES:Array<string> = [];

      function exit(){
          document.querySelector('.form-edit')?.classList.toggle('deactive')
      }

      function sendfile(file:any){
        // проверка на  загружаемые файлы
        if(file.name.split('.').reverse()[0].toLowerCase() == 'pdf'){
          let p = document.querySelector('#info-file-') 
          if(p) p.remove()
          let formData = new FormData()
          formData.append('file', file)
          const upfile = <HTMLElement>document.querySelector('.files-arr')
          upfile.innerHTML = `<div class="loader"><span></span></div>`
          fetch('../php/nalog.php', {
              method: 'POST',
              body: formData,
              redirect:'follow'
          }).then((data) => { 
  
              data.text().then((result)=>{
        
              URLFILES.push(window.location.origin + '/'+ result)
              renderfiles(URLFILES)
  
              })
  
          }).catch(() => { /* Error. Inform the user */ })
        }else{
          let p = document.querySelector('#info-file-')
          if(!p){
            p = document.createElement('p')
            p.id = 'info-file-'
          }
          p.textContent = 'Загрузка только файлов pdf'
          
          if(!document.querySelector('#info-file-')) document.querySelector('.form')?.append(p)
        }
      }


      function renderfiles(URLFILES:Array<string>){
        const upfile = <HTMLElement>document.querySelector('.files-arr')
        upfile.innerHTML = '';

        URLFILES.forEach((url:string)=>{
            upfile.innerHTML += `<p>${nameFile(url)}</p>`
        })
      }

      function filesOnload(evt:any){
        for(let i = 0; i<evt.target.files.length; i++){
           sendfile( evt.target.files[i])
        }
      }


      function send(){

        POST_MY('../php/nalog.php', 'set-file', JSON.stringify({
            clinic:clinic,
            file:URLFILES,
            bid:bid
        })).onload = function(){

            const [st, fm, fl, bt] = getElement(bid, int)
            bt.textContent = 'Закрыть заявку'
            bt.onclick = ()=>closeHire(clinic, bid, int, ArrayArcument)

            let fil =  <HTMLElement>fl.children[0]

            if(!fl.children[1]){
                fl.appendChild(document.createElement('button'))
                let el = <HTMLElement>fl.children[1]
                el.setAttribute("class", "a_bt")
                el.onclick = ()=>openFile(int, clinic, bid, ArrayArcument)
                el.textContent = "Ещё загрузить"
            }

            let i = fil.children.length
          
            URLFILES.forEach((file)=>{i++;

                if(fil.children[1].tagName == 'P'){fil.children[1].remove(); i = 1 }

                const a = document.createElement('a')
                a.setAttribute('href', file)
                a.textContent = nameFile(file)
                a.setAttribute('target', "_blank")
                const btn = document.createElement('button')
                btn.textContent = '×'
                btn.onclick = (evt:any)=>delfile(evt, clinic, bid)
                const  dv = document.createElement('div')
                dv.setAttribute('class', 'files-block')
                dv.append(a, btn)
                fil.children[1].before(dv)
              })
            exit()
        }
      }
//  создает файл заявления
      function send_no_clinic(){
        POST_MY('../php/nalog.php', 'send-no-clinic', JSON.stringify({
            clinic:clinic,
            bid:bid
        })).onload = function(){
            if(this.status == 200  ){

              // console.log(this.responseText)
              const result = this.responseText
            
              URLFILES.push(window.location.origin + '/'+ result)
              renderfiles(URLFILES)
              
            }else{
              console.log(this.responseText)
            }
        }
      }






     form.render(()=>{
         return div({className:'form-edit'}, 
         [
            div({className:'form'},
               [
                  btn({className:'btn-exit', onclick:exit},'×'),
                  h1('Загрузка файлов'),
                  div({className:"dragAria"}, 
                  [
                    p("Перетащите загружаемые файлы  в формате PDF"),
                    p("Справка по налоговому вычету"),
                    p('Договор'),
                    input({type:'file',  id:'files', onchange:filesOnload, multiple:"multiple"}),
                    label({className:"btn-href", for:"files"}, "Загрузить файлы"),
                    div({className:'files-arr'})
                  ]),
                  btn({className:'btn-href', onclick:send}, "Сохранить"),
                  btn({className:'btn-href',  style:'background: #ff5b00;' , onclick:send_no_clinic}, "Не посещал клинику")
               ])
         ])
      })
    }


 export function nameFile(url:string){
      const name = url.split('/').reverse()[0]
      const n =  name.split('_')
      n.shift()
      return n.join('_')
    }



  export function delfile(evt:any, clinic:string, bid:number){
    const elm = evt.target.parentElement
    const urlFile = elm.children[0].getAttribute('href')
    const name = urlFile.split('/').reverse()[0]
     POST_MY('../php/nalog.php', 'del-file', JSON.stringify({
      nameFile:name,
      urlFile:urlFile,
      clinic:clinic,
      bid:bid
     })).onload = function(){
      console.log(this.responseText)
      if(this.status == 200){
        const flex = elm.parentElement
        elm.remove()
        if(flex.children.length == 1){
            const p = <HTMLElement>document.createElement('p')
            p.textContent = 'Нет Файлов'
            flex.append(p)
          
        }

      }
     }
  }