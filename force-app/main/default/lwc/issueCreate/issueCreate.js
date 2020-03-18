import { LightningElement,wire, api, track } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';


import ISSUE_OBJECT from '@salesforce/schema/Issue__c';
import ActualResult_FIELD from '@salesforce/schema/Issue__c.Actual_Result__c';
import Details_FIELD from '@salesforce/schema/Issue__c.Details__c';
import EmailNotification_FIELD from '@salesforce/schema/Issue__c.Email_Notification__c';
import ExpectedResult_FIELD from '@salesforce/schema/Issue__c.Expected_Result__c';
import Priority_FIELD from '@salesforce/schema/Issue__c.Priority__c';
import ReportedObject_FIELD from '@salesforce/schema/Issue__c.Reported_Object__c';
import ReportedRecord_FIELD from '@salesforce/schema/Issue__c.Reported_Record__c';
import ReproSteps_FIELD from '@salesforce/schema/Issue__c.Repro_Steps__c';
import Status_FIELD from '@salesforce/schema/Issue__c.Status__c';
import Type_FIELD from '@salesforce/schema/Issue__c.Type__c';
import URL_FIELD from '@salesforce/schema/Issue__c.URL__c';
/* eslint-disable no-console */

/**
 * Creates Account records.
 */
export default class ItemCreate extends LightningElement {
    @api objectApiName;
    @api recordId;

    @track recordCreated = false;
    @track pageUrlPath = window.location.pathname;

    issueObject = ISSUE_OBJECT;
    actualResultField = ActualResult_FIELD;
    detailsField = Details_FIELD;
    emailNotificationField = EmailNotification_FIELD;
    expectedResultField = ExpectedResult_FIELD;
    priorityField = Priority_FIELD;
    reproStepsField = ReproSteps_FIELD;
    statusField = Status_FIELD;
    typeField = Type_FIELD;
    urlField = URL_FIELD;
    reportedObjectField = ReportedObject_FIELD;
    reportedRecordField = ReportedRecord_FIELD;

    @wire(CurrentPageReference)
    pageRef;
    
    connectedCallback(){
        console.log('this.pageRef', this.pageRef); 
    }

    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        //Get Latest Path Name
        fields.URL__c = this.pageUrlPath = window.location.pathname;
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

   handleResetFields(){
        //Only reset fields which do no have "doNotReset" class assigned
        //This allows us to have fields (like recordId, objectName etc) which should keep their values
        const inputFields = this.template.querySelector('lightning-record-edit-form').querySelectorAll('lightning-input-field:not(.doNotReset)');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleCreated(event) {
        //Reset the form so we can enter more data for next issue; if needed
        this.handleResetFields();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'New issue was successfully created',
                variant: 'success'
            })
        );
        this.dispatchEvent(
            new CustomEvent('issuecreated', { detail: event.detail.id })
        );

    }

    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Some error occured',
                message: event.detail.detail,
                variant: 'error'
            })
        );
    }
}