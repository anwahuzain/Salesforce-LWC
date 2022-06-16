import { LightningElement, wire } from 'lwc';
import getListOfAccounts from '@salesforce/apex/Accounts.getListOfAccounts';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ApexCall extends LightningElement {
    selectedRecIdValue;
    @wire(getListOfAccounts) lstOfAccounts;

    handleChanges(event){
        this.selectedRecIdValue = event.target.value;
       // console.log("selectedRecIdValue----------"+this.selectedRecIdValue);
    }

    deleteAccountRecord(event){
        deleteRecord(this.selectedRecIdValue)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Is  Deleted',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error While Deleting record',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }
}