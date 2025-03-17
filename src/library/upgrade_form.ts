// document.querySelector('#phone').onkeydown = function(e){
//     inputphone(e,document.querySelector('#phone'))
//     }

import { Console, error } from "console";
import { errorMonitor } from "events";
import { HTMLInputTypeAttribute } from "react";
import { replaceAll } from "./json";

let keyboardComplect = ''

export function phone_mask(e:Event |any, phone_input?:any){
    if(e.type == 'keydown'){
    let phone = phone_input
      if (!phone) phone = e.target
          let key = e.key, v = phone.value;
        if(key){
          let  not = key.replace(/([0-9])/, 1)
          
          if(not == 1 || 'Backspace' === not){
              if('Backspace' != not){ 

                  if(v.length < 3 || v ==='' ) {phone.value= '+7('}
                  if(v.length === 6){phone.value= v +')'}
                  if(v.length === 10){phone.value= v +'-'}
                  if(v.length === 13){phone.value= v +'-'}
                  if(v.length === 16){stop(e)}
                }
            }else{stop(e)}
        }
    }else{
        let phone = e.target
        if(!phone.value.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
            if(phone.value.match(/(([0-9]){3}([0-9]){3}([0-9]){2}([0-9]){2})$/)){
                let s = phone.value
                phone.value = '+7('+s[0]+s[1]+s[2]+')' + s[3] + s[4]+ s[5]+'-'+s[6]+s[7]+'-'+s[8]+s[9]
            }
            if(phone.value.match(/(([0-9])([0-9]){3}([0-9]){3}([0-9]){2}([0-9]){2})$/)){
                let s = phone.value
                phone.value = '+7('+s[1]+s[2]+s[3]+')' + s[4] + s[5]+ s[6]+'-'+s[7]+s[8]+'-'+s[9]+s[10]
            }
        }
        
    }
    function stop(evt:KeyboardEvent) {
        
        if(keyboardComplect == 'Control'){
            if(evt.key.toUpperCase() == 'V' || evt.key.toUpperCase() == 'М'){
               telefon_copy_past(<HTMLInputElement>evt.target)
            }
        }

        keyboardComplect = evt.key
        if(evt.key != 'Tab') evt.preventDefault();
      
    }
}

export function telefon_copy_past(phone:HTMLInputElement){
    navigator.clipboard.readText().then((data) =>{ 
        phone.value = ''
        let tel = tel_preobr(data)
        if(typeof tel == 'string'){
            phone.value = tel
        }else{
            console.error('Не соответсвует номеру')
        }
    })
}
export function tel_preobr(tel:string):string|boolean{
    let sumbol = ['(', ')', '-', '+', ' ']
    sumbol.forEach((s:string)=> tel = replaceAll(s,'', tel))
    let t = tel.split('')
    if(t[0] == '8') t[0] = '7'
    if(t.join('').match(/(([0-9])([0-9]){3}([0-9]){3}([0-9]){2}([0-9]){2})$/)){
       return  '+7('+t[1]+t[2]+t[3]+')' + t[4] + t[5]+ t[6]+'-'+t[7]+t[8]+'-'+t[9]+t[10]
    }else{
        if(t.join('').match(/(([0-9]){3}([0-9]){3}([0-9]){2}([0-9]){2})$/)){
            return'+7('+t[0]+t[1]+t[2]+')' + t[3] + t[4]+ t[5]+'-'+t[6]+t[7]+'-'+t[8]+t[9]
        }else{
            return false
        }
    }
}

export function click_phone_masck(evt:Event){
  const input =  <HTMLInputElement>evt.target
  if(input.value == '') input.value = '+7('
}
//  принимает телефон в формате 79999999999 отдает +7(999) 999-99-99
    export function format_tel(tel:string|undefined):string{
        if(tel == undefined || tel == ''){
            return ''
        }else{
            if(tel.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)) return '+'+tel
            return '+'+ tel[0]+'('+tel[1]+tel[2]+tel[3]+')'+ tel[4] + tel[5]+ tel[6]+'-'+tel[7]+tel[8]+'-'+tel[9]+ tel[10]

        }
       

    }
    // принимает телефон в формате  +7(999) 999-99-99 отдает 79999999999
    export function format_tel_back(tel:string){
        if(tel.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
            return
        }
        return tel
    }

// ===================================================================================================================================================================================
export  class Form {
         error:string | boolean | undefined
         password:string | undefined
         email:string|undefined
         telefone:string | undefined
         id:string
         full_name:string |undefined
         text:string |undefined
         checkbox:string |undefined
         files:any
         textheader:string|undefined
         constructor(id_Form:string){
            this.id = id_Form
         }
        set setEmail(value: string){
            if(value.match(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u)){
                if(!this.error){
                this.email = value
                this.error = false
                }
               }else{
    
                if(!this.error) this.error = "email написан не верно !!!"
                
               }
        }
        set setPassword(value: string){
            if(value.match(/(?=.*[0-9])(?=.*[!@#$^?*№])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$^?*№]{6,}/g)){
                if(!this.error){
                this.password = value
                this.error = false
                }
            }else{
                if(!this.error) this.error = 'Пароль составлен не верно! Он должен состоять не менее из не менее 6 символов из которых одна заглавнаяи строчная или хотя бы один специальный символ !@#$%^?*№'
            }
        }
        set setTelefone(value: string){
            if( value.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
                if(!this.error){
                    this.telefone = value.trim().slice(1)
                    this.error = false
                }
                
            }else{
              if(!this.error) this.error = 'Не верно введен телефон'
            }
        }
        set setFull_name(value: string){
            if( value.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
                if(!this.error){
                    this.full_name = value
                    this.error = false
                }
            }else{
              if(!this.error) this.error = 'не верно ввели Имя фамилию'
            }
        }
        set setText(value: string){
            if( value.match(/^[А-Яа-яЁё\s\W]+$/)){
                if(!this.error){
                    this.text = value
                    this.error = false
                }
                
            }else{
              if(!this.error) this.error = 'Не верно заполнен текст, текст не может содержать латинские буквы и цифры'
            }
        }
        set setTextHeader(value: string){
            if( value.match(/^[А-Яа-яЁё\s\W]+$/)){
                if(!this.error){
                    this.textheader = value
                    this.error = false
                }
                
            }else{
              if(!this.error) this.error = 'Не верно заполнен текст, текст не может содержать латинские буквы и цифры'
            }
        }
        set setChecBox(value: boolean){
            if(value){
                if(!this.error){
                    this.checkbox = 'Согласие заполнено'
                    this.error = false
                }
            }else{
               if(this.checkbox) delete this.checkbox
              if(!this.error) this.error = 'Нет Согласия'
            }
        }
        set setFiles(value: any){
            if(value){
                if(!this.error){
                    this.files = value
                    this.error = false
                }
            }else{
               if(this.files) delete this.files
              if(!this.error) this.error = 'Нет файла картинки'
            }
        }
        check(){
            let arrayKey:Array<string> = ['error']
            delete this.error
           const Form:any  = document.getElementById(this.id)
           for(let i = 0; i < Form.length; i++){
            if(Form[i].name ){
                // console.log(Form[i])
                arrayKey.push(Form[i].name)
                if( Form[i].value != ''){
                    if(Form[i].name === 'email') this.setEmail = Form[i].value;
                    if(Form[i].name === 'password') this.setPassword = Form[i].value;
                    if(Form[i].name === 'telefone') this.setTelefone = Form[i].value;
                    if(Form[i].name === 'full_name') this.setFull_name = Form[i].value;
                    if(Form[i].name === 'text') this.setText = Form[i].value;
                    if(Form[i].name === 'textheader') this.setTextHeader = Form[i].value;
                    if(Form[i].name === 'checkbox')  this.setChecBox  = Form[i].checked
                    if(Form[i].name === 'files')  this.setFiles = Form[i].files[0]
                }
            }
           }
        //    console.log(this ,arrayKey)
            let i = 0
            arrayKey.forEach(key => {
                if(this.hasOwnProperty(key)){
                    i++
                }
            });
            // console.log(i, arrayKey.length)
            switch(i){
                case 1: return this.error;
                case arrayKey.length : if(this.error){
                    return this.error
                }else {
                    return this
                };
                default: if(this.error){
                    return this.error
                }else{
                    return 'Введены не все поля';
                }
            }
            }
        }
export interface result_form{
     massange?:string
    [name:string]:any 
}
export class  validate_form{
        form:HTMLFormElement|null|any
        result:any|undefined
        files: number
        error:{massange:string|null|undefined}
        condition:{}|undefined|any
        constructor(id_form:string, condition?:{}|undefined) {
            this.form = document.querySelector('#' + id_form)
            this.files = 0
            this.error = {massange:null}
            this.condition = condition
        }
        check(){
            if(this.form != undefined){
                           this.result = {}
         let  n = 0
         let  fil = this.files
            for(let i = 0; i < this.form.length; i++){
              
               if(this.form[i].name != '' && this.form[i].name != undefined){
                 n++  
                //  console.log(this.form[i].name , n)
               if(this.form[i].value != ''){
                    this.result[this.form[i].name] = this.form[i].value
               }
               if(this.form[i].files && this.form[i].files.length > 0){
                    this.result[this.form[i].name] = this.form[i].files[0]
                    fil = 0
               }
                }
            }
            // console.log(Object.keys(this.result).length, n + fil)
             if(n + fil == Object.keys(this.result).length ){
                if(this.condition && Object.keys(this.condition).length > 0){
                    for(let key in this.condition){
                        if(this.result[key]){
                            if(this.result[key] == this.condition[key]){
                                this.error.massange = '"'+ this.result[key] + '" : Не может быть заполнено!'
                                return this.error
                            }
                        }else{
                            console.error(Error( key +' : This name was not found in the form'))
                        }
                    }

                }
                this.error.massange = undefined
              
                return this.result
             }else{
                this.error.massange = 'Не все поля заполнены'
                return  this.error
             }
            }else{
                console.error(Error('Форма не найдена! или шв не соответствует'))
            }
        }
        validate(post:post){
            if(post?.email && !post.email.match(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u)){ 
              return {massange:'Неверный емайл'} 
            }
            if(post?.password && !post.password.match(/(?=.*[0-9])(?=.*[!@#$^?*№])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$^?*№]{6,}/g)){ 
                return {massange:'Пароль составлен не верно! Он должен состоять не менее из не менее 6 символов из которых одна заглавнаяи строчная или хотя бы один специальный символ !@#$%^?*№'}
              
            }
            if(post?.telefone && !post.telefone.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){ 
                return {massange:'Не верно ввли телефон'}
            }
            if(post?.name && !post?.name.match(/^[А-Яа-яЁё\s\W]+$/)){
                return {massange:'Не верно ввели ФИО'}
            }
            return post
        }
                
    }
interface post{
    email?:string
    password?:string
    name?:string
    telefone?:string
}


// Валидатор к проекту SERVICE-LIFE

export interface valid{
    lastName:string|undefined
    firstName:string|undefined
    telefone:string|undefined
    email:string|undefined
    specialist?:string|undefined
    password:string|undefined
 }
 export function validade_key_up_password(evt:any, elm?:HTMLElement){
 
   
 }

 export function validade_key_up( element:any, evt?:any){
// console.log(evt, elm);

    if( element.name == 'lastName'){
         if(!element.value.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
                element.className = 'no-send'
                if(!document.querySelector('.last')) element.insertAdjacentHTML('afterend', '<p class="substr last">Не верная Фамилия</p>')
            }else{
                element.value = element.value
                document.querySelector('.last')?.remove()
                element.className = 'OK'
            }
    }
    if(element.name == 'firstName'){
        if(!element.value.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
            element.className = 'no-send'
            if(!document.querySelector('.first'))element.insertAdjacentHTML('afterend', '<p class="substr first">Не верное Имя</p>')
        }else{
            document.querySelector('.first')?.remove()
            element.value = element.value
            element.className = 'OK'
        }
    }
    if(element.name == 'email'){
        if(!element.value.match(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u)){
            element.className = 'no-send'
            if(!document.querySelector('.email'))element.insertAdjacentHTML('afterend', '<p class="substr email">Не верно email</p>')
        }else{
            document.querySelector('.email')?.remove()
            element.value = element.value.trim()
            element.className = 'OK'
        }
    }
    if(element.name == 'tel'){
        if(evt != null ) phone_mask(evt)
        if(!element.value.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
            element.className = 'no-send'
            if(!document.querySelector('.tel')) element.insertAdjacentHTML('afterend', '<p class="substr tel">Не верно телефон</p>')
        }else{
            document.querySelector('.tel')?.remove()
            element.value = element.value.trim()
            element.className = 'OK'
        }
    }
    if(element.name == 'master'){
        if(!element.value.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
            if(!document.querySelector('.mast')) element.insertAdjacentHTML('afterend', '<p class="substr mast">Не верно</p>')
            element.className = 'no-send'
        }else{
                document.querySelector('.mast')?.remove()
                element.value = element.value.trim()
                element.className = 'OK'
        }
    }
    if(element.name == 'password'){
        if(!element.value.match(/(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z!@#$^?*№]{4,}/) || element.value.split(' ').length  != 1 ){
            if(!document.querySelector('.pass')) element.insertAdjacentHTML('afterend', '<p class="substr pass">Неверно составлен пароль</p>')
            element.className = 'no-send'
        }else{
            document.querySelector('.pass')?.remove()
            element.className = 'OK'
        }
    }
    if(element.name == 'password-two'){
        if(!element.value.match(/(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z!@#$^?*№]{4,}/) || element.value.split(' ').length  != 1 ){
            if(!document.querySelector('.pass')) element.insertAdjacentHTML('afterend', '<p class="substr pass">Неверно составлен пароль</p>')
            element.className = 'no-send'
        }else{
            document.querySelector('.pass')?.remove()
            element.className = 'OK'
        }
    }
 }
 export function validate(valid:valid):string{
     if(!valid.lastName?.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
         return 'lastName'
        }
    if(!valid.firstName?.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
        return 'firstName'
    }
    if(!valid.email?.match(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u)){
        return 'email'
    }
    if(!valid.telefone?.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
        return 'tel'
    }
     
    if(!valid.specialist?.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
            return 'master'
    }
    
    if(!valid.password?.match(/(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z]{4,}/) || valid.password?.split(' ').length  != 1){
        return 'password'
    }
    return 'OK'
 }
 export function validateClient(valid:valid):string{
    if(!valid.lastName?.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
        return 'lastName'
       }
   if(!valid.firstName?.match(/^[A-Za-zА-Яа-яЁё\s]+$/)){
       return 'firstName'
   }
   if(!valid.email?.match(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u)){
       return 'email'
   }
   if(!valid.telefone?.match(/((\+7)(\()([0-9]){3}(\))([0-9]){3}(\-)([0-9]){2}(\-)([0-9]){2})$/)){
       return 'tel'
   }

   if(!valid.password?.match(/(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z!@#$^?*№]{4,}/) || valid.password?.split(' ').length  != 1){
       return 'password'
   }
   return 'OK'
}