public with sharing class AttendeeCourseService {
    @AuraEnabled
    public static List<CourseAttendee__c> upcomingEvets(String attendeeId) {
      List<CourseAttendee__c> eventLists = [
        SELECT
          Id,
          Name,
          Course__c,
          Course__r.Location__c,
          Course__r.Location__r.Name,
          Course__r.CourseOrganizer__c,
          Course__r.CourseOrganizer__r.Name,
          Course__r.Name__c,
          Course__r.StartDateTime__c
        FROM CourseAttendee__c
        WHERE
          Attendee__c = :attendeeId
          AND Course__r.StartDateTime__c >= today
          AND Course__r.Live__c = true
        WITH SECURITY_ENFORCED
      ];
      return eventLists;
    }
  
    @AuraEnabled
    public static List<CourseAttendee__c> pastCourse(String attendeeId) {
      List<CourseAttendee__c> eventLists = [
        SELECT
          Id,
          Name,
          Course__c,
          Course__r.Location__c,
          Course__r.Location__r.Name,
          Course__r.CourseOrganizer__c,
          Course__r.CourseOrganizer__r.Name,
          Course__r.Name__c,
          Course__r.StartDateTime__c
        FROM CourseAttendee__c
        WHERE Attendee__c = :attendeeId AND Course__r.StartDateTime__c < today
        WITH SECURITY_ENFORCED
      ];
      return eventLists;
    }
  }