// ===========================================================================================================
// ===========================================================================================================
// ==============================EXHIBIT======================================================================
// ======= ==========Пакет для создания SPA и реактивности показа страниц=====================================




// ===============================ОПИСАНИЕ ИНТЕРФЕЙСОВ========================================================

// Скалет VNODE - Виртуальной Ноды
export interface vnode{
    tag:string
    props:atribute
    children:Array<vnode>
    
}



export interface ob{
    [name: string]: any;
}
export interface Watch{
    [name:string]:HTMLElement|Element|HTMLInputElement|HTMLFormElement|HTMLBodyElement|any
}
export interface WatchValue{
    [name:string]:any
}
// Атрибуты props
export interface atribute{
    [name: string ]: any;
    className?: string;
    id?: string;
    innerHTML?: string;
    type?: string;
    value?: string;
    textContent?: string;
    src?: string;
    alt?: string;
    onclick?: any;
    href?: string;
    style?: string;
    name?: string;
    for?: string;
    placeholder?: string;
    onkeydown?: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
    onkeyup?: ((this: GlobalEventHandlers, ev: KeyboardEventInit) => any) | null;
    onblur?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onchange?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onfocus?:((this: GlobalEventHandlers, ev: Event) => any) | null;
    ondrop?:((this:GlobalEventHandlers, ev:Event)=>any) | null;
    ondragstart?:((this:GlobalEventHandlers, ev:Event)=>any) | null;
    ondragover?:((this:GlobalEventHandlers, ev:Event)=>any) | null;
    ontouchmove?:((this:Window, ev:TouchEvent)=>any) | null;
    onpaste?:((this:GlobalEventHandlers, ev:Event)=>any);
    maxlength?: string;
    required?: string;
    action?: string;
    minlength?: string;
    autocomplete?: string;
    pattern?: string;
    rel?: string;
    loading?: string;
    referrerpolicy?: string;
    allowfullscreen?: string;
    step?: string;
    max?: string;
    enctype?: string;
    method?: string;
    data?: string;
    checked?:boolean
    localname?:string
    title?:string
    selected?:boolean|string
    rows?:string
    cols?:string
    draggable?:boolean
    tabIndex?:string
}




// ====================================================================================================================
// ======================================ОСНОВНЫЕ ФУНКЦИИ==============================================================



export function ex(tag:string, props:atribute|string|undefined|vnode|ExhiDOM = undefined, children:string|Array<vnode>|undefined|vnode|ExhiDOM = undefined):vnode {

    let rProps:atribute = {}
    let rChildren:Array<vnode> = []

        if(props instanceof ExhiDOM){
            if(props.vnode) rChildren.push(props.vnode())
             }else{
                if(props != undefined && Array.isArray(props)){ // если props равен Массиву
                    rChildren  = props
                }
                if(typeof props == 'string'){ // если props равен строке 
                        if(props.includes('<') && props.includes('>')){
                            rProps = {innerHTML:props}
                        }else{
                            rProps = {textContent:props}
                        }
                    }
                if(props != undefined && typeof props === 'object' && !Array.isArray(props)){ // проверка на атрибуты или vnode
                    if(props.tag){
                        rChildren.push({tag:props.tag,  props:props.props,  children:props.children})
                    }else{
                        rProps = props
                    }
                }
            // возможность пердставить детей в виде строки
            if(typeof children == 'string'){
                if(rProps){
                    if(children.includes('<') &&  children.includes('>')){
                    rProps.innerHTML? rProps.innerHTML = rProps.innerHTML + children: rProps.innerHTML  = children
                    }else{
                        rProps.textContent? rProps.textContent = rProps.innerHTML + children: rProps.innerHTML  = children
                    }
                }
            }
        }
        if(children instanceof ExhiDOM){
            if(children.vnode) rChildren.push(children.vnode())
        }else{
            if(!Array.isArray(children) && typeof children == 'object'  ){
                if(children.tag ){
                    rChildren.push({tag:children.tag,  props:children.props,  children:children.children})
                }
            }
        }
    // если дети vnode
    if(Array.isArray(children)){
        rChildren.push(...children)
    }
    return { tag:tag, props:rProps, children:rChildren};
}




// Список элементов для Читабельности
export function input(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
 return ex('input', props, children)
}
export function div(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('div', props, children)
   }
export function h1(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('h1', props, children)
}
export function h2(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('h2', props, children)
}
export function h3(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('h3', props, children)
}
export function h4(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('h4', props, children)
}
export function img(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('img', props, children)
}
export function body(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('body', props, children)
}
export function a(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('a', props, children)
}
export function nav(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('nav', props, children)
}
export function btn(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('button', props, children)
}
export function button(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('button', props, children)
}
export function p(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('p', props, children)
}
export function label(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('label', props, children)
}
export function ul(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('ul', props, children)
}
export function ol(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('ol', props, children)
}
export function li(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('li', props, children)
}
export function option(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('option', props, children)
}
export function select(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('select', props, children)
}
export function table(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('table', props, children)
}
export function tr(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('tr', props, children)
}
export function th(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('th', props, children)
}
export function td(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('td', props, children)
}
export function textarea(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('textarea', props, children)
}
export function span(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('span', props, children)
}
export function clipPath(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('clipPath', props, children)
}
export function path(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('path', props, children)
}
export function canvas(props:atribute|string|undefined|vnode = undefined, children:string|Array<vnode>|undefined|vnode = undefined):vnode{
    return ex('canvas', props, children)
}


// Устанавливаем атрибуты в Элемент
function HTMLElementSetAttribute(element:any, vnode:vnode, key:any) { 
    if(typeof vnode.props == 'object'){
    switch (key) {
      case 'className':
        element.setAttribute('class', vnode.props[key]);
        break;
         case 'selected':
            if(vnode.props[key]) element.setAttribute('selected', String(vnode.props[key]));
        break;
      case 'for':
        element.setAttribute('for', vnode.props[key]);
        break;
    case 'rowspan':
        element.setAttribute('rowspan', vnode.props[key]);
        break;
    case 'colspan':
        element.setAttribute('colspan', vnode.props[key]);
        break;
      case 'style':
        element.setAttribute("style", vnode.props[key]);
        break;
      case 'value':
        // elem.hasAttribute('value')
        element.setAttribute('value', vnode.props[key]);
        element[key] = vnode.props[key];
        break;
    //   case 'selected':
    //     element.setAttribute('selected', vnode.props[key]);
    //     break;
      case 'maxlength':
        element.setAttribute('maxlength', vnode.props[key]);
        break;
        case 'minlength':
        element.setAttribute('minlength', vnode.props[key]);
        break;
        case 'src':
        element.setAttribute('src', vnode.props[key]);
        break;
        case 'name':
            element.setAttribute('name', vnode.props[key])
        break;
        case 'rows':
            element.setAttribute('rows', vnode.props[key])
        break;
        case 'cols':
            element.setAttribute('cols', vnode.props[key])
        break;
        case 'draggable':
            element.setAttribute('draggable', vnode.props[key])
        break;
        case 'data':
            element.setAttribute('data', vnode.props[key])
        break;
        case 'd':
            element.setAttribute('d', vnode.props[key])
        break;
        default:
            // console.log(vnode.props)
            element[key] = vnode.props[key];
    }
}
}

function HTMLElementDeleteAttribute(element: any, key: string) {
    switch (key) {
      case "className":
        element.removeAttribute("class");
        break;
        case 'for':
        element.removeAttribute('for');
        break;
      case 'style':
        element.removeAttribute("style");
        break;
    //     case 'value':
    //     element.removeAttribute('value');
    //     break;
      case 'selected':
        element.removeAttribute('selected');
        break;
      case 'maxlength':
        element.removeAttribute('maxlength');
        break;
        case 'minlength':
        element.removeAttribute('minlength');
        break;
        case 'src':
        element.removeAttribute('src');
        break;
        case 'id':
            element.removeAttribute('id');
        break;
        case 'title':
            element.removeAttribute('title');
        break;
        case 'name':
            element.removeAttribute('name');
        break;
        case 'selected':
            element.removeAttribute('selected');
        break;
        case 'rows':
            element.removeAttribute('rows');
        break;
        case 'cols':
            element.removeAttribute('cols');
        break;
        case 'draggable':
            element.removeAttribute('draggable');
        break;
        case 'data':
            element.removeAttribute('data');
        break;
        case 'd':
            element.removeAttribute('d');
        break;
        case 'onklick':
            element[key] = null;
        break;
        case 'checked':
            element[key] = null;
        break;
        case 'onchange':
            element[key] = null;
        break;
        case 'onkeydown':
            element[key] = null;
        break;
        case 'onkeyup':
            element[key] = null;
        break;
        case 'onblur':
            element[key] = null;
        break;
        case 'onfocus':
            element[key] = null;
        break;
      default:
        element[key] = '';
    }
  }

function createElement(vnode:vnode):HTMLElement{
    let element:HTMLElement = document.createElement(vnode.tag); // Создаем елемент
       
    if (typeof vnode.props == 'object' && Object.keys(vnode.props).length != 0) {  // проходим по атрибутам
        for (let key in vnode.props) {
            HTMLElementSetAttribute(element, vnode, key);
        }
    }
    // проходим по детям
    if (typeof vnode.children == "object") {
        for (let i = 0; i < vnode.children.length; i++) {
            element.append(createElement(vnode.children[i]));
        }
    }
    return element;
}





// =========================  И Вот он виновник торжества===================================================================================================================
// ===== Класс Вертульный дом
 interface optDOM{
    rewrite:boolean
    value:boolean
 }



 function event_exhi(element:HTMLInputElement, DOM:ExhiDOM, vnode:vnode){
    if(vnode.props && vnode.props.name){
            DOM.WatchValue[vnode.props.name] = element.value
            let onchange:any = undefined
            if(vnode.props.onchange) onchange = vnode.props.onchange
            element.onchange = (evt:any)=>{
                DOM.WatchValue[evt.target.getAttribute('name')] = evt.target.value
                if(onchange) onchange(evt)
            }
            let onkeydown:any = undefined
            if(vnode.props.onkeydown) onkeydown = vnode.props.onkeydown
            element.onkeydown = (evt:any)=>{
                DOM.WatchValue[evt.target.getAttribute('name')] = evt.target.value
                if(onkeydown) onkeydown(evt)
            }
        if(vnode.tag == 'input' && vnode.props.type === 'checkbox'){
                DOM.WatchValue[vnode.props.name] = element.checked
            element.onchange = (evt:any)=>{
                
                DOM.WatchValue[evt.target.getAttribute('name')] = evt.target.checked
                if(onchange) onchange(evt)
            }
    }
        // if(vnode.tag == 'input' && vnode.props.type == 'radio'){
        //     DOM.WatchValue[vnode.props.name] = 
        // }
    }

 }
export class ExhiDOM{
    root:Element|undefined|null
    vnode:Function|undefined
    Element:HTMLElement|undefined |any
    // ReplaceVnode:Function
    toggle:ob  // Объект для переключения Состояний
    WatchId:Watch
    WatchName:Watch
    WatchValue:WatchValue
    option:optDOM
    id:string
    vn_original:vnode
    InQueue:Array<Function>
    constructor(id:string, option?:optDOM |undefined){
        this.id = id
        this.root = this.roots(id)
        this.vnode = undefined
        this.toggle = {}
        this.Element 
        this.WatchId = {}
        this.WatchName = {}
        this.WatchValue ={}
        this.option = this.default(option)
        this.InQueue = []
        this.vn_original = div([p("vn_original null")])
    }

 protected default(option:any){
    let defaultOP:any = {
        rewrite:true,
        value:true
        // тут можно добавлять различные опции по умолчанию
    }
    if(option){
        for(let key in option){
            defaultOP[key] = option[key]
        }
    }
    return defaultOP
 }
    roots(id:string){ // Универсальный поиск елемента
    
        let Id =  document.querySelector('#'+id)
        if(Id) return  Id
        let cl = document.querySelector('.'+id)
        if(cl) return cl
        let el = document.querySelector(id)
        if(el) return el
       
        return undefined
    }
 
    render(vnode?:Function|vnode){ // рендеринг объектов 
       if(vnode && typeof vnode == 'function'){
            this.vn_original = vnode()
            this.vnode = vnode
        if(this.root != undefined){
            if(this.option.rewrite){
                this.root.replaceWith(this.createElement(this.vn_original))
                this.root = this.roots(this.id)
                this.Element = this.root
            }else{
                this.Element = this.createElement(this.vn_original)
                this.root.append(this.Element)
            }
        }else{
            console.error('render не обнаружил элемент в root')
        }
       
    }else{
        if(!vnode){
            if(this.vnode && typeof this.vnode == 'function'){
                this.vn_original = this.vnode()
                this.path(this.Element,  this.vn_original)
            }
        }else{
            this.vn_original = vnode
            this.vnode = ()=>{ return vnode}
            // console.log(this.Element)
            this.path(this.Element, vnode)

            // В закоментированном коде лаг
            // this.root = this.roots(this.id)
            // this.Element = this.root
            // if(this.vnode && vnode && typeof vnode == 'object'){
            //        this.path(this.Element, this.vnode())
            // }else{
            //         if(this.root != undefined && this.vnode) this.root.replaceWith(this.createElement(this.vnode()))
            //         this.root = this.roots(this.id)
            //         this.Element = this.root
        // }
        }
    
    
    }

    

        if(this.InQueue.length != 0){
            this.InQueue.forEach((fun:Function)=>{
                const app:vnode = fun()
                
            })
        }


        // function searchAll(name:string, vnode:vnode, DOM:ExhiDOM){
        //     if(vnode.props[name]){
        //         if(name == 'id'){
                
        //         }
        //     }
        //     if(vnode.children){
        //         vnode.children.forEach((vn:vnode)=>{
        //             searchAll(name, vn)
        //         })
        //     }

        // }
    }

  public State(obj:ob, option = {toggle:false}){ // Сотояния Объекта при изменений в объекте перерендеривает ообъект 
        let DOM = this
        if(option.toggle == false){ // при опции по умолчанию
            return new Proxy(obj,{
                set: function(target:any, props:any, newValue:any){
                    target[props] = newValue
                    if(DOM.vnode) DOM.render()
                    return true
                }
            })
        }

        if(option.toggle == true){ // при включеном переключателе
            let tog = this.toggle
            for(let key in obj){ // клонируем
                tog[key]  = obj[key]
            }
            return new Proxy(obj,{
                set: function(target:any, props:any, newValue:any){ // помещаем все в прокси и создаем событи при присваивании нового заначения
                    if(tog[props] == target[props]){
                        target[props] = newValue
                    }else{
                        target[props] = tog[props]
                    }
                    if(DOM.vnode) DOM.render() // перерендериваем страницу
                    return true
                }
            })
        }
    }

    // Создание елементов
   protected createElement(vnode:vnode){
        let element:any = document.createElement(vnode.tag); // Создаем елемент
        if (typeof vnode.props == 'object' && Object.keys(vnode.props).length != 0){  // проходим по атрибутам
             for(let key in vnode.props) {

                HTMLElementSetAttribute(element, vnode, key);

                if(key == 'id'){ // собираем элементы по id
                    if(vnode.props.id) this.WatchId[vnode.props.id] = element
                }
                if(key == 'name' && vnode.props.name){ // Собираем Елеметы по Name
                         this.WatchName[vnode.props.name] = element
                }
            }

            for(let key in vnode.props) {
                if(key == 'name' && vnode.props.name){
                    if(vnode.tag == 'input' || vnode.tag == 'select' || vnode.tag == 'textarea' ){
                        event_exhi(element, this, vnode)
                    }
                }
            }

        }
        // проходим по детям
        if (typeof vnode.children == "object") {
            for (let i = 0; i < vnode.children.length; i++) {
                element.append(this.createElement(vnode.children[i]));
            }
        }
        // Добавляем в WatchValue значение value
        if(element.tagName == 'SELECT') this.WatchValue[element.name] = element.value
              return element;
        }

    // сравнивает вертуальную ноду с Елементом
   public path(Element:any, vnode:vnode):void|boolean{
    
       if(typeof Element != 'object' || Element == null || Element == undefined){// Проверяем на наличие елемента
        console.log(Error('Елемента не существует'))
        return false
    }
   
    // сравниваем елементы
    if(Element.localName == vnode.tag){
        let A = Element.attributes.length
         for(let a = 0; a < A; a++){
          Element.removeAttribute(Element.attributes[0]['name']) 
        }
        if(typeof vnode.props === 'object' && Object.keys(vnode.props).length != 0){ // Сравниваем атрибуты
                        

                    Object.keys(vnode.props).forEach((key)=>{
                        if(typeof vnode.props === 'object'){
                        
                        if(vnode.props[key] != Element[key]){
                                HTMLElementSetAttribute(Element, vnode, key)
                        }

                    if(key == 'id'){ // собираем элементы по id
                        if(vnode.props.id) this.WatchId[vnode.props.id] = Element
                    }

                    if(key == 'name'){ // Собираем Елеметы по Name
                        if(vnode.props.name){
                             this.WatchName[vnode.props.name] = Element
                        }
                    }
                }
                        })

                        Object.keys(vnode.props).forEach((key)=>{
                            if( key == 'name'&& vnode.tag == 'input' || vnode.tag == 'select' || vnode.tag == 'textarea' ){
                                event_exhi(Element, this, vnode)
                            }
                        })
                }

               

                if(vnode.children && Object.keys(vnode.children).length != 0){ // Сравниваем детей 
                    
                    
                    if(vnode.children.length == Element.children.length){ //Количество детей одинаковое
                        
                        for(let i = 0; i < vnode.children.length; i++){
                                this.path(Element.children[i], vnode.children[i])
                        }
                    }

                   
                    if(vnode.children.length > Element.children.length){//В Vnode больше чем в Элементе
                        
                        for(let i = 0; i < vnode.children.length; i++){
                            if( i < Element.children.length ){

                                
                                this.path(Element.children[i],vnode.children[i])
                            }else{
                                Element.append(this.createElement(vnode.children[i]))
                            }
                        }
                    }
                    
                    if(vnode.children.length < Element.children.length){ //В Vnode меньще чем в Элементе
                      
                        
                        for(let i = 0; i < Element.children.length; i++){
                          
                            if( i <= vnode.children.length - 1 ){
                                this.path(Element.children[i],vnode.children[i])
                            }else{
                                Element.children[i].remove()
                                i--
                            }
                        }
                    }

                    // после добавления элементов проверяем эвент и добавляем события 
                    // также будет заполняться WatchValue
                    event_exhi(Element, this, vnode)
                }else{
                    if(Element.children.length != 0){ //Если Vnode не оказалось ни одного Элемента
                        const n = Element.children.length
                        for(let i = 0; i < n; i++){// Перебираем Детей Элемента и удаляем
                            Element.children[0].remove()
                        }}
                    }
                }else{
                    
                Element.replaceWith(this.createElement(vnode)) //Если Таги разные тогда перезаписываем Элемент Ноды
            }
        return true
    }
// Замена Елемента по классу
 public attr(name:string, atribute:atribute){
    let elem:any = undefined;
    if(this.WatchName[name]) elem = this.WatchName[name]
    if(elem  == undefined && this.WatchId[name]) elem = this.WatchId[name]
    if(!elem) elem = document.querySelector(name)
    if(elem){
    let vnode:vnode = { tag:'', props:atribute, children:[]}
    Object.keys(atribute).forEach((key)=>{
        HTMLElementSetAttribute(elem, vnode, key)
    })
    }else{
        return console.error("Element undefined")
    }
 }

 search(name:string,props?:atribute, children?:Array<vnode>){
        if(this.vnode){
        let vn:vnode|undefined 
        this.vn_original = this.vnode()
                if( this.vn_original){
                    if(name.split('.')[1]){
                        const className = name.split('.')[1]
                        vn = classSearch(this.vn_original, className)
                        if(vn){
                        vn.children = new Proxy(vn.children,{
                            set: (target:any, props:any, newValue:any)=>{
                                target[props] = newValue
                                this.render(this.vn_original)
                                return true
                            }
                        })
                        vn.props = new Proxy(vn.props,{
                                    set: (target:any, props:any, newValue:any)=>{
                                        target[props] = newValue
                                        this.render(this.vn_original)
                                        return true
                                    }
                                })
                        }
                    }



                    if(name.split('#')[1]){
                    const id = name.split('#')[1]
                    vn = IdSearch(this.vn_original, id)
                        if(vn){
                        vn.children = new Proxy(vn.children,{
                            set: (target:any, props:any, newValue:any)=>{
                                target[props] = newValue
                                this.render(this.vn_original)
                                return true
                            }
                        })
                        vn.props = new Proxy(vn.props,{
                                    set: (target:any, props:any, newValue:any)=>{
                                        target[props] = newValue
                                        this.render(this.vn_original)
                                        return true
                                    }
                                })
                        }
                    // return IdSearch (this.vn_original, id)
                    }

                     if(props && children && vn){
                       
                        option_vn(props, children, vn)
                     }
                     if(props && children == undefined && vn){
                        option_vn(props, vn.children, vn)
                     }
                     if(props== undefined && children && vn){
                        option_vn(vn.props, children, vn)
                     }
                     return vn
                    



                }
        }

        function IdSearch(vnode:vnode, id:string ){

            if(vnode.props.id && vnode.props.id == id) return vnode 

                for(let ch = 0; ch < vnode.children.length; ch++){
                    let res:any = IdSearch(vnode.children[ch], id)
                    if(res){
                        return res
                    }else{
                        IdSearch(vnode.children[ch], id)
                    }
                }
        }

        function classSearch(vnode:vnode, className:string ){
            if(vnode.props.className){
                const ArrClass = vnode.props.className?.split(' ')
                for(let i = 0 ; i < ArrClass?.length;i++ ){
                    if(ArrClass[i]  == className){
                        return vnode 
                    }
                }
            }
                
                for(let ch = 0; ch < vnode.children.length; ch++){
                    let res:any = classSearch(vnode.children[ch], className)
                    if(res){
                        return res
                    }else{
                        classSearch(vnode.children[ch], className)
                    }
                }
        }


 function option_vn(props:atribute, children:Array<vnode>, vn:vnode){
     if(vn){
         vn.children = children
         Object.keys(props).forEach((key)=>{
            vn.props[key] = props[key]
         })
     }

 }
    }


 
}





export function showElement(id:string){
let elem = document.querySelector('#'+ id)? document.querySelector('#'+ id): document.querySelector('.'+ id)
if(elem){
    let h = document.documentElement.clientHeight/2
    window.scrollTo(0 ,elem.getBoundingClientRect().top + (window.scrollY - h + (elem.clientHeight/2)) )
}
}