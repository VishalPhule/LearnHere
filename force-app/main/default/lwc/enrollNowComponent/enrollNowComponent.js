import { api, LightningElement, track, wire } from 'lwc';

import doEnroll from '@salesforce/apex/EnrollNowLWCService.doEnroll';
//import fetchUserDetails from '@salesforce/apex/EnrollNowLWCService.fetchUserDetails';

export default class enrollNowComponent extends LightningElement {

    //@track
    __enrollData = {};
    // __isSpinner = false;

    @api courseId;

    // @wire(fetchUserDetails)
    // wiredData({ error, data }) {

    //     if (data) {
    //         this.__enrollData['Name'] = data.Name;
    //         this.__enrollData['Email__c'] = data.Email;
    //         this.__enrollData['Title__c'] = data.Title;
    //         this.__enrollData['Company_Name__c'] = data.CompanyName;
    //     } else if (error) {
    //         console.error('Error:', error);
    //     }
    // }

    handleChange(course) {
        const fieldName = course.target.name; // Name of the input field
        const fieldValue = course.target.value; // value of the input field - Amit Singh
        this.__enrollData[fieldName] = fieldValue;
    }

    validateInput() {
        const inputFields = this.template.querySelectorAll('lightning-input');
        let isValid = true;
        inputFields.forEach(field => {
            if (field.reportValidity() === false) {
                isValid = false;
            }
        });
        return isValid;
    }

    handleClick(course) {
        course.preventDefault();
        if (this.validateInput()) {
            // make the call to apex class

            this.__isSpinner = true;

            doEnroll({
                params: JSON.stringify(this.__enrollData),
                courseId: this.courseId
            })
                .then(result => {
                    console.log('Result \n',result);
                    alert('Enrolled SucessFully');
                    this.dispatchEvent(new CustomEvent('success'));
                })
                .catch(error => {
                    console.error('Error: \n ', error);
                })
                .finally(() => {
                    this.__isSpinner = false;
                });
        }
    }

    handleCancel(course) {
        course.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

}