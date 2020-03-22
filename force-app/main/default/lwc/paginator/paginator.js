import { LightningElement, api, track } from 'lwc';  
 export default class PaginatorBottom extends LightningElement {  
   // Api considered as a reactive public property.  
   @api totalrecords;  
   @api currentpage;  
   @api pagesize;
   @api totalpages; 
   // Following are the private properties to a class.  
   lastpage = false;  
   firstpage = false;  

   // getter  
   get disableFirstButton() {  
     if (this.currentpage <= 1) {  
       return true;  
     }  
     return false;  
   }  
   // getter  
   get disableLastButton() {  
     if (this.totalpages === this.currentpage) {  
       return true;  
     }  
     return false;  
   }  
   //Fire events based on the button actions  
   handlePrevious() {  
     this.dispatchEvent(new CustomEvent('previous'));  
   }  
   handleNext() {  
     this.dispatchEvent(new CustomEvent('next'));  
   }  
   handleFirst() {  
     this.dispatchEvent(new CustomEvent('first'));  
   }  
   handleLast() {  
     this.dispatchEvent(new CustomEvent('last'));  
   }  
 }  