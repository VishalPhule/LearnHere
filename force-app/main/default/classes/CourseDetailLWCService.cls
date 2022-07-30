public with sharing class CourseDetailLWCService {

    @AuraEnabled(cacheable=true)
    public static Course__c fetchCourseDetails(String recordId){
        Course__c courseRecord = new Course__c();
        try {
            courseRecord = [
                    SELECT Id,Name,Name__c,CourseOrganizer__c, CourseOrganizer__r.Name,CourseOrganizer__r.Email__c,
                            CourseOrganizer__r.Company__c,CourseOrganizer__r.Short_Intro__c,CourseOrganizer__r.CourseOrganizerImageUrl__c,
                            CourseDetails__c, Location__c, Location__r.Name,Location__r.City__c,Location__r.Country__c,
                            Location__r.PostalCode__c,Location__r.State__c,Location__r.Street__c ,StartDateTime__c,
                            EndDateTime__c, Recurring__c, MaxSeats__c, Live__c, 
                            PeopleAttending__c, RemainingSeats__c 
                    FROM Course__c
                    WHERE Id =: recordId
                    WITH SECURITY_ENFORCED
                            ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return courseRecord;
    }

    @AuraEnabled(cacheable=true)
    public static List<CourseTrainer__c> fetchTrainerDetails(String courseId){
        List<CourseTrainer__c> trainers = new List<CourseTrainer__c>();
        try {
        trainers   = [SELECT Id, Course__c, Trainer__c, Trainer__r.Name, 
                        Trainer__r.AboutMe__c, Trainer__r.TrainerImageUrl__c,
                        Trainer__r.Company__c
                        FROM CourseTrainer__c
                        WHERE Course__c =: courseId
                        WITH SECURITY_ENFORCED
                    ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return trainers;
    }

    // @AuraEnabled(cacheable=true)
    // public static List<Event_Attendee__c> fethRsvpList(String eventId){
    //     List<Event_Attendee__c> attendees = new List<Event_Attendee__c>();
    //     attendees = [SELECT Id, Event__c 
    //                     FROM  Event_Attendee__c 
    //                     WHERE Event__c =: eventId 
    //                     AND   Attendee__r.User__c =: UserInfo.getUserId()
    //                 ];
    //     return attendees;
    // }
}