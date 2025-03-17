import { BlobOptions } from "buffer";
import { Console } from "console";
import { FileChangeInfo } from "fs/promises";

export interface vnode {
  tag: string;
  props: atribute;
  children?: Array<vnode> | undefined;
}
export interface ElemVnode extends HTMLElement {
  vnode?: vnode;
}
export interface ElementVnode extends Element {
  vnode: vnode;
}
export interface atribute {
  [name: string]: any;
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
  onchange?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  data?: string;
  onblur?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  checked?:boolean
}

export function e(
  element: string,
  atribute: atribute | null = {},
  ArrayElements: any = []
) {
  const elem: HTMLElement | any = document.createElement(element);

  if (atribute) {
    if (atribute.className) elem.className = atribute.className;
    if (atribute.textContent) elem.textContent = atribute.textContent;
    if (atribute.id) elem.id = atribute.id;
    if (atribute.innerHTML) elem.innerHTML = atribute.innerHTML;
    if (atribute.onclick) elem.onclick = atribute.onclick;
    if (atribute.onkeydown) elem.onkeydown = atribute.onkeydown;
    if (atribute.onkeyup) elem.onkeyup = atribute.onkeyup;
    if (atribute.onchange) elem.onchange = atribute.onchange;
    if (atribute.onblur) elem.onblur = atribute.onblur;
    if (atribute.placeholder)
    if (atribute.value) elem.setAttribute("value", atribute.value);
    elem.setAttribute("placeholder", atribute.placeholder);
  if (atribute.autocomplete)
  elem.setAttribute("autocomplete", atribute.autocomplete);
if (atribute.referrerpolicy)
      elem.setAttribute("referrerpolicy", atribute.referrerpolicy);
    if (atribute.allowfullscreen)
    elem.setAttribute("allowfullscreen", atribute.allowfullscreen);
    if (atribute.type) elem.setAttribute("type", atribute.type);
    if (atribute.src) elem.setAttribute("src", atribute.src);
    if (atribute.alt) elem.setAttribute("alt", atribute.alt);
    if (atribute.href) elem.setAttribute("href", atribute.href);
    if (atribute.style) elem.setAttribute("style", atribute.style);
    if (atribute.name) elem.setAttribute("name", atribute.name);
    if (atribute.for) elem.setAttribute("for", atribute.for);
    if (atribute.maxlength) elem.setAttribute("maxlength", atribute.maxlength);
    if (atribute.minlength) elem.setAttribute("minlength", atribute.minlength);
    if (atribute.required) elem.setAttribute("required", "");
    if (atribute.action) elem.setAttribute("action", atribute.action);
      if (atribute.pattern) elem.setAttribute("pattern", atribute.pattern);
      if (atribute.rel) elem.setAttribute("rel", atribute.rel);
      if (atribute.loading) elem.setAttribute("loading", atribute.loading);
    if (atribute.step) elem.setAttribute("step", atribute.step);
    if (atribute.max) elem.setAttribute("max", atribute.max);
    if (atribute.enctype) elem.setAttribute("enctype", atribute.enctype);
    if (atribute.method) elem.setAttribute("method", atribute.method);
    if (atribute.data) elem.setAttribute("data", atribute.data);
  }
  if (ArrayElements) {
    for (let i = 0; i < ArrayElements.length; i++) {
      elem.appendChild(ArrayElements[i]);
    }
  }

  elem.overwrite = overwrite;
  // elem.const [first, setfirst] = useState(second)
  return elem;
}
function overwrite(this: HTMLElement, element: HTMLElement) {
  const parentElement = this;
  let elementOld: HTMLElement | null | any;
  let id: string;
  if (element.className) {
    elementOld = parentElement.querySelector("." + element.className);
    re_write(elementOld);
  }
  if (element.id) {
    elementOld = parentElement.querySelector("#" + element.id);
    re_write(elementOld);
  }
  function re_write(elementOld: HTMLElement | null | undefined) {
    if (elementOld) {
      elementOld.replaceWith(element);
    } else {
      parentElement.append(element);
    }
  }
}

// НОВАЯ РАЗРАБОТКА МОЕГО ФРЕЙМ ВОРКА РЕАКТ
// let State:object |any = {} // глобальный объект состояний

export function useState(context: any, react: DOM | any) {
  let int: number = Object.keys(react.State).length;
  react.State[int] = {
    content: context,
    react,
  };
  Object.keys(react.State[int]).forEach((key) => {
    let value = react.State[int][key];
    Object.defineProperty(react.State[int], key, {
      get() {
        return value;
      },
      set(newValue) {
        if (newValue !== value) {
          value = newValue;
          react.State[int].react.rerender();
          return value;
        }
      },
    });
  });
  let integ = react.State[int];
  function funContext(
    param: any,
    context = function (par: any) {
      par.content = param;
      param = par.content;
      return param;
    }
  ) {
    context(integ);
    return integ.content;
  }
  return [integ.content, funContext];
}
function HTMLElementSetAttribute(element: any, vnode: any, key: string) {
  if (vnode.props != undefined && vnode.props != null) {
    switch (key) {
      case "className":
        element.setAttribute("class", vnode.props[key]);
        break;
      case "textContent":
        element[key] = vnode.props[key];
        element.vnode.children = undefined;
        break;
      case "for":
        element.setAttribute("for", vnode.props[key]);
        break;
      case "style":
        element.setAttribute("style", vnode.props[key]);
        break;
      case "value":
        element.setAttribute("value", vnode.props[key]);
        break;
      case "selected":
        element.setAttribute("selected", vnode.props[key]);
        break;
      case "src":
        element.setAttribute("src", vnode.props[key]);
        break;
      default:
       
        element[key] = vnode.props[key];
    }

    element.vnode.props[key] = vnode.props[key];
  }
}
// функция удаления атрибута
function HTMLElementDeleteAttribute(element: any, vnode: any, key: string) {
  switch (key) {
    case "className":
      element.removeAttribute("class");
      break;
    default:
      element[key] = vnode.props[key];
  }

  delete element.vnode.props[key];
}

// фУНКЦИЯ ЩАБЛОНА ЕЛЕМЕНТА
export function el(tag: string, props: atribute = {}, children?: Array<vnode>): vnode {
  return { tag, props, children };
}

export function createElement(vnode:vnode):ElementVnode {
  let element: any = document.createElement(vnode.tag);
  element.vnode = vnode;
  if (vnode.props) {
    for (let key in vnode.props) {
      HTMLElementSetAttribute(element, vnode, key);
    }
  }else{
    vnode.props ={}
  }

  //    if(typeof vnode.children == 'string'){
  //        element.textContent = vnode.children
  //    }

  if (typeof vnode.children == "object") {
    for (let i = 0; i < vnode.children.length; i++) {
      element.appendChild(createElement(vnode.children[i]));
    }
  }

  return element;
}
// Функция патч
export function Path(oldElement: any, newElement: any) {

  if (oldElement.vnode.tag == newElement.vnode.tag) {
   
      // if (!oldElement.vnode?.props) oldElement.vnode.props = {};

      // ---------- изменение Атрибутов---------------------
      if (JSON.stringify(oldElement.vnode.props) != JSON.stringify(newElement.vnode.props)) {
        if (Object.keys(oldElement.vnode.props).length <= Object.keys(newElement.vnode.props).length) {
          for (let key in newElement.vnode.props) {
            if(oldElement.vnode.props.hasOwnProperty(key)){
              if (oldElement.vnode.props[key] != newElement.vnode.props[key]) {
                HTMLElementSetAttribute(oldElement, newElement.vnode, key);
              }
            } else {
              HTMLElementSetAttribute(oldElement, newElement.vnode, key);
            }
          }
        } else {
          for (let key in oldElement.vnode.props) {
            if (newElement.vnode.props.hasOwnProperty(key)) {
              if (oldElement.vnode.props[key] != newElement.vnode.props[key]) {
                HTMLElementSetAttribute(oldElement, newElement.vnode, key);
              }
            } else {
              HTMLElementDeleteAttribute(oldElement, newElement.vnode, key);
            }
          }
        }
      }
    
    //-------------Изменение детей элементов-------------------

    if (
      typeof newElement.vnode.children == "object" &&
      typeof oldElement.vnode.children == "object"
    ) {
      // ситуация когда детей в объекте одинаково
      if (
        newElement.vnode.children.length == oldElement.vnode.children.length
      ) {
        for (let i = 0; i < newElement.vnode.children.length; i++) {
          if (oldElement?.children[i] && newElement?.children[i]) {
              Path(oldElement.children[i], newElement.children[i]);
            
            //  Path(createElement(oldElement.vnode.children[i]),createElement(newElement.vnode.children[i]))
          
          } else {
            console.dir(
              Error(
                "нет детей в старом:" +
                  oldElement.children[i] +
                  " или в новом " +
                  newElement.children[i]
              )
            );
          }
        }
      }
      // ситуация когда в новом объекте больше детей чем в старом
      if (newElement.vnode.children.length > oldElement.vnode.children.length) {
        if (oldElement.vnode.children.length > 0) {
          let n = 0;
          for (let i = 0; i < oldElement.vnode.children.length; i++) {
            // if(oldElement.children[i]?.vnode) {let oldE:ElementVnode = oldElement.children[i]}

            Path(oldElement.children[i], newElement.children[i]);
            // Path(createElement(oldElement.vnode.children[i]),createElement(newElement.vnode.children[i]))
            n = i;
          }
          for (let i = n + 1; i < newElement.vnode.children.length; i++) {
            oldElement.append(createElement(newElement.vnode.children[i]));
          }
        } else {
          // когда в старом нет ни одного элемента
          for (let i = 0; i < newElement.vnode.children.length; i++) {
            oldElement.append(createElement(newElement.vnode.children[i]));
          }
          oldElement.vnode.children = newElement.vnode.children;
        }
      }
      // Ситуация когда в новом объекте меньше детей чем старом
      if (newElement.vnode.children.length < oldElement.vnode.children.length) {
        if (newElement.vnode.children.length > 0) {
          let n = 0;
          for (let i = 0; i < newElement.vnode.children.length; i++) {
            Path(oldElement.children[i], newElement.children[i]);
            // Path(createElement(oldElement.vnode.children[i]),createElement(newElement.vnode.children[i]))
            n = i;
          }
          for (let i = n + 1; i < oldElement.vnode.children.length; i++) {
            oldElement.children[n + 1].remove();
          }
        } else {
          // когда в новом нет ни одного элемента
          for (let i = 0; i < oldElement.vnode.children.length; i++) {
            oldElement.children[0].remove();
          }
        }
      }
      oldElement.vnode.children = newElement.vnode.children;
    }
    //  ситуация которой старых детей не обнаружно

    if (typeof oldElement.vnode.children == "undefined" &&typeof newElement.vnode.children == "object") {
        for (let i = 0; i < newElement.vnode.children.length; i++) {
          oldElement.append(createElement(newElement.vnode.children[i]));
        }
      oldElement.vnode.children = newElement.vnode.children;
    }
    //  ситуация в которой новых детей не обнаружено, а старые присутствуют
    if ( typeof newElement.vnode.children == "undefined" && typeof oldElement.vnode.children == "object") {
      for (let i = 0; i < oldElement.vnode.children.length; i++) {
        oldElement.children[0].remove();
      }
      oldElement.vnode.children = newElement.vnode.children;
    }
  } else {
    oldElement.parentElement.append(newElement);
    oldElement.remove();
    return newElement;
  }
  return oldElement;
}

// Дом класс
export class DOM {
  root: any;
  innerHTML: any;
  virtual_node_render: any;
  State: object;
  get_content: any;
  Options: any | undefined;
  after: Function | null;
  constructor(config:string|HTMLElement|null = null, Options?: any | undefined) {
    this.root = this.config(config);
    this.innerHTML;
    this.State = {};
    this.Options = this.default(Options);
    this.after = null;
  }
  private config(config:string|HTMLElement|null){
    if(config && typeof config == 'string'){
      return document.querySelector(config)
    }
      return config
    }


  private default(Options?: any) {
    let Options_default: any = {
      update: false,
    };

    if (Options) {
      for (let key in Options) {
        if (Options[key] != Options_default[key]) {
          Options_default[key] = Options[key];
        }
      }
    }

    return Options_default;
  }

  set render(render: any) {
    this.virtual_node_render = render;
    this.innerHTML = createElement(render());
    //    console.log(this.root)
    if (this.root != undefined && this.root != null) {
      if (this.Options.update === true) {
        if (this.root.children) {
          for (let i = 0; i < this.root.children.length; i++) {
            this.root.children[i].remove();
          }
        }
      }
      this.root.append(this.innerHTML);
    }
    if (this.after) this.after();
  }
  rerender(vnode?: any) {
    if (vnode) {
      Path(this.innerHTML, createElement(vnode));
    } else {
      // console.log(this.virtual_node_render())
      Path(this.innerHTML, createElement(this.virtual_node_render()));
    }
  }
  delete() {
    this.innerHTML.remove();
  }
}
