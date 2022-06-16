public with sharing class getRecordDataController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getRecords() {
        return [SELECT Id, FirstName, LastName, Phone, Account.Name, Email FROM Contact LIMIT 10];
    }
}
