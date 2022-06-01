import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import EVT_OBJECT from '@salesforce/schema/Course__c';
import Name_F from '@salesforce/schema/Course__c.Name__c';
import CourseOrganizer__c from '@salesforce/schema/Course__c.CourseOrganizer__c';
import StartDateTime__c from '@salesforce/schema/Course__c.StartDateTime__c';
import EndDateTime__c from '@salesforce/schema/Course__c.EndDateTime__c';
import MaxSeats__c from '@salesforce/schema/Course__c.MaxSeats__c';
import Location__c from '@salesforce/schema/Course__c.Location__c';
import CourseDetails__c from '@salesforce/schema/Course__c.CourseDetails__c';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddCourses extends NavigationMixin(LightningElement) {

    @track courseRecord = {
        Name: '',
        Event_Organizer__c: '',
        Start_DateTime__c: null,
        End_Date_Time__c: null,
        Max_Seats__c: null,
        Location__c: '',
        Event_Details__c: ''
    }

    @track errors;

    handleChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.courseRecord[name] = value;
        // MaxFIT Campaign
        // Name
        // this.eventRecord[Name] = 'MaxFIT Campaign'
    }
    /*
        Course__c newEvent = new event__c();
        newEvent.Name = '';
        newEvent.Location__c = '098203u84';
    */

    handleLookup(event) {
        let selectedRecId = event.detail.selectedRecordId;
        let parentField = event.detail.parentfield;
        this.courseRecord[parentField] = selectedRecId;
        // selectedRecId = aiwue7836734834
        // Location__c
        // this.eventRecord[Location__c] = selectedRecId;
    }

    handleClick() {
        const fields = {};
        fields[Name_F.fieldApiName] = this.courseRecord.Name;
        fields[CourseOrganizer__c.fieldApiName] = this.courseRecord.CourseOrganizer__c;
        fields[StartDateTime__c.fieldApiName] = this.courseRecord.StartDateTime__c;
        fields[EndDateTime__c.fieldApiName] = this.courseRecord.EndDateTime__c;
        fields[MaxSeats__c.fieldApiName] = this.courseRecord.MaxSeats__c;
        fields[Location__c.fieldApiName] = this.courseRecord.Location__c;
        fields[CourseDetails__c.fieldApiName] = this.courseRecord.CourseDetails__c;
        const courseRecord = { apiName: EVT_OBJECT.objectApiName, fields };

        createRecord(courseRecord)
            .then((courseRec) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Record Saved',
                    message: 'Course Draft is Ready',
                    variant: 'success'
                }));
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        actionName: "view",
                        recordId: courseRec.id
                    }
                });
            }).catch((err) => {
                this.errors = JSON.stringify(err);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error Occured',
                    message: this.errors,
                    variant: 'error'
                }));
            });
    }

    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "Course__c"
            }
        });
    }
}