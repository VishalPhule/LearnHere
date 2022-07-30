import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchCourseDetails from '@salesforce/apex/CourseDetailLWCService.fetchCourseDetails';
import fetchTrainerDetails from '@salesforce/apex/CourseDetailLWCService.fetchTrainerDetails';
import fetchUserName from '@salesforce/apex/UserUtility.fetchUserName';

import { NavigationMixin } from 'lightning/navigation';

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

    // Variable to Display the location Map
    @track __mapMarkers = [];

    // Variable for to show/hide RSVP button
    __showEnrollButton = false;


    @wire(fetchUserName)
    wireDaata({ error, data }) {
        if (data) {
            console.log('User Name \nn', data);
            if (data.includes('Site Guest User')) {
                this._showEnrollButton = false;
            }
            else {
                this._showEnrollButton = true;
            }
        }
        else if (error) {
            console.error("error", error);
        }
    }

    @wire(CurrentPageReference)
    getCurrentPageReference(PageReference) {
        this.__CurrentPageReference = PageReference;
        // window.console.log('PageReference', this.__CurrentPageReference);
        // window.console.log('state', this.__CurrentPageReference.state);
        // window.console.log('state', this.__CurrentPageReference.state.c__courseId);
        // window.console.log('state', this.__CurrentPageReference.state.courseId);

        this.courseId = this.__CurrentPageReference.state.courseId;
        this.source = this.__CurrentPageReference.state.source;
        this.fetchCourseDetailsJS();
        this.fetchTrainerDetailsJS();
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
        console.log('OUTPUT:', this.eventId);
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
        //   this.__CurrentPageReference.Navigate(navigationTarget);
        alert('Login to site to Enroll the Course');
    }

}