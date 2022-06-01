trigger CourseAttendeeTrigger on CourseAttendee__c (after insert) {

    if(Trigger.isAfter && Trigger.isInsert){
        CourseAttendeeTriggerHandler.sendConfirmationEmail(Trigger.New);
    }
}