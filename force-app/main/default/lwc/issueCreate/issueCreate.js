import { LightningElement,wire, api, track } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

//Get Obejct and field metadata to generate form
//This is done to make sure object is not deleted and has a dependency on this lwc
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
    @track showUploadFileDialog = false;
    @track newIssueRecordId;

    @track fileUploadButtonClicked = false;

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
        //Parse URL for info like object name, record id, path (if applicable)
        this.updateRecordInfoFromUrl();
    };

    //allowed file formats when uploading screenshots via lightning file upload
    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    //Process URL
    updateRecordInfoFromUrl(){
        //If obejctApiName and/or recordId is in URL then use that for Reported_Object__c, Reported_Record__c and URL__c fields
        if(typeof(this.pageRef) !== 'undefined' && typeof(this.pageRef.attributes) !== 'undefined'){
            if(typeof(this.pageRef.attributes.objectApiName) !== 'undefined'){
                this.objectApiName = this.pageRef.attributes.objectApiName;
            }
            if(typeof(this.pageRef.attributes.recordId) !== 'undefined'){
                this.recordId = this.pageRef.attributes.recordId;
            }
        }
        this.pageUrlPath = window.location.pathname;
    }

    //Submit form
    //We overwrite it as we want to update Reported obejct, record and url fields to latest values
    //These values can change because our app can be in console and tabs can change
    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;

        //Update RecordId, ObjectAPIName based on URL in case URL has changed in console
        //There is no way to track URL changes as there is no API and component doesn't re-render in Utility Bar
        //Update field data with new values before submitting form
        this.updateRecordInfoFromUrl();
        fields.Reported_Object__c = this.objectApiName;
        fields.Reported_Record__c = this.recordId;
        //Get Latest Path Name
        fields.URL__c = this.pageUrlPath;
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSubmitAndUploadFileButton(event){
        //Do not use event.preventDefault()
        //We want default form submit handler to run after this'
        //All we needed here was to set the flag to show file dialog after record create

        //This separate field is used so that file upload button is not displayed until record is created
        this.fileUploadButtonClicked = true;
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

    //use this if Issue record has been created successfully
    handleCreated(event) {
        //If "Create Issue and Upload Screenshot" button has been clicked then we can use this flag to show file dialog after Issue has been crated
        if(this.fileUploadButtonClicked){
            this.showUploadFileDialog = true;
        }
        this.newIssueRecordId = event.detail.id;
        //Reset the form so we can enter more data for next issue; if needed
        this.handleResetFields();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'New issue was successfully created',
                variant: 'success'
            })
        );
    }
    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        if(event.detail.files.length > 0){
            //Make sure to reset file dialog flags because user may create another issue but only click "Create Issue" button this one
            //We don't want to show file dialog in that scenario
            this.handelCancelFileUploadButton();

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'File was successfully uploaded and attached to the issue',
                    variant: 'success'
                })
            );
        }
    }
    //Reset File upload flags if cancel file dialog button is clicked
    //We don't want to show file dialog again until file upload button has been clicked again
    handelCancelFileUploadButton(event){
        this.showUploadFileDialog = false;
        this.fileUploadButtonClicked = false;
    }

    handleError(event) {
        //Error happened so we will make sure file dialog doesn't open again 
        //user can click that button again if they want to upload screenshot
        this.handelCancelFileUploadButton();
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Some error occured',
                message: event.detail.detail,
                variant: 'error'
            })
        );
    }
}