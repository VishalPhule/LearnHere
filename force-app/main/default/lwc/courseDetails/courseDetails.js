import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import getTrainers from '@salesforce/apex/CourseDetailsController.getTrainers'
import getLocationDetails from '@salesforce/apex/CourseDetailsController.getLocationDetails';
import getAttendees from '@salesforce/apex/CourseDetailsController.getAttendees';
const columns = [
    {
        label: 'Name', fieldName: 'Name',
        cellAttributes: {
            iconName: 'Standard:user',
            iconPosition: 'left',
        },
    },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Company Name', fieldName: 'CompanyName' },
];

const columnsAtt = [
    {
        label: "Name",
        fieldName: "Name",
        cellAttributes: {
            iconName: "standard:user",
            iconPosition: "left"
        }
    },
    { label: "Email", fieldName: "Email", type: "email" },
    { label: "Company Name", fieldName: "CompanyName" },
    {
        label: "Location",
        fieldName: "Location",
        cellAttributes: {
            iconName: "utility:location",
            iconPosition: "left"
        }
    }
];



export default class courseDetails extends NavigationMixin(LightningElement) {
    @api recordId;
    @track trainerList;
    @track courseRec;
    @track attendeesList

    errors;
    columnsList = columns;
    columnAtt = columnsAtt;

    connectedCallback() { }

    handleTrainerActive() {
        getTrainers({
            courseId: this.recordId
        })
            .then((result) => {
                result.forEach((trainer) => {
                    trainer.Name = trainer.Trainer__r.Name;
                    trainer.Email = "*********@gmail.com";
                    trainer.Phone = trainer.Trainer__r.Phone__c;
                    trainer.TrainerImageUrl__c = trainer.Trainer__r.TrainerImageUrl__c;
                    trainer.AboutMe__c = trainer.Trainer__r.AboutMe__c;
                    trainer.CompanyName = trainer.Trainer__r.Company__c;
                });
                this.trainerList = result;
                window.console.log(" result ", this.result);
                this.errors = undefined;
            })
            .catch((err) => {
                this.errors = err;
                this.trainerList = undefined;
                //  window.console.log(" err ", this.errors);
            });
    }


    handleLocatioDetails() {
        getLocationDetails({
            courseId: this.recordId
        })
            .then((result) => {
                if (result.Location__c) {
                    //window.console.log(result.Location__c);
                    this.courseRec = result;
                } else {
                    this.courseRec = undefined;
                }
                this.errors = undefined;
                //  window.console.log(" result ", this.result);
            })
            .catch((err) => {
                this.errors = err;
                this.trainerList = undefined;
                //   window.console.log(" err ", this.errors);
            });
    }
    handleCourseAttendee() {
        getAttendees({
            courseId: this.recordId
        })
            .then((result) => {
                result.forEach((att) => {
                    //   window.console.log(att.Attendee__r.Name);
                    att.Name = att.Attendee__r.Name;
                    att.Email = "*********@gmail.com";
                    att.CompanyName = att.Attendee__r.Company_Name__c;
                    if (att.Attendee__r.Address__c) {
                        att.Location = att.Attendee__r.Address__r.Name;
                    } else {
                        att.Location = "Preferred Not to Say";
                    }
                });

                //window.console.log(" result ", result);
                this.attendeesList = result;
                //window.console.log(" attendeesList ", this.attendeesList);
                this.errors = undefined;
            })
            .catch((err) => {
                this.errors = err;
                this.trainerList = undefined;
            });
    }
    createTrainer() {
        const defaultValues = encodeDefaultFieldValues({
            Course__c: this.recordId
        });
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "CourseTrainer__c",
                actionName: "new"
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
    createAttendee() {
        const defaultValues = encodeDefaultFieldValues({
            Course__c: this.recordId
        });
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "CourseAttendee__c",
                actionName: "new"
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
}