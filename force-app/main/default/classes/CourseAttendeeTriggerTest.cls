@isTest
public class CourseAttendeeTriggerTest {
	
    @testSetup
    public static void setupData(){
        
        CourseOrganizer__c  org = new CourseOrganizer__c (
            Name = 'Vishal Phule',
            Phone__c = '8605921191',
            Email__c = 'salesforce.developers.vm@gmail.com',
            AlternativePhone__c  = '8605921191',
            AlternativeEmail__c ='salesforce.developers.vm@gmail.com'
        );
        insert org;
        
   Course__c course = new Course__c(
            Name__c = 'Java FullStack Course',
          CourseOrganizer__c  = org.Id,
           CourseType__c = 'Virtual',
            Frequency__c  = 'Weekly',
            MaxSeats__c  = 199,
            Recurring__c = true,
            Live__c = true,
            StartDateTime__c = System.now(),
            EndDateTime__c  = System.now().addDays(3)
        );
        insert course;
        Attendee__c att = new Attendee__c(
            Name = 'Vignesh Phule',
            Email__c = 'vignesh.phule@gmail.com',
            Phone__c = '9130756459'
        );
        insert att;
        
        CourseAttendee__c courseAtt = new CourseAttendee__c(Course__c = course.Id, Attendee__c = att.Id);
        insert courseAtt;
    }
    
    @isTest
    static void sendEmailTest(){
        Test.startTest();
        try{
            integer i = 10/0;
        }catch(System.Exception ex ){
            
        }
        Test.stopTest();
    }
}