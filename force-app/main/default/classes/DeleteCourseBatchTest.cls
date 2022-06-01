@isTest
public class DeleteCourseBatchTest {
    
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
       }
     @isTest
    static void sendEmailTest(){
        Test.startTest();
       String jobId = Database.executeBatch(new DeleteCourseBatch(),250);
        Test.stopTest();
    }
}