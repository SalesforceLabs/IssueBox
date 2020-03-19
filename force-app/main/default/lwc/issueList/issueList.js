import { LightningElement, track, api } from 'lwc';  
 import getIssueList from '@salesforce/apex/IssueBox.getIssueList';  
 import getIssueCount from '@salesforce/apex/IssueBox.getIssueCount';  

 const columns = [
    { label: 'Issue No', fieldName: 'urlId', 'initialWidth': 100, 'type': 'url', typeAttributes: { label: { fieldName: 'name' } }},
    { label: 'Status', fieldName: 'status',  'initialWidth': 75 },
    { label: 'Type', fieldName: 'type',  'initialWidth': 120 },
    { label: 'Priority', fieldName: 'priority',  'initialWidth': 100 },
    { label: 'Assigned To', fieldName: 'urlUid',  'initialWidth': 110, 'type': 'url', typeAttributes: { label: { fieldName: 'assignedto' } } },
    { label: 'Details', fieldName: 'details' },
];
const PAGE_SIZE = 10; 
//Pagination sample from https://salesforcelightningwebcomponents.blogspot.com/2019/04/pagination-with-search-step-by-step.html
 export default class RecordList extends LightningElement {  

    @track currentpage = 1;
    @track pagesize = PAGE_SIZE;
    @track issues = Array();
    @track columns = columns;
    @track error;
    @track totalpages;  
    @track totalrecords;
    localCurrentPage = null;

    getIssues(){
        getIssueList({ pagenumber: this.currentpage, pageSize: this.pagesize })  
        .then(records => {
            this.issues = [];//Remove old rows and add new rows
            for(var i = 0; i < records.length; i++){
                let urlUid = (typeof(records[i].Assigned_To__c) != 'undefined')?'/'+records[i].Assigned_To__c:'';
                let assignedToName = (typeof(records[i].Assigned_To__r) != 'undefined')?records[i].Assigned_To__r.Name:'';
                this.issues.push({
                    'id': records[i].Id, 'name': records[i].Name, 
                    'urlId': '/'+records[i].Id, 'urlUid': urlUid,
                    'status': records[i].Status__c, 'type': records[i].Type__c,
                    'priority': records[i].Priority__c, 'assignedto': assignedToName,
                    'details': records[i].Details__c,
                });
            }
            this.error = undefined;  
        })  
        .catch(error => {  
          this.error = error;  
          this.issues = [];  
        });
     }
    getIssuesCount(){
        this.localCurrentPage = this.currentpage;  
        getIssueCount()  
        .then(recordsCount => {  
            this.totalrecords = recordsCount;  
            if (recordsCount !== 0 && !isNaN(recordsCount)) {  
                this.totalpages = Math.ceil(recordsCount / this.pagesize);  
                
                this.getIssues();
            } else {  
                this.issues = [];  
                this.totalpages = 1;  
                this.totalrecords = 0;  
            }  
            const event = new CustomEvent('recordsload', {  
                detail: recordsCount  
            });  
            this.dispatchEvent(event);  
        })  
        .catch(error => {  
            this.error = error;  
            this.totalrecords = undefined;  
        });
    }
    connectedCallback() {
        this.getIssuesCount();
    }  
  
    handlePrevious() {  
        if (this.currentpage > 1) {  
            this.currentpage = this.currentpage - 1;  
            this.getIssues();
        } 
    }  
    handleNext() {  
        if (this.currentpage < this.totalpages)  {
            this.currentpage = this.currentpage + 1;  
            this.getIssues();
        }
    }  
    handleFirst() {
        if(this.currentpage !== 1){
            this.currentpage = 1;  
            this.getIssues();
        }
    }  
    handleLast() {  
        if(this.classList !== this.totalpages){
            this.currentpage = this.totalpages;  
            this.getIssues();
        }
    }
}