//TODO:This autogenerated class includes the basics for a Registration
//Handler class. You will need to customize it to ensure it meets your needs and
//the data provided by the third party.

global class AutocreatedRegHandler1654065689645 implements Auth.RegistrationHandler{
	private static final String ORG_SUFFIX = '.sso.badge.org';
    private static final String DEFAULT_ACCOUNTNAME = 'Customers';
    private static final String EXTERNAL_USER_PROFILE = 'Customers';
    private static final String INTERNAL_USER_PROFILE = 'Standard User';    
    
/**
 * Let anyone register as long as the required fields are supplied
 * 
 * We require email, lastName, firstName
 * 
 * @data - the user's info from the Auth Provider
 **/ 
global boolean canCreateUser(Auth.UserData data) {
    System.debug('canCreateUser was called for ' + (data != null ? data.email : 'null'));
    Boolean retVal = (data != null 
            && data.email != null
            && data.lastName != null
            && data.firstName != null);
    
    System.debug('data.username='+data.username);
    System.debug('data.email='+data.email);
    System.debug('data.lastName='+data.lastName);
    System.debug('data.firstName='+data.firstName);
    
    return retVal;
//global boolean canCreateUser(Auth.UserData data) {
	//TODO: Check whether we want to allow creation of a user with this data
	//Set<String> s = new Set<String>{'usernamea', 'usernameb', 'usernamec'};
	//if(s.contains(data.username)) {
		//return true;
	//}
//	return false;
}

global User createUser(Id portalId, Auth.UserData data){
    if(!canCreateUser(data)) {
        // Returning null signals the auth framework we can't create the user
        return null;
    }
    
    // Is this a Community Context?
    if(data.attributeMap.containsKey('sfdc_networkid')) {
        System.debug('Registering Community user: ' + data.email);
        Id contactId;
        // To keep things modular, we're creating the Contact in a separate method
        contactId = createContact(data);
        System.debug('Created contact: '+ contactId);
        
        // You'd likely use other logic to assign the Profile
        Profile p = [SELECT Id FROM profile WHERE name=:EXTERNAL_USER_PROFILE];
        System.debug('Found profile: '+ p);

        // Keeping it modular, we initialize the user in another method
        User u = createUser(data,p);
        
        u.contactId = contactId;
        return u;
    } else {
        //This is not a community, so we Assign an internal profile
        Profile p = [SELECT Id FROM profile WHERE name=:INTERNAL_USER_PROFILE];
        System.debug('Found profile: '+ p);
        
        // Keeping it modular, we initialize the user in another method
        User u = createUser(data,p);

        return u;
    }
}
global void updateUser(Id userId, Id portalId, Auth.UserData data){
    System.debug('Update User called for: ' + data.email);
    
    User u = new User(id=userId);
    u.email = data.email;
    u.lastName = data.lastName;
    u.firstName = data.firstName;
    update(u);
}
  /**
     * Create a Contact
     * 
     * @param data - Facebook provided context for the User
     **/
    private Id createContact(Auth.UserData data){
        Contact contact = new Contact();
        contact.LastName = data.lastName;
        contact.FirstName = data.firstName;
        contact.Email = data.email;
        
        // set Account Id
        if (data.attributemap.get('accountId') != null){
            contact.accountId = data.attributemap.get('accountId');
        } else {
            List<Account> accounts = [select Id from Account where Name =:DEFAULT_ACCOUNTNAME];
            System.debug('Found account: ' + accounts);
            
            contact.accountId = accounts[0].Id;            
        }
        insert contact;

        System.debug('Contact created for ' + data.email + ' id=' + contact.id);

        return contact.id; 
    }

    
    /**
     * Create and initialize the User but don't save it yet
     * 
     * @param data - the provided User context from FaceBook
     * @param p - the Profile we are going to assign to this user
     * 
     * @return User that has been initialized but not Saved
     **/ 
    private User createUser(Auth.UserData data, Profile p) {
        User u = new User();
        u.username = data.email + ORG_SUFFIX;
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.firstName + data.lastName;
        
        //Alias must be 8 characters or less
        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = UserInfo.getLanguage();
        u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.profileId = p.Id;
        return u;
    }        
}