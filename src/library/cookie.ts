


export function get_cookie ( name:string ){
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
}




export function set_Cookie(name:string, value:string , options:any={} ) {

  options = {
    path: '/',
    SameSite:'Lax',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


export function delete_Cookie(name:string) {
  set_Cookie(name, "", {
    'max-age': -1
  })
}
// interface my_cookie{
//   id:string|undefined
// }
export let my_cookie = new Proxy({
    id:get_cookie('id'),
    name:get_cookie('name'),
    email:get_cookie('email'),
    telefone:get_cookie('telefone'),
    date_entry:get_cookie('date'),
    interval:get_cookie('interval'),
    service_title:get_cookie('service_title'),
    price_entry:get_cookie('price'),
    time_entry:get_cookie('time'),
},{
   set:function(target:any, prop:string, value){
    if(prop=='id'){
      if(value){
        set_Cookie('id', value, {expires:new Date(new Date().getFullYear() + 1 +'-01-01')})
      // тут 
      }else{
        delete_Cookie('id')
      }
    }else{
      set_Cookie(prop, value, {expires:new Date(new Date().getFullYear() + 1 +'-01-01')})
    }
      target[prop] = value
      return true
    },


  get:function(target,prop:string){
    if(prop=='id'){
      // if(get_cookie(prop))  // тут
    }
    return get_cookie(prop)
  }
  
})