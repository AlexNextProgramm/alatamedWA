import { format_miliseconds } from "../../../Date";
import { atribute } from "../../../HTML";
import { option, select, vnode } from "../../../exhibit/exhibit";
// step ms интервал
export function select_time(start:number, end:number, step:number, activ:number, atribute:atribute):vnode{
    let Array:Array<vnode> = []
    for(start;  start < end; start=start+step){
        if(start == activ){
            Array.push(option({selected:true},format_miliseconds(start)))
        }else{
            Array.push(option(format_miliseconds(start)))
        }
    }
    return select(atribute, Array)
}