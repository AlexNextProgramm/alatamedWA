
export function animation_scroll(){
    function onEntry(entry:any) {
        entry.forEach((change: { isIntersecting: any; target: { classList: { add: (arg0: string) => void; }; }; }) => {
          if (change.isIntersecting) {
           change.target.classList.add('element-show');
          }
        });
       
      }
  let options = {
    threshold: [0.5] };
  let observer = new IntersectionObserver(onEntry, options);
  let elements:any = document.querySelectorAll('.animation-scroll');
  
  for (let elm of elements) {
    observer.observe(elm);
    
  }
}

