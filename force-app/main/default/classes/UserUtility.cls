public with sharing class UserUtility {
    
  @AuraEnabled(cacheable=True)
  public static string fetchUserName(){
    return UserInfo.getName();
  }
}
