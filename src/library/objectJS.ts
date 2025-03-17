export function shuffle(array:any){
    array.sort(()=>Math.random() - 0.5)
    return array
}
export function Age(age:number){
    let g = String(age)
    
   if(age == 1 || g.length == 2 && Number(g[1]) == 1 && Number(g) > 20) return age + ' год'
   if(age > 1 && age < 5 || g.length == 2 && Number(g[1]) > 1 && Number(g[1]) < 5 && Number(g) > 20) return age + ' года'
   if(age >= 5 && age < 21 ||  g.length == 2 && Number(g[1]) > 4 && Number(g) > 24 ) return age + ' лет'
   if(age > 5 && age < 21 ||  g.length == 2 && Number(g[1]) == 0 && Number(g) > 24 ) return age + ' лет'
}
export function ots(age:number){
    let g = String(age)
    if(age == 0) return 'Нет Отзывов'
   if(age == 1 || g.length == 2 && Number(g[1]) == 1 && Number(g) > 20) return age + ' Отзыв'
   if(age > 1 && age < 5 || g.length == 2 && Number(g[1]) > 1 && Number(g[1]) < 5 && Number(g) > 20) return age + ' Отзыва'
   if(age > 5 && age < 21 ||  g.length == 2 && Number(g[1]) > 4 && Number(g) > 24 ) return age + ' Отзывов'
   if(age > 5 && age < 21 ||  g.length == 2 && Number(g[1]) == 0 && Number(g) > 24 ) return age + ' Отзывов'
}
