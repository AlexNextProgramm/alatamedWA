

// let DOMEN = 'http://localhost:3000'
// let DOMEN = 'http://127.0.0.1:5500'

import { table } from "console";
import { el } from "./HTML";
import { IsJsonString, replaceAll } from "./json";
// import { Error404 } from "../api/api";



export function GET_MY(directory:string, boolean:boolean = true, cache:boolean = true){
 let urlAdress:string = `${directory}`
let request:XMLHttpRequest = new XMLHttpRequest()
request.open('GET', urlAdress, boolean)
if(cache == false) request.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
// request.responseType = 'json';
request.send();
return request
}


export async function GET_JSON(directory:string, cache:boolean = true){
     return new Promise((resolve, relect)=>{
          GET_MY(directory, true, cache).onload = function(){
               if(this.status == 200 && IsJsonString(this.responseText)){
                    resolve(JSON.parse(this.responseText))
                    return JSON.parse(this.responseText)
               }else{
                    console.error(this.responseText)
                    Error(this.responseText)
                    relect(this.responseText)
               }
               console.log(this.responseText)
          }
     })
}



export function POST_MY(directory:string, name:string, body:string){
     let request = new XMLHttpRequest();
     body = replaceAll('=', '%3D', body)
     body = replaceAll('#', '%2523', body)
     body = replaceAll('&', '%26', body)
     body = replaceAll('?', '%3F', body)
     body = replaceAll('+', '%2B', body) //! столкнулся с проблемой кодировки символа "+"
     let param = name + '='+ body
     request.open('POST', directory, true)
     request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
     request.send(param)
     return request
}

export async function POST_MY_FILES(directory:string, name:string, file:File, post?:string ){
     const FromData = new FormData();
     FromData.append(name , file)
     if(post) FromData.append('post', post)
     const request = await fetch(directory,{
          method:'POST',
          body:FromData,
          redirect:'follow'
     })
     return request
}

export async function POST_JSON(directory:string, name:string, body:any){
   return new Promise((resolve, relect)=>{
     POST_MY(directory, name, JSON.stringify(body)).onload = function(){
          // console.log(this.responseText)
          // console.dir(this)
          if(this.status == 200 && IsJsonString(this.responseText)){
               resolve(JSON.parse(this.responseText))
               return JSON.parse(this.responseText)
          }else{
               if(this.status != 200){
                    // if(this.status == 404) Error404(this.responseText)
                    relect(this.responseText)
                    console.error(this.responseText)
               }else{
                    console.log("Server none Json")
                    console.log(this.responseText)
               }
               
          }
          console.log(this.responseText)
     }
   })
 
   
}


// нужно поюзать может что-то дельное получиться
export function POST_XML_IMG(directory:string, data:string){
const xmlhttp = new XMLHttpRequest();
xmlhttp.open('POST', directory, false);
xmlhttp.setRequestHeader("Content-Type", "image/jpeg");
xmlhttp.setRequestHeader("Slug", "ThisIsNewImage");
xmlhttp.send(data);
}