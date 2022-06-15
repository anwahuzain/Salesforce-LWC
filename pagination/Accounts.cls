public with sharing class Accounts {

    @AuraEnabled(cacheable=true)
    public static List<Account> getListOfAccounts(){

        return [SELECT Id, Name, AccountNumber 
                FROM Account];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){

        return [SELECT FirstName 
                FROM Contact LIMIT 15];
    }
}