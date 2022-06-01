public class TransactionLogHandler {
    
    public static void doHandleException(System.Exception ex , String processName){
        //TransactionLogHandler.doHandleException();
        ErrorLog__c  transactionLog = new ErrorLog__c (
            LogDetails__c  = ex.getStackTraceString() 
            +'<br/> <strong> Mesage is </strong> ' + ex.getMessage() 
            + '<br/> ' + ex.getCause() +' <br/> '+ ex.getTypeName()+' <br/> '
            +ex.getLineNumber(),
            LogDateTime__c  = System.Now(),
            ProcessName__c    = processName
        );
        insert transactionLog;
    }
      public static void doHandleExceptionWithError(String errors , String processName){
        //TransactionLogHandler.doHandleException();
        ErrorLog__c  transactionLog = new ErrorLog__c (
            LogDetails__c  =errors,
            LogDateTime__c  = System.Now(),
            ProcessName__c    = processName
        );
        insert transactionLog;
    }

}