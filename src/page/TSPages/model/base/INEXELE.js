

export  function EXELFILE(){
   const  table = document.querySelector('table')
   const clonTab = table.cloneNode(table)
   clonTab.querySelectorAll('.message').forEach(element => {
      element.remove()
   });
   clonTab.querySelectorAll('.role-text').forEach(element => {
      element.remove()
   });
   TableToExcel.convert(clonTab)
   
}