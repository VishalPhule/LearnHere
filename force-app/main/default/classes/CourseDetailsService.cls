public with sharing class CourseDetailsService {

    @AuraEnabled
    public static List<Course__c>upcomingCourses (){
        List<Course__c> courseList =[
            SELECT 
            Id, 
            Name , 
            Name__c ,CourseDetails__c,Location__c,Location__r.Name,CourseOrganizer__c,
            StartDateTime__c,CourseOrganizer__r.Name
            FROM Course__c 
            WHERE StartDateTime__c >=Today AND Live__c =true
            WITH SECURITY_ENFORCED
            ];
            return courseList;
    }
            @AuraEnabled(cacheable=true)
            public static List<Course__c> fetchPastCourses(){
                List<Course__c> courseList = new List<Course__c>();
                try {
                    courseList = [SELECT Id, Location__c, 
                                    Location__r.Name, Name__c, StartDateTime__c, TitleImageUrl__c
                                    FROM Course__c
                                    WHERE StartDateTime__c <= TODAY
                                    WITH SECURITY_ENFORCED
                                ];
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                }
                return courseList;
    }
}