import { ExhiDOM, btn, div, h4, p} from "../../../library/exhibit/exhibit";
import { instruct } from "./instruction";

export function footer(instructionBreack:Function){
    const footer = new ExhiDOM('footer')
    footer.render(()=>{
        return div({className:'footer'},
                  [
                    div({className:'block-footer center'},
                        [
                         btn({className:'btn-href', onclick:instructionBreack}, 'Инструкция'),
                         p({className:'italic'},'По техническим вопросам обращайтесь в отдел <strong>маркетинга</strong>'),
                        ]),

                        div({className:'block-footer '}, 
                            [
                                // p({className:'italic'},'По техническим вопросам обращайтесь в отдел <strong>маркетинга</strong>'),
                                p({className:'italic'},'г. Одинцово ул. Верхне-Пролетарская д.5'),
                                p({className:'italic'},'© 2023 ООО «Альтамед+».')
                            
                            ])
                  ])
    })
}