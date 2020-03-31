import { LightningElement, wire, track, api } from 'lwc';  
import getIssueList from '@salesforce/apex/IssueBox.getIssueList';  
import getIssueCount from '@salesforce/apex/IssueBox.getIssueCount';  
import { refreshApex } from '@salesforce/apex';



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
    localCurrentPage = this.currentpage;

    //Sending totalrecords as we want wire to refresh when this number changes
    //Without it, it will not refreshbecause other variables may stay the same
    @wire(getIssueList, { pageNumber: '$currentpage', pageSize: '$pagesize', totalRecords: '$totalrecords' })
    wiredIssueList(value) {
        this.wiredIssueListPointer = value; 
        const { error, data } = value;
        if (data) {
            this.issues = [];//Remove old rows and add new rows
            for(var i = 0; i < data.length; i++){
                let urlUid = (typeof(data[i].issuebox__Assigned_To__c) != 'undefined')?'/'+data[i].issuebox__Assigned_To__c:'';
                let assignedToName = (typeof(data[i].issuebox__Assigned_To__r) != 'undefined')?data[i].issuebox__Assigned_To__r.Name:'';
                this.issues.push({
                    'id': data[i].Id, 'name': data[i].Name, 
                    'urlId': '/'+data[i].Id, 'urlUid': urlUid,
                    'status': data[i].issuebox__Status__c, 'type': data[i].issuebox__Type__c,
                    'priority': data[i].issuebox__Priority__c, 'assignedto': assignedToName,
                    'details': data[i].issuebox__Details__c,
                });
            }
            /**/
            this.error = undefined;  
        } else if (error) {
            this.error = error;  
            this.issues = []; 
        }
    }
    @wire(getIssueCount)
    wiredIssueCount(value) {
        this.wiredIssueCountPointer = value; 
        const { error, data } = value;

        //Checking for =0 because it's possible that all records were deleted
        //So if it's 0 then we need to refresh the list to remove all the records
        if (typeof(error) == 'undefined' && data >= 0) {
            this.totalrecords = data;  
            if (!isNaN(data) && data >= 0) {  
                this.totalpages = Math.ceil(data / this.pagesize);
            } else { 
                this.totalpages = 0;  
                this.totalrecords = 0;  
            }
        } else if (error) {
            this.error = error; 
            this.totalrecords = 0;  
        }
    }
   
    getLatest(){
        //Reset to page#1 on refresh
        //Scenario: User maybe on a later page but records get deleted (or ownership changed for a particular user)
        //In that scenario, it may show empty page because there are no records for that page; hence reset to first 1st page (to show at leaset some records)
        
        this.currentpage = 1;

        //Because this.totalrecords will change in this wire, the other wired method for records will automatically refresh
        refreshApex(this.wiredIssueCountPointer);
    }
  
    handlePrevious() {  
        if (this.currentpage > 1) {  
            this.currentpage = this.currentpage - 1; 
        } 
    }  
    handleNext() {  
        if (this.currentpage < this.totalpages)  {
            this.currentpage = this.currentpage + 1; 
        }
    }  
    handleFirst() {
        if(this.currentpage !== 1){
            this.currentpage = 1;  
        }
    }  
    handleLast() {  
        if(this.classList !== this.totalpages){
            this.currentpage = this.totalpages; 
        }
    }
}