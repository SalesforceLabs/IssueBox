import { LightningElement, wire, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';

import ISSUE_OBJECT from '@salesforce/schema/Issue__c';

const columns = [
    { label: 'Issue No', fieldName: 'urlId', 'initialWidth': 100, 'type': 'url', typeAttributes: { label: { fieldName: 'name' } }},
    { label: 'Status', fieldName: 'status',  'initialWidth': 75 },
    { label: 'Type', fieldName: 'type',  'initialWidth': 120 },
    { label: 'Priority', fieldName: 'priority',  'initialWidth': 100 },
    { label: 'Assigned To', fieldName: 'urlUid',  'initialWidth': 110, 'type': 'url', typeAttributes: { label: { fieldName: 'assignedto' } } },
    { label: 'Details', fieldName: 'details' },
];

export default class WireListView extends LightningElement {
    
    @track issueList = Array();
    @track columns = columns;

    @wire(getListUi, {
        objectApiName: ISSUE_OBJECT,
        listViewApiName: 'All'
    })
    wiredwiredIssueList({ error, data }) {
        if (data) {
            var records = data.records.records;
            console.log(records);
            for(var i = 0; i < records.length; i++){
                this.issueList.push({
                    'id': records[i].id, 'name': records[i].fields.Name.value, 
                    'urlId': '/'+records[i].id, 'urlUid': (records[i].fields.Assigned_To__r.value != null?'/'+records[i].fields.Assigned_To__r.value.id:''),
                    'status': records[i].fields.Status__c.value, 'type': records[i].fields.Type__c.value,
                    'priority': records[i].fields.Priority__c.value, 'assignedto': records[i].fields.Assigned_To__r.displayValue,
                    'details': records[i].fields.Details__c.value,
                });
            }
            console.log(this.issueList);
        } else if (error) {
            this.error = error;
            this.record = undefined;
        }
    }

}