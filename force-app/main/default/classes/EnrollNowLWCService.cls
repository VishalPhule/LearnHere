public without sharing class EnrollNowLWCService {
    
    @AuraEnabled
    public static void doEnroll(String params, String courseId){
        /*
            {
                'Name' : 'Amit Singh',
                'Email__c' : '',
                'Title__c' : '',
                'Company__c' : ''
            }
        */

        Attendee__c attendeeRecord = (Attendee__c)JSON.deserialize(params, Attendee__c.class);

        attendeeRecord.User__c     = UserInfo.getUserId();
        /* Check if the Attendee is already there in the Enroll list */
        String attendeeId = checkAttendee(UserInfo.getUserId());
        try {
            if(String.isBlank(attendeeId)){
                insert attendeeRecord;
                attendeeId = attendeeRecord.Id;
            }else{
                attendeeRecord.Id = attendeeId;
                update attendeeRecord;
            }
            CourseAttendee__c courseAttendeeRecord = new CourseAttendee__c();
            courseAttendeeRecord.Attendee__c = attendeeId;
            courseAttendeeRecord.Course__c    = courseId;
            insert courseAttendeeRecord;
        }catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    private static String checkAttendee(String userId) {
        String attendeeId = '';
        List<Attendee__c> attendeeList = [SELECT Id, User__c FROM Attendee__c WHERE User__c = :userId];
        if(attendeeList != null && attendeeList.size() > 0){
            attendeeId = attendeeList[0].Id;
        }
        return attendeeId;
    }

    // @AuraEnabled(cacheable=true)
    // public static List<CourseAttendee__c> fethRsvpList(String courseId){
    //     List<CourseAttendee__c> attendees = new List<CourseAttendee__c>();
    //     attendees = [SELECT Id, Course__c 
    //                     FROM  CourseAttendee__c 
    //                     WHERE Course__c =: courseId 
    //                     AND   Attendee__r.User__c =: UserInfo.getUserId()
    //                 ];
    //     return attendees;
    // }

    // @AuraEnabled(cacheable=true)
    // public static User fetchUserDetails(){
    //     User user = new User();
    //     try {
    //         user = [SELECT Id, Name, Email, Title, CompanyName FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    //     return user;
    // }
}