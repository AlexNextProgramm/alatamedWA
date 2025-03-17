import { ExhiDOM, canvas, div, h1, h2, img, vnode } from "../../../../library/exhibit/exhibit";
import '../../../../CSS/postcard.scss'

export function info_sample(){
    const block = new ExhiDOM('form-edit')
    let d = new Date().getDate()
    let m = new Date().getMonth() + 1
     const ArrayFirework:Array<vnode> = []

        for(let i = 0; i < 39; i++){
            ArrayFirework.push(div({className:'c'}))
        }



if(m == 3 && d == 8 ){
    setTimeout(()=>{
       block.render(()=>{return div({className:'form-edit deactive'})}) 
    }, 15000)


    block.render(()=>{
        return div({className:'form-edit postcard'},
        [
            div([
              
                div({className:'werh'},[
                    img({src:require('./../../../../images/whatsApp/fireworks-11.gif')})
                ]),
                div({className:'niz'},[
                    img({src:require('./../../../../images/whatsApp/fireworks-11.gif')})
                ])
            ]),
            div({className:'text'},
            [
                h1('От всего сердца поздравляем вас с первым весенним праздником – Международным женским днем 8 Марта!'),
                h1('От всей души желаем вам крепкого здоровья, счастья, успехов во всех начинаниях, мира и спокойствия в семье! '),
                h1('Пусть близкие и друзья окружают вниманием и в будни, и в праздники.')
            ]),
            div({className:'wrap'}, 
            [
                div({className:'firework'}, ArrayFirework),
                div({className:'firework'}, ArrayFirework),
                div({className:'firework'}, ArrayFirework),
                div({className:'firework'}, ArrayFirework),
                div({className:'firework'}, ArrayFirework)
            ]),
            div({className:'card-header'},
            [
                h1("Марта")
            ])
        ])
    })
}

}





