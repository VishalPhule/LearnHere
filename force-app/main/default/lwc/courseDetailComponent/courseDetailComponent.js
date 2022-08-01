import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchCourseDetails from '@salesforce/apex/CourseDetailLWCService.fetchCourseDetails';
import fetchTrainerDetails from '@salesforce/apex/CourseDetailLWCService.fetchTrainerDetails';
import fetchUserName from '@salesforce/apex/UserUtility.fetchUserName';
import fethEnrollList from '@salesforce/apex/CourseDetailLWCService.fethEnrollList';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CourseDetailComponent extends NavigationMixin(LightningElement) {

    @api courseId;
    @api source;
    __CurrentPageReference;

    // Variable to show the Spinner
    isSpinner = false;

    // Variable to store Course Details
    __trainers;
    __courseDetails;
    __errors;
    __enrollCompleted = false;

    // Variable to Display the location Map
    //@track __mapMarkers = [];

    // Variable for to show/hide Enroll button
    __showEnrollButton = false;
    @api __enrollCompleted = false;

    // Variable to show  Modal
    __showModal = false;
    __showContactModal = false;


    @wire(fetchUserName)
    wireData({ error, data }) {
        if (data) {
            // console.log('User Name \nn', data);
            if (data.includes('Site Guest User')) {
                this.__showEnrollButton = false;
            }
            else {
                this.__showEnrollButton = true;
            }
        }
        else if (error) {
            console.error("error", error);
        }
    }

    @wire(CurrentPageReference)
    getCurrentPageReference(PageReference) {
        this.__CurrentPageReference = PageReference;
        this.courseId = this.__CurrentPageReference.state.courseId;
        this.source = this.__CurrentPageReference.state.source;
        this.fetchCourseDetailsJS();
        this.fetchTrainerDetailsJS();
        this.fethEnrollListJs();
    }

    
    fethEnrollListJs() {
        fethEnrollList({ courseId: this.courseId })
            .then(result => {
                console.log('Result \n', result);
                if (result && result.length > 0) {
                    this.__enrollCompleted = true;
                }
            })
            .catch(error => {
                console.log('error', error);
            })
    }


    fetchCourseDetailsJS() {
        this.isSpinner = true;
        fetchCourseDetails({
            recordId: this.courseId
        })
            .then(result => {
                console.log('Result', result);
                this.__courseDetails = result;
                if (this.__eventDetails.Location__c) {
                    this.__mapMarkers.push({
                        location: {
                            City: this.__courseDetails.Location__r.City__c,
                            Country: this.__courseDetails.Location__r.Country__c,
                            PostalCode: this.__courseDetails.Location__r.Postal_Code__c,
                            State: this.__courseDetails.Location__r.State__c,
                            Street: this.__courseDetails.Location__r.Street__c
                        },
                        title: this.__courseDetails.Name__c,
                        description: 'This is the landmark for the location'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.__errors = error;
            })
            .finally(() => {
                this.isSpinner = false;
            });
    }

    fetchTrainerDetailsJS() {
        this.isSpinner = true;
        fetchTrainerDetails({ courseId: this.courseId })
            .then(result => {
                console.log('Result', result);
                this.__trainers = result;
            })
            .catch(error => {
                console.error('Error:', error);
                this.__errors = error;
            })
            .finally(() => {
                this.isSpinner = false;
            });
    }


    handleEnroll() {
        this.__showModal = true;
    }


    // showing toast message after success of enrolling
    handleEnrollSucess(event) {
        alert('You have Sucessfully Enolled for the Course');
        event.preventDefault();
        this.__showModal = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Sucess',
            message: 'You are sucessfully registered for the Course',
            variant: 'Sucess'
        }));
        this.__enrollCompleted = true;
    }

    handleCancel() {
        this.__showModal = false;
    }

    handleContactUs() {
    }

    handleLoginRedirect() {
        let navigationTarget = {
            type: 'comm__namedPage',
            attributes: {
                name: "Login"
            }
        }
        alert('Login to site to Enroll the Course');
    }
}