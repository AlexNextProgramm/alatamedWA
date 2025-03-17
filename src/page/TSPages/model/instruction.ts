import { ExhiDOM, body, btn, button, div, h1, h2, h4, img, li, p, showElement, ul } from "../../../library/exhibit/exhibit";
const imgAlta = require('../../../images/whatsApp/logo.jpg')
import '../../../CSS/instuction.scss'
export function instruct(render:Function){

    const instruct  = new ExhiDOM('panel')
    instruct.InQueue = [
       
    ]
    instruct.render(()=>{
      return  div({className:'panel'},
                 [
                    div({className:'tag-panel'}, 
                    [
                        h4('Навигация'),
                        btn({className:'tag-btn', onclick:()=>render()}, 'Назад'),
                        p('<br>'),
                        btn({className:'tag-btn', onclick:()=>showElement('nalog')}, 'Налоговый вычет')
                    ]),

                    div({className:'global-block'},
                    [
                        h1('Руководство пользователя Web-приложения "Альтамед WhatsApp" <br><br> '),
                        h2('Авторизация'),
                        p(`Авторизуемся только по номеру телефона. 
                            Вводим пароль который прислали вам в ватсап. 
                            Колл-центр выбирает права доступа "Администратора".` ),
                        p(`<strong>Вам создали учетную запись, но вы не можете найти пароль введите любой пароль появиться кнопка востановить и запросите новый пароль в WhatsApp </strong>`),
                        p('<br><br>'),
                        img({src:require('../../../images/инструкции_1.jpg')}),
                        p('<br><br>'),
                        p('При первом входе вам предложат сменить пароль. Придумайте пароль не менее 6 символов, которыq будет содержать латинские буквы и цифры. <br><br>'),
                        img({src:require('../../../images/инструкции_2.jpg')}),
                        p('<br><br>'),
                        h2('Рабочая панель'),
                        p('<br><br>'),
                        p(`Рабочая панель состоит из 3 частей. Левая чать панель формы ввода телефона, сообщения и выбора клиники. 
                            Центральная - кнопки выбора шаблона сообщения ( от типа шаблона сообщения, количество полей ввода может меняться ),
                        `),
                        p(` При клике на знак вопроса в кнопке в правом углу появиться контекст (шаблон) сообщения`),
                        p(` Для каждой клиники свои кнопки шаблонов сообщения! <br>`),
                        p(`<strong> Внимание!!! Не забывайте менять клинику! При отпрваке сообщения от имени другой клиники вы можете ввести в заблуждение пациента </strong> <br><br>`),
                        img({src:require('../../../images/инструкции_3.jpg')}),
                        p('<br><br>'),
                        h2('Панель статусы'),
                        p('<br><br>'),
                        p(` В панели статусов вы можете  посмотреть ваши отправленные сообщения `),
                        p(` В теле сообщения указываеться Имя кнопки (Название шаблона ), телефон пациента, время. `),
                        p('<br><br>'),
                        img({src:require('../../../images/инструкции_4.jpg')}),
                        p('<br><br>'),
                        p(`<strong>Значёк обновить</strong> будет только в сообщениях в которых еще можно получить конечный статус`),
                        p(`При нажатии на сообщение с таким значком идет запрос на обновления статуса`),
                        p('<br><br>'),
                        img({src:require('../../../images/инструкции_5.jpg')}),
                        p('<br><br>'),
                        h2({id:'nalog'},'Налоговый вычет'),
                        p('Настоящий регламент разработан с целью соблюдения общих правил выдачи справок для налогового вычета администраторами клиник.'),
                        p('Регламент является обязательным для исполнения администраторами во указанных подразделениях сети клиник «Альтамед+».'),
                        h4('Правила получения Заявки на налоговый вычет'),
                         p('<br><br>'),
                        p('Пациент подает Заявку на налоговый вычет на нашем сайте altamedplus.ru (раздел "О нас - налоговый вычет"), где ей присваивается порядковый номер.'),
                         p('<br><br>'),
                        p('<strong>Заявка на налоговый вычет сразу поступает:</strong>'),
                        ul([
                            li('Клиника Альтамед+ nalog@altamed-plus.ru'),
                            li('Клиника Одинмед koms@altamed-plus.ru'),
                            li('Клиника Одинмед + и Верхне-Пролетарская  nedelina@altamed-plus.ru'),
                            li('Клиника Дубки -Альтамед dubki@altamed-plus.ru.')
                        ]),
                        p('<br>'),
                         p('<strong>в систему быстрых сообщений wa.altamedplus.ru в разделе "Налоговый  вычет"</strong>'),
                         p('<br><br>'),
                         p('Администраторы клиник ежедневно с 15.00 до 20.00 проводят проверку Заявок и формирование справок на налоговый вычет.'),
                         p('<br> Каждая клиника отражается в модуле определенным цветом: <br>'),
                         ul([
                            li('Клиника Альтамед+ - голубой'),
                            li('Клиника Одинмед - фуксия'),
                            li('Клиника Одинмед + оранжевый'),
                            li('Верхне-Пролет. - фиолетовая'),
                            li('Клиника Дубки -Альтамед – зеленый')
                        ]),
                         p('<br><br>'),
                         p('<strong>Зведочкой</strong> помечается <strong>клиника, где Пациент получает Справку</strong> на налоговый вычет.'),
                         p('<br>Администратор нажимает кнопку «Взять  в работу» и Статус Заявки обновляется <strong>«В работе»</strong>.'),
                         p('<br>Далее, Администратор формирует <strong>Справку на налоговый вычет</strong> в МИС «Инфоклиника», сохраняет ее и <strong>Договор</strong> на оказание платных медицинских услуг на компьютер <strong>в Папку «Налоговый вычет»</strong> в формате <strong>PDF</strong>'),
                         p('<br>Открывается Окно <strong>«Загрузка файлов»</strong>, куда Администратор загружает  <strong>Справку и Договор в формате PDF</strong>'),
                         p('<br>Далее, нажимаем на кнопку <strong>«Закрыть заявку»</strong> и кнопка меняется на Статус <strong>«Исполнена»</strong>'),
                         p('<br>Когда все клиники отработали Заявку  на налоговый вычет появляется Оранжевые  кнопки <strong>«Печатать все», «Отправить в ватсап», «Выдать»</strong>. После этого у Пациента меняется статус <strong>Заявки на «Готово к выдаче»</strong> цвет заявки поменяеться на бледно голубой'),
                         p('<br>Распечатка и выдача полного пакета документов для получения Налогового вычета производится во время прихода Пациента в клинику для получения документов.'),
                         p('<br>Распечатка и выдача полного пакета документов для получения Налогового вычета производится во время прихода Пациента в клинику для получения документов.'),
                         p('<br>Получение документов для налогового вычета производится в любой из клиник сети Альтамед + по выбору Пациента.'),
                         p('<br>Готовый комплект документов для налоговой Пациент получает при личном визите в выбранную клинику'),
                         p('<br><strong>При получении документов необходимо предъявить:</strong>'),
                          ul([
                            li('Пациентом-налогоплательщиком - паспорт'),
                            li('Налогоплательщиком/опекуном/доверенным лицом – паспорт  и документы, подтверждающие родство с Пациентом (свидетельство о рождении, свидетельство о браке, копию паспорта Пациента если пациент - родитель)'),
        
                        ]),
                         p('<br><strong>Перед получением документов Получатель обязан расписаться:</strong>'),
                         ul([
                            li('в Заявлении на предоставление справки для налоговых вычетов;'),
                            li('в Корешке к Справке об оплате медицинских услуг;'),
                            li('в Журнале выдачи  Документов для получения Налогового вычета.'),
                        ]),
                        p('После выдачи полного пакета документов необходимо нажать на кнопку «Выдать», и данная заявка станет неактивной поменяет цвет на бледно зеленый.'),
                        p('<br><br>'),
                    ])
                    
                 ])
})
}
