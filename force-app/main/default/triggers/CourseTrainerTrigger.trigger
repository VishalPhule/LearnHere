trigger CourseTrainerTrigger on CourseTrainer__c (before insert, before update ) {

	// Step 1 - Get the speaker id & event id 
	// Step 2 - SOQL on Event to get the Start Date and Put them into a Map
	// Step 3 - SOQL on Event - Spekaer to get the Related Speaker along with the Event Start Date
	// Step 4 - Check the Conditions and throw the Error

    //Step 1 -  Start
	Set<Id> trainerIdsSet = new Set<Id>();
    Set<Id> courseIdsSet = new Set<Id>();

    for( CourseTrainer__c es : Trigger.New ){
         trainerIdsSet.add(es.Trainer__c);
         courseIdsSet.add(es.Course__c);
    }
    //Step 1 -  End 
    /*
     * 10 Course Records
     * 1 (CourseId) K  --  DateTime ( Course Start_DateTime__c ) V
     */ 
    // Step 2 Start
    Map<Id, DateTime> requestedCourses = new Map<Id, DateTime>();

    List<Course__c> relatedCourseList = [Select Id, StartDateTime__c From Course__c 
                                       Where Id IN : courseIdsSet];

    for(Course__c evt : relatedCourseList ){
        requestedCourses.put(evt.Id, evt.StartDateTime__c);
    }
    // Step 2 End


    // Step 3 - Start
    List<CourseTrainer__c> relatedCourseTrainerList = [ SELECT Id, Course__c,Trainer__c,
                                               Course__r.StartDateTime__c
                                               From CourseTrainer__c
                                               WHERE Trainer__c IN : trainerIdsSet];

    // Step 3 - End 

    // Step 4 - Start
    for( CourseTrainer__c es : Trigger.New ){ // - Salesforce Geek
        DateTime bookingTime = requestedCourses.get(es.Course__c); 
        // DateTime for that Course which is associated with this new Event-Speaker Record

        for(CourseTrainer__c es1 : relatedCourseTrainerList) {
            // Amit Singh == Salesforce Geek => false
            // Amit Choudhary == Salesforce Geek => false
            // Salesforce Geek == Salesforce Geek => true
            if(es1.Trainer__c == es.Trainer__c && es1.Course__r.StartDateTime__c == bookingTime ){
                es.Trainer__c.addError('The Trainer is already booked at that time');
                es.addError('The Trainer is already booked at that time');
            }
        }

    }
    // Step 4 - End

}