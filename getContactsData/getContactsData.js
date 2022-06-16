import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/getRecordDataController.getContacts';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

const columns = [
    { label: 'Id', fieldName: 'Id'},
    { label: 'First Name', fieldName: 'FirstName', editable: true},
    { label: 'Last Name', fieldName: 'LastName', editable: true},
    { label: 'Phone', fieldName: 'Phone', editable: true},
    { label: 'Account Name', fieldName: 'AccountName'},
    { label: 'Email', fieldName: 'Email', editable : true}
];

export default class GetContactsData extends LightningElement {
    columns = columns;
    @track contactList;
    fldsItemValues = [];

    @wire(getContacts) wiredContacts({data,error}){    
        if (data) {
            let contactData = JSON.parse(JSON.stringify(data));      
            contactData.forEach(record => {
                if (record.AccountId) {
                    record.AccountName = record.Account.Name;
                }
            });
            this.contactList = contactData;
            console.log(data);
        } else if(error) {
            console.log(error);
        }
    };

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }
 
    async refresh() {
        await refreshApex(this.contactData);
    }
}