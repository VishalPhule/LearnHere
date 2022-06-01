import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchCourseDetails from '@salesforce/apex/CourseDetailLWCService.fetchCourseDetails';
import fetchTrainerDetails from '@salesforce/apex/CourseDetailLWCService.fetchTrainerDetails';

export default class CourseDetailComponent extends LightningElement {

    @api courseId;
    @api source;
    __CurrentPageReference;
    isSpinner = false;

    __trainers;
    __courseDetails;
    __errors;

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
        fetchCourseDetails({ recordId: this.courseId })
            .then(result => {
                console.log('Result', result);
                this.__courseDetails = result;
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

    handleRSVP() {

    }
    handleContactUs() {

    }

}