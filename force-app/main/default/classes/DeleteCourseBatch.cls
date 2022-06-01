public class DeleteCourseBatch implements Database.Batchable<sObject>{
    
    public Database.QueryLocator start(Database.BatchableContext batchContext){
      String Query ='Select id, name from Course__c Where Live__c = true AND EndDateTime__c < LAST_N_MONTHS :2';
        return Database.getQueryLocator(Query);
    }
    public void execute(Database.BatchableContext batchContext ,List<Course__c> courseList){
        if(!courseList.isEmpty()){
            List<Database.DeleteResult> deleteResult =Database.delete(courseList);
            for (Database.DeleteResult dr : deleteResult){
                if(!dr.isSuccess()){
                    List<Database.Error>errors =dr.getErrors();
                    String errorInString =String.join(errors, ',');
                    TransactionLogHandler.doHandleExceptionWithError(errorInString,'DeleteCourseBatch');
                }
            }
        }
    }
    public void finish(Database.BatchableContext batchContext){
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
               
            mail.setSubject('Batch Processing completed');
            List<String> toAddress = new List<String>();
            toAddress.add('vishalphule2000@gmail.com');
            mail.setToAddresses( toAddress );
            mail.setSenderDisplayName('VSFDC Developer');
            
             mail.setHtmlBody('The DeleteCourseBatch Batch Processing has been Completed ');
       // List<Messaging.SingleEmailMessage> emails =new List<Messaging.SingleEmailMessage>{mail};
       //  Messaging.sendEmail(emails);
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});
    }

}